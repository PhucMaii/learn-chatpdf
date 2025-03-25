/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pinecone } from '@pinecone-database/pinecone';
import { downloadFromS3 } from './s3-server';
import { Document, RecursiveCharacterTextSplitter } from '@pinecone-database/doc-splitter';
import { getEmbeddings } from './embedding';
import md5 from 'md5';
import { convertToAscii } from './utils';
import { getTextExtractor } from 'office-text-extractor';
import { readFile } from 'node:fs/promises';

let pinecone: Pinecone | null = null;

const pineconeApi = process.env.NEXT_PUBLIC_PINECONE_API_KEY;

if (!pineconeApi) {
  throw new Error('Missing Pinecone API key');
}

export const getPineconeClient = async () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: pineconeApi,
    });
  }
  return pinecone;
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};
export async function loadS3IntoPinecone(
  input: string,
  type: 'fileKey' | 'url' = 'fileKey',
) {
  // 1. Obtain the pdf -> download and read from pdf

  // console.log('downloading s3 into file system');
  const extractor = getTextExtractor();
  let text = '';
  if (type === 'fileKey') {
    const fileName = await downloadFromS3(input);
    console.log(fileName);
    if (!fileName) {
      throw new Error('Failed to download file');
    }
  
    const buffer = await readFile(fileName);
    text = await extractor.extractText({ input: buffer, type: 'buffer' });
  } else if (type === 'url') {
    text = await extractor.extractText({ input: input, type: 'url' });
  }
  console.log('text', text);

  // const loader = new PDFLoader(fileName);
  // const pages = (await loader.load()) as PDFPage[];

  // if (pages.length === 0) {
  //   throw new Error(
  //     'The file is empty, invalid or corrupted. Please upload a Standard PDF file.',
  //   );
  // }
    // 2. Split text into manageable chunks
    const maxChunkSize = 8192; // Adjust based on model's limit
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: maxChunkSize,
      chunkOverlap: 200, // Maintains context across chunks
    });
  
    const documents = await splitter.splitDocuments([
      new Document({
        pageContent: text,
        metadata: {
          pageNumber: 1,
          text: truncateStringByBytes(text, 36000),
        },
      }),
    ]);
  
    console.log(`Split into ${documents.length} chunks`);
  
    // 3. Embed each document chunk
    const vectors: any[] = await Promise.all(documents.map(embedDocuments));
  
    // 4. Upload to Pinecone
    const client = await getPineconeClient();
    const pineconeIndex = client.Index('learn-chatpdf');
  
    const namespace = convertToAscii(input);
  
    await chunkedUpsert(pineconeIndex, vectors, namespace, 10);
  
    console.log('Upsert successful');
    return vectors;

  // // 2. Split and segment the pdf
  // const documents = await Promise.all(
  //   pages.map((page) => prepareDocument(page)),
  // );

  // // 3. Vectorise and embed individual documents
  // const vectors = await Promise.all(documents.flat().map(embedDocuments));

  // // 4. Upload to Pinecone
  // const client = await getPineconeClient();
  // const pineconeIndex = client.Index('learn-chatpdf');

  // const namespace = convertToAscii(fileKey);

  // await chunkedUpsert(pineconeIndex, vectors, namespace, 10);

  // console.log('upsert successfully', documents[0]);
  // return vectors;
  // 2. Create a single document object
  // const document = new Document({
  //   pageContent: truncateStringByBytes(text, 36000),
  //   metadata: {
  //     pageNumber: 1, // Assuming all text is from one source
  //     text: truncateStringByBytes(text, 36000),
  //   },
  // });

  // // 3. Embed the document
  // const vector: any = await embedDocuments(document);

  // // 4. Upload to Pinecone
  // const client = await getPineconeClient();
  // const pineconeIndex = client.Index('learn-chatpdf');

  // const namespace = convertToAscii(input);

  // await pineconeIndex.namespace(namespace).upsert([vector]);

  // console.log('Upsert successful');
  // return vector;
}

async function embedDocuments(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    };
  } catch (error) {
    console.log('Error embedding document: ', error);
    throw error;
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, bytes));
};

async function prepareDocument(page: PDFPage) {
  // eslint-disable-next-line prefer-const
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, ' ');

  // split the docs
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);

  return docs;
}

async function chunkedUpsert(
  pineconeIndex: any,
  vectors: any,
  namespace: string,
  chunkSize = 10,
) {
  if (vectors.length === 0) {
    console.log('No vectors to upsert');
    throw new Error('No vectors to upsert');
  }

  if (vectors.length <= 10) {
    await pineconeIndex.namespace(namespace).upsert([...vectors]);
    return;
  }

  const chunks = [];

  for (let i = 0; i < vectors.length; i += chunkSize) {
    chunks.push(vectors.slice(i, i + chunkSize));
  }

  for (const chunk of chunks) {
    await pineconeIndex.namespace(namespace).upsert(chunk);
  }

  return;
}
