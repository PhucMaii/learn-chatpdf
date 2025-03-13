import { getPineconeClient } from './pinecone';
import { convertToAscii } from './utils';
import { getEmbeddings } from './embedding';

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string,
) {
  const pinecone = await getPineconeClient();

  const index: any = pinecone.Index('learn-chatpdf');

  try {
    const namespace = convertToAscii(fileKey);
    console.log(namespace, 'namespace')
    const queryResult = await index.namespace(namespace).query({
      topK: 10,
      vector: embeddings,
      includeMetadata: true,
    });


    
    console.log({queryResult, fileKey, embeddings});

    return queryResult.matches || [];
  } catch (error) {
    console.error('Error querying embeddings: ', error);
  }
}

export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(query);
  console.log(queryEmbeddings, 'queryEmbeddings');
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

  console.log({matches, queryEmbeddings});

  const qualifyingDocs = matches.filter(
    (match: any) => match.score && match.score > 0.5,
  );

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  const docs = qualifyingDocs.map((match: any) => {
    return (match.metadata as Metadata).text;
  });

  console.log({docs, qualifyingDocs});

  // 5 vectors
  return docs.join('\n').substring(0, 3000);
}
