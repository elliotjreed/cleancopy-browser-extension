const normaliseSpaces = (text: string): string => {
  // Unicode space separators: U+00A0, U+1680, U+2000–U+200A, U+202F, U+205F, U+3000
  return text.replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, " ");
};

const normaliseDashes = (text: string): string => {
  // Dash variations: U+2012–U+2015 (figure dash, en dash, em dash, horizontal bar), U+2212 (minus)
  return text.replace(/[\u2012-\u2015\u2212]/g, "-");
};

const normaliseQuotes = (text: string): string => {
  // Smart and typographic quotes: U+2018–U+201F (curly quotes), U+2032–U+2036 (prime), U+00AB, U+00BB (guillemets)
  return text
    .replace(/[\u2018\u2019]/g, "'") // Single quotes
    .replace(/[\u201C\u201D]/g, '"') // Double quotes
    .replace(/[\u201A\u201B\u201E\u201F]/g, '"') // Other double quote variants
    .replace(/[\u2032-\u2036]/g, "'") // Prime symbols
    .replace(/[\u00AB\u00BB]/g, '"'); // Guillemets (French quotation marks)
};

const normalisePunctuation = (text: string): string => {
  // Ellipsis, bullets, and full-width punctuation normalization
  return text
    .replace(/\u2026/g, "...") // Ellipsis: U+2026
    .replace(/[\u2022\u00B7]/g, "*") // Bullets: U+2022, U+00B7
    .replace(/[\uFF01-\uFF5E]/g, (char) => {
      // Full-width punctuation: U+FF01–U+FF5E
      return String.fromCharCode(char.charCodeAt(0) - 0xfee0);
    });
};

const removeHiddenCharacters = (text: string): string => {
  // Hidden characters:
  // - U+00AD (soft hyphen)
  // - U+180E (Mongolian vowel separator)
  // - U+200B-U+200F (zero width spaces, etc)
  // - U+202A-U+202E (text direction formatting)
  // - U+2060-U+206F (word joiners, invisible math operators, etc)
  // - U+FE00-U+FE0F (variation selectors)
  // - U+FEFF (zero width non-breaking space)
  return text.replace(/[\u00AD\u180E\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFE00-\uFE0F\uFEFF]/g, "");
};

const cleanNonStandardCharacters = (text: string): string => {
  // This regex pattern aims to keep:
  // - ASCII printable characters (0x20-0x7E)
  // - Emoji characters (mostly in Supplementary Multilingual Plane and above)
  // - Common whitespace and newlines

  // This is complex because we want to KEEP emojis which are in high Unicode ranges
  // while removing other non-ASCII characters

  const characters: string[] = [...text];

  return characters
    .filter((character: string): boolean => {
      const code = character.codePointAt(0) as number;

      // Keep ASCII printable characters (including space)
      if (code >= 0x20 && code <= 0x7e) {
        return true;
      }

      // Keep common whitespace and newlines
      if (character === "\n" || character === "\r" || character === "\t") {
        return true;
      }

      // Keep emojis (a simplified check - not exhaustive)
      // Most emojis are in ranges:
      // - Emoticons: 0x1F600-0x1F64F
      // - Misc symbols and pictographs: 0x1F300-0x1F5FF
      // - Transport and map symbols: 0x1F680-0x1F6FF
      // - Supplemental symbols and pictographs: 0x1F900-0x1F9FF
      if (
        (code >= 0x1f300 && code <= 0x1f64f) ||
        (code >= 0x1f680 && code <= 0x1f6ff) ||
        (code >= 0x1f900 && code <= 0x1f9ff) ||
        (code >= 0x2600 && code <= 0x26ff)
      ) {
        return true;
      }

      return false;
    })
    .join("");
};

export const normaliseText = (text: string): string => {
  let result: string = text;

  result = normaliseSpaces(result);

  result = normaliseDashes(result);

  result = normaliseQuotes(result);

  result = normalisePunctuation(result);

  result = removeHiddenCharacters(result);

  return cleanNonStandardCharacters(result);
};
