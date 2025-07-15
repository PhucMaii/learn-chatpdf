export const parseStringResponse = (content: string) => {
  const cleaned = content
    .replace(/\\n/g, '\\n') // keep escaped \n
    .replace(/\n/g, '\\n') // escape raw newlines
    .replace(/\r/g, '') // remove \r if any
    .replace(/\\'/g, "'") // fix escaped single quotes
    .replace(/([\w])"([\w])/g, '$1\\"$2') // edge case fix for quote in middle of word
    .replace(/“|”/g, '"'); // convert curly quotes to straight

  return JSON.parse(cleaned);
};
