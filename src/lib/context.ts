import { getPineconeClient } from './pinecone';
import { convertToAscii } from './utils';
import { getEmbeddings } from './embedding';
import { DrizzleMedia } from './db/drizzleType';

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  projectMedias: DrizzleMedia[],
) {
  const pinecone = await getPineconeClient();

  const index: any = pinecone.Index('learn-chatpdf');

  try {
    const queryResulePromises = projectMedias.map((media) => {
      const namespace =
        media.type === 'url'
          ? convertToAscii(media.url || '')
          : convertToAscii(media.fileKey || '');

      return index.namespace(namespace).query({
        topK: 15,
        vector: embeddings,
        includeMetadata: true,
      });
    });

    const queryResults = await Promise.all(queryResulePromises);

    const queryResultMatches = queryResults.flatMap(
      (queryResult) => queryResult.matches || [],
    );

    // console.log({ queryResults }, 'queryResultMatches');

    return queryResultMatches;
  } catch (error) {
    console.error('Error querying embeddings: ', error);
    return [];
  }
}

export async function getContext(
  query: string,
  medias: DrizzleMedia[],
  vectors: any = null,
) {
  // console.log(medias, 'medias');
  // const queryEmbeddings = await getEmbeddings(query);
  // // console.log(queryEmbeddings, 'queryEmbeddings');
  // let matches;

  // if (vectors) {
  //   console.log({ queryEmbeddings, vectors }, 'vectors');
  //   // const similarity = cosineSimilarity(queryEmbeddings, vectors.values);
  //   // matches = [{
  //   //   ...vectors,
  //   //   score: similarity,
  //   // }]
  //   matches = vectors.map((vectorData: any) => {
  //     const similarity = cosineSimilarity(queryEmbeddings, vectorData.values);

  //     return {
  //       ...vectorData,
  //       score: similarity,
  //     };
  //   });
  // } else {
  //   matches = await getMatchesFromEmbeddings(queryEmbeddings, medias);
  // }

  // // console.log({ matches, queryEmbeddings });

  // const qualifyingDocs = matches.filter(
  //   (match: any) => match.score && match.score > 0.5,
  // );

  // type Metadata = {
  //   text: string;
  //   pageNumber: number;
  // };

  // const docs = qualifyingDocs.map((match: any) => {
  //   return (match.metadata as Metadata).text;
  // });

  // // console.log({ docs, qualifyingDocs });

  // // 5 vectors
  // return docs.join('\n').substring(0, 3000);
  // Get embeddings for the last message
  const queryEmbeddings = await getEmbeddings(query);

  let matches: any[] = [];

  if (vectors) {
    // console.log({ queryEmbeddings, vectors }, 'vectors');
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
    // Get vectors from Pinecone for each media
    const pinecone = await getPineconeClient();
    const index = pinecone.Index('learn-chatpdf');

    // Query each media's namespace and combine results
    const queryPromises = medias.map(async (media) => {
      const namespace =
        media.type === 'url'
          ? convertToAscii(media.url || '')
          : convertToAscii(media.fileKey || '');

      try {
        const queryResult = await index.namespace(namespace).query({
          topK: 15,
          vector: queryEmbeddings,
          includeMetadata: true,
        });
        return queryResult.matches || [];
      } catch (error) {
        console.error(`Error querying namespace ${namespace}:`, error);
        return [];
      }
    });

    const queryResults = await Promise.all(queryPromises);
    matches = queryResults.flat();
  }

  // const allMatches = queryResults.flat();

  // Sort matches by score
  const sortedMatches = matches.sort((a, b) => (b.score || 0) - (a.score || 0));

  // Filter and get top matches
  const qualifyingDocs = sortedMatches
    .filter((match) => match.score && match.score > 0.5)
    .slice(0, 5); // Get top 5 matches

  // Extract text from matches
  const contextText = qualifyingDocs
    .map((match) => match.metadata?.text || '')
    .join('\n')
    .substring(0, 3000);

  return contextText;
}

function cosineSimilarity(vec1: number[], vec2: number[]): number {
  const dotProduct = vec1.reduce((acc, val, idx) => acc + val * vec2[idx], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((acc, val) => acc + val * val, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (magnitude1 * magnitude2);
}

export const getVectorsFromMedias = async (medias: DrizzleMedia[]) => {
  const pinecone = await getPineconeClient();
  const index = pinecone.Index('learn-chatpdf');

  const fetchPromises = medias.map(async (media) => {
    const namespace =
      media.type === 'url'
        ? convertToAscii(media.url || '')
        : convertToAscii(media.fileKey || '');

    try {
      // Fetch all vectors from the namespace
      const fetchResult = await index.namespace(namespace).fetch({
        ids: [], // Empty array means fetch all vectors
        includeMetadata: true,
      } as any); // Using type assertion since Pinecone types are not fully accurate

      // console.log({ fetchResult }, 'fetchResult');
      return Object.values(fetchResult || {});
    } catch (error) {
      console.error(
        `Error fetching vectors from namespace ${namespace}:`,
        error,
      );
      return [];
    }
  });

  const fetchResults = await Promise.all(fetchPromises);
  return fetchResults.flat();
};
