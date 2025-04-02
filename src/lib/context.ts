import { getPineconeClient } from './pinecone';
import { convertToAscii } from './utils';
import { getEmbeddings } from './embedding';

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  input: string,
) {
  const pinecone = await getPineconeClient();

  const index: any = pinecone.Index('learn-chatpdf');

  try {
    const namespace = convertToAscii(input);
    // console.log(namespace, 'namespace');
    const queryResult = await index.namespace(namespace).query({
      topK: 10,
      vector: embeddings,
      includeMetadata: true,
    });

    // console.log({ queryResult, fileKey, embeddings });

    return queryResult.matches || [];
  } catch (error) {
    console.error('Error querying embeddings: ', error);
  }
}

export async function getContext(
  query: string,
  input: string,
  vectors: any = null,
) {
  // console.log(vectors, 'VECTORS');
  const queryEmbeddings = await getEmbeddings(query);
  // console.log(queryEmbeddings, 'queryEmbeddings');
  let matches;

  if (vectors) {
    console.log({ queryEmbeddings, vectors }, 'vectors');
    // const similarity = cosineSimilarity(queryEmbeddings, vectors.values);
    // matches = [{
    //   ...vectors,
    //   score: similarity,
    // }]
    matches = vectors.map((vectorData: any) => {
      const similarity = cosineSimilarity(queryEmbeddings, vectorData.values);

      return {
        ...vectorData,
        score: similarity,
      };
    });
  } else {
    matches = await getMatchesFromEmbeddings(queryEmbeddings, input);
  }

  // console.log({ matches, queryEmbeddings });

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

  // console.log({ docs, qualifyingDocs });

  // 5 vectors
  return docs.join('\n').substring(0, 3000);
}

function cosineSimilarity(vec1: number[], vec2: number[]): number {
  const dotProduct = vec1.reduce((acc, val, idx) => acc + val * vec2[idx], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((acc, val) => acc + val * val, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (magnitude1 * magnitude2);
}
