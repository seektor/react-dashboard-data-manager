const REMOVE_NEW_LINES = /(\r\n|\n|\r)/gm;
const EXCESS_WHITE_SPACE = /\s+/g;

export const formatQueries = (sqlContent: string): string[] =>
  sqlContent
    .replace(REMOVE_NEW_LINES, " ")
    .replace(EXCESS_WHITE_SPACE, " ")
    .split(";")
    .map((query) => query.trim())
    .filter((query) => query);
