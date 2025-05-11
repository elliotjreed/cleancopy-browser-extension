const normaliseSpaces = (text: string): string => {
  // Unicode space separators: U+00A0, U+1680, U+2000–U+200A, U+202F, U+205F, U+3000
  return text.replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, " ");
};

const normaliseDashes = (text: string): string => {
  // Dash variations: U+2012–U+2015 (figure dash, en dash, em dash, horizontal bar), U+2212 (minus)
  // Replace em dashes with a hyphen with a space either side, where the original em dash does not already have a space both sides
  return text
    .replace(/(\S)\u2014(\S)|( \u2014 )/g, function (match, p1, p2, p3): string {
      if (p1) {
        return p1 + " - " + p2;
      } else {
        return " - ";
      }
    })
    .replace(/[\u2012-\u2015\u2212]/g, "-");
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
  // Ellipsis and full-width punctuation normalization
  return text
    .replace(/\u2026/g, "...") // Ellipsis: U+2026
    .replace(/[\uFF01-\uFF5E]/g, (char: string): string => String.fromCharCode(char.charCodeAt(0) - 0xfee0)); // Full-width punctuation: U+FF01–U+FF5E
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

export const normaliseText = (text: string): string => {
  let result: string = text;

  result = normaliseSpaces(result);

  result = normaliseDashes(result);

  result = normaliseQuotes(result);

  result = normalisePunctuation(result);

  result = removeHiddenCharacters(result);

  return result;
};
