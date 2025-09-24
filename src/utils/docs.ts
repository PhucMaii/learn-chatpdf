import { DrizzleMedia } from '@/lib/db/drizzleType';
import { convertToAscii } from '@/lib/utils';

export const resolveTargetDocs = (userText: string, medias: DrizzleMedia[]) => {
  const candidates = medias.map((m) => {
    const label = m.fileName || m.url || m.fileKey || '';
    return {
      id: m.id,
      label,
      namespace:
        m.type === 'url'
          ? convertToAscii(m.url || '')
          : convertToAscii(m.fileKey || ''),
    };
  });

  // Try exact contains
  const exactHits = candidates.filter((c) =>
    userText.includes((c.label || '').toLowerCase()),
  );

  if (exactHits.length > 0) {
    return exactHits;
  }

  // Try fuzzy matches
  const labels = candidates.map((c) => c.label || '');
  let bestMatch = null;
  let highestScore = 0;
  for (const label of labels) {
    const score = getStringSimilarityScore(userText, label);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = label;
    }
  }

  if (bestMatch) {
    const match = candidates.find((c) => c.label === bestMatch);
    return [match];
  }

  // Return all if no match
  return candidates;
};

/**
 * Compare two strings and return a similarity score between 0 and 1
 * @param text1 First string to compare
 * @param text2 Second string to compare
 * @returns Similarity score (0 = no similarity, 1 = identical)
 *
 * @example
 * getStringSimilarityScore("hello world", "hello world") // 1.0
 * getStringSimilarityScore("hello", "helo") // 0.8
 * getStringSimilarityScore("cat", "dog") // 0.0
 */
export const getStringSimilarityScore = (
  text1: string,
  text2: string,
): number => {
  // Handle edge cases
  if (!text1 || !text2) return 0;
  if (text1 === text2) return 1;

  // Normalize strings (lowercase, trim, remove extra spaces)
  const normalize = (str: string) =>
    str.toLowerCase().trim().replace(/\s+/g, ' ');
  const normalized1 = normalize(text1);
  const normalized2 = normalize(text2);

  // If normalized strings are identical
  if (normalized1 === normalized2) return 1;

  // Calculate Levenshtein distance-based similarity
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator, // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  };

  // Calculate Jaccard similarity (word-based)
  const getJaccardSimilarity = (str1: string, str2: string): number => {
    const words1 = new Set(str1.split(/\s+/));
    const words2 = new Set(str2.split(/\s+/));

    const intersection = new Set(
      Array.from(words1).filter((word) => words2.has(word)),
    );
    const union = new Set(Array.from(words1).concat(Array.from(words2)));

    return intersection.size / union.size;
  };

  // Calculate character-based similarity
  const getCharacterSimilarity = (str1: string, str2: string): number => {
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1;

    const distance = levenshteinDistance(str1, str2);
    return 1 - distance / maxLength;
  };

  // Calculate substring similarity
  const getSubstringSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1;

    // Check if shorter string is contained in longer string
    if (longer.includes(shorter)) {
      return shorter.length / longer.length;
    }

    // Find longest common substring
    let maxLength = 0;
    for (let i = 0; i < shorter.length; i++) {
      for (let j = i + 1; j <= shorter.length; j++) {
        const substring = shorter.substring(i, j);
        if (longer.includes(substring)) {
          maxLength = Math.max(maxLength, substring.length);
        }
      }
    }

    return maxLength / longer.length;
  };

  // Calculate weighted average of different similarity metrics
  const characterSimilarity = getCharacterSimilarity(normalized1, normalized2);
  const jaccardSimilarity = getJaccardSimilarity(normalized1, normalized2);
  const substringSimilarity = getSubstringSimilarity(normalized1, normalized2);

  // Weighted combination (adjust weights based on your use case)
  const weights = {
    character: 0.4, // Character-level similarity
    jaccard: 0.4, // Word-level similarity
    substring: 0.2, // Substring similarity
  };

  const finalScore =
    characterSimilarity * weights.character +
    jaccardSimilarity * weights.jaccard +
    substringSimilarity * weights.substring;

  // Round to 4 decimal places
  return Math.round(finalScore * 10000) / 10000;
};

export type TargetDoc = { id: number | string; label: string; namespace: string };
export type RawMatch = {
  id: string;
  score?: number;
  metadata?: {
    text?: string;
    page?: number;
    source?: string;
    [k: string]: any;
  };
};
export type PerDocChunk = {
  chunkId: string; // e.g. "167#1"
  score: number;
  text: string;
  source: string; // readable label
  page?: number;
};
type PerDocTop = { doc: TargetDoc; chunks: PerDocChunk[] };

function squeeze(text = '', max = 240) {
  if (text.length <= max) return text.trim();
  // first sentence or hard slice + ellipsis
  const dot = text.indexOf('.');
  const end = dot > 40 && dot < max ? dot + 1 : max;
  return (text.slice(0, end).trim() + ' …').trim();
}

export function buildPerDocTop(
  targetDocs: TargetDoc[],
  queryResults: RawMatch[][], // align by index with targetDocs
  { perDocTopK = 5, minScore = 0.55 } = {},
): PerDocTop[] {
  const perDocTop: PerDocTop[] = [];

  for (let i = 0; i < targetDocs.length; i++) {
    const doc = targetDocs[i];
    const matches = (queryResults[i] || []).filter(Boolean);

    const chunks = matches
      .filter((m) => (m.score ?? 0) >= minScore)
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, perDocTopK)
      .map(
        (m, idx): PerDocChunk => ({
          chunkId: `${doc.id}#${idx + 1}`,
          score: m.score ?? 0,
          text: squeeze(m.metadata?.text || ''),
          source: doc.label,
          page: (m.metadata as any)?.page,
        }),
      )
      // drop empties
      .filter((c) => c.text && c.text.length > 0);

    if (chunks.length) perDocTop.push({ doc, chunks });
  }

  // order docs by their best chunk score desc
  perDocTop.sort((A, B) => {
    const aMax = Math.max(...A.chunks.map((c) => c.score));
    const bMax = Math.max(...B.chunks.map((c) => c.score));
    return bMax - aMax;
  });

  return perDocTop;
}

export function buildDocBlocks(perDocTop: PerDocTop[]) {
  return perDocTop
    .map(({ doc, chunks }, di) => {
      const head = `DOC ${di + 1}: "${doc.label}" (id=${doc.id})`;
      const body = chunks
        .map(
          (c, ci) =>
            `- [${di + 1}.${ci + 1}] ${c.text} ` +
            `(score=${c.score.toFixed(2)}${c.page != null ? `, p.${c.page}` : ''})`,
        )
        .join('\n');
      return `${head}\n${body}`;
    })
    .join('\n\n');
}
