import { describe, it, expect } from "vitest";
import { normaliseText } from "./textNormaliser";

describe("normaliseText", (): void => {
  describe("space normalisation", (): void => {
    it("should convert various Unicode space characters to standard spaces", (): void => {
      // Test each Unicode space character individually
      expect(normaliseText("test\u00A0test")).toBe("test test");
      expect(normaliseText("test\u1680test")).toBe("test test");
      expect(normaliseText("test\u2000test")).toBe("test test");
      expect(normaliseText("test\u200Atest")).toBe("test test");
      expect(normaliseText("test\u202Ftest")).toBe("test test");
      expect(normaliseText("test\u205Ftest")).toBe("test test");
      expect(normaliseText("test\u3000test")).toBe("test test");

      // Test a string with multiple different Unicode spaces
      const textWithMixedSpaces = "hello\u00A0world\u1680how\u2000are\u200Ayou\u202Ftoday\u205Ffriend\u3000?";
      expect(normaliseText(textWithMixedSpaces)).toBe("hello world how are you today friend ?");
    });

    it("should not modify standard spaces", (): void => {
      expect(normaliseText("hello world")).toBe("hello world");
    });
  });

  describe("dash normalisation", (): void => {
    it("should convert various dash characters to standard hyphens", (): void => {
      // Test each Unicode dash character individually
      expect(normaliseText("test\u2012test")).toBe("test-test");
      expect(normaliseText("test\u2013test")).toBe("test-test");
      expect(normaliseText("test\u2014test")).toBe("test - test");
      expect(normaliseText("test\u2015test")).toBe("test-test");
      expect(normaliseText("test\u2212test")).toBe("test-test");

      // Test a string with multiple different dashes
      const textWithMixedDashes = "range\u2012of\u2013items\u2014here\u2015and\u2212there";
      expect(normaliseText(textWithMixedDashes)).toBe("range-of-items - here-and-there");
    });

    it("should not modify standard hyphens", (): void => {
      expect(normaliseText("hello-world")).toBe("hello-world");
    });
  });

  describe("quote normalisation", (): void => {
    it("should convert single quotes to standard ASCII quotes", (): void => {
      expect(normaliseText("test\u2018test\u2019")).toBe("test'test'");

      // Test prime symbols
      expect(normaliseText("test\u2032test\u2033")).toBe("test'test'");
      expect(normaliseText("test\u2034test\u2035test\u2036")).toBe("test'test'test'");
    });

    it("should convert double quotes to standard ASCII quotes", (): void => {
      expect(normaliseText("test\u201Ctest\u201D")).toBe('test"test"');
      expect(normaliseText("test\u201Atest\u201Btest\u201Etest\u201F")).toBe('test"test"test"test"');
      expect(normaliseText("test\u00ABtest\u00BB")).toBe('test"test"');
    });

    it("should convert mixed quotes in a complex string", (): void => {
      const complexQuoteText =
        "He said, \u201CI\u2019m \u201Chappy\u201D to be here\u201D and added \u00ABvery happy\u00BB";
      expect(normaliseText(complexQuoteText)).toBe('He said, "I\'m "happy" to be here" and added "very happy"');
    });

    it("should not modify standard ASCII quotes", (): void => {
      expect(normaliseText("test\"test'test")).toBe("test\"test'test");
    });
  });

  describe("punctuation normalisation", (): void => {
    it("should convert ellipsis to three periods", (): void => {
      expect(normaliseText("test\u2026test")).toBe("test...test");
    });

    // Unsure how helpful it is (for non-developers especially) to clean bullet points
    it.skip("should convert bullets to asterisks", (): void => {
      expect(normaliseText("test\u2022test")).toBe("test*test");
      expect(normaliseText("test\u00B7test")).toBe("test*test");
    });

    it("should convert full-width punctuation to regular punctuation", (): void => {
      // Test a few full-width characters
      expect(normaliseText("test\uFF01test")).toBe("test!test"); // Full-width !
      expect(normaliseText("test\uFF0Ctest")).toBe("test,test"); // Full-width ,
      expect(normaliseText("test\uFF1Atest")).toBe("test:test"); // Full-width :

      // Test a string with multiple full-width characters
      const fullWidthText = "\uFF34\uFF45\uFF53\uFF54\uFF1A \uFF11\uFF12\uFF13";
      expect(normaliseText(fullWidthText)).toBe("Test: 123");
    });

    it("should handle a mix of different punctuation", (): void => {
      const mixedPunctuationText = "Items\u2022 to review\u2026 Check the results\uFF01";
      expect(normaliseText(mixedPunctuationText)).toBe("Items• to review... Check the results!");
    });
  });

  describe("hidden character removal", (): void => {
    it("should remove soft hyphens", (): void => {
      expect(normaliseText("test\u00ADtest")).toBe("testtest");
    });

    it("should remove Mongolian vowel separator", (): void => {
      expect(normaliseText("test\u180Etest")).toBe("testtest");
    });

    it("should remove zero width spaces and related characters", (): void => {
      expect(normaliseText("test\u200Btest")).toBe("testtest"); // Zero width space
      expect(normaliseText("test\u200Ctest")).toBe("testtest"); // Zero width non-joiner
      expect(normaliseText("test\u200Dtest")).toBe("testtest"); // Zero width joiner
      expect(normaliseText("test\u200Etest")).toBe("testtest"); // Left-to-right mark
      expect(normaliseText("test\u200Ftest")).toBe("testtest"); // Right-to-left mark
    });

    it("should remove text direction formatting characters", (): void => {
      expect(normaliseText("test\u202Atest")).toBe("testtest"); // Left-to-right embedding
      expect(normaliseText("test\u202Btest")).toBe("testtest"); // Right-to-left embedding
      expect(normaliseText("test\u202Ctest")).toBe("testtest"); // Pop directional formatting
      expect(normaliseText("test\u202Dtest")).toBe("testtest"); // Left-to-right override
      expect(normaliseText("test\u202Etest")).toBe("testtest"); // Right-to-left override
    });

    it("should remove word joiners and invisible operators", (): void => {
      expect(normaliseText("test\u2060test")).toBe("testtest"); // Word joiner
      expect(normaliseText("test\u2061test")).toBe("testtest"); // Function application
      expect(normaliseText("test\u2062test")).toBe("testtest"); // Invisible times
      expect(normaliseText("test\u2063test")).toBe("testtest"); // Invisible separator
      expect(normaliseText("test\u206Ftest")).toBe("testtest"); // Nominal digit shapes
    });

    it("should remove variation selectors", (): void => {
      expect(normaliseText("test\uFE00test")).toBe("testtest");
      expect(normaliseText("test\uFE0Ftest")).toBe("testtest");
    });

    it("should remove zero width non-breaking space", (): void => {
      expect(normaliseText("test\uFEFFtest")).toBe("testtest");
    });

    it("should handle text with multiple hidden characters", (): void => {
      const textWithHiddenChars = "invisible\u200Bspaces\u202Aand\u2060control\uFEFFchars";
      expect(normaliseText(textWithHiddenChars)).toBe("invisiblespacesandcontrolchars");
    });
  });

  // Comprehensive tests combining multiple transformations
  describe("comprehensive normalisation", (): void => {
    it("should apply all normalisations to a complex text string", (): void => {
      // Create a string that requires all types of normalisation
      const complexText =
        "Smart\u2019s \u201CQuotes\u201D and\u00A0spaces\u2014dashes\u2026ellipsis\u2022bullets\uFF01full-width\u200Bhidden";

      // Expected result after all normalisation functions are applied
      const expectedResult = 'Smart\'s "Quotes" and spaces - dashes...ellipsis•bullets!full-widthhidden';

      expect(normaliseText(complexText)).toBe(expectedResult);
    });

    it("should handle empty strings", (): void => {
      expect(normaliseText("")).toBe("");
    });

    it("should not modify text that doesn't need normalisation", (): void => {
      const regularText = "This is a normal text string with regular characters.";
      expect(normaliseText(regularText)).toBe(regularText);
    });

    it("should correctly process strings with only one type of character to normalise", (): void => {
      // Only spaces to normalise
      expect(normaliseText("text\u00A0with\u3000spaces")).toBe("text with spaces");

      // Only dashes to normalise
      expect(normaliseText("text\u2014with\u2013dashes")).toBe("text - with-dashes");

      // Only quotes to normalise
      expect(normaliseText("text\u201Cwith\u2019quotes")).toBe("text\"with'quotes");

      // Only punctuation to normalise
      expect(normaliseText("text\u2026with\uFF01punctuation")).toBe("text...with!punctuation");

      // Only hidden characters to normalise
      expect(normaliseText("text\u200Bwith\uFEFFhidden")).toBe("textwithhidden");
    });

    it("should correctly handle extreme cases with mixed character types", (): void => {
      // Multiple instances of each type
      const multipleText = "\u00A0\u3000\u2014\u2013\u201C\u2019\u2026\uFF01\u200B\uFEFF";
      expect(normaliseText(multipleText)).toBe("  --\"'...!");

      // Mixed with regular text
      const mixedText = "a\u00A0b\u2014c\u201Cd\u2026e\u200Bf";
      expect(normaliseText(mixedText)).toBe('a b - c"d...ef');
    });

    it("should handle real-world examples with multiple character types", (): void => {
      const formattedText =
        'The company\u2019s revenue increased by 15\u201320% in Q3\u2026 "Amazing results!" said the CEO.';
      expect(normaliseText(formattedText)).toBe(
        'The company\'s revenue increased by 15-20% in Q3... "Amazing results!" said the CEO.'
      );

      // Text with hidden formatting characters that might come from a web page
      const webText =
        "Click\u200Bhere\u200B\u200B to\u200B learn\u200B more\u200B about\u200B our\u200B service\u200B!";
      expect(normaliseText(webText)).toBe("Clickhere to learn more about our service!");

      // Text with fancy typography from a design app
      const typographyText =
        "Design\u2014Typography\u2014Layout\u00A0\u00A0\u00A0\u2022\u00A0\u00A0\u00A0Color\u00A0\u00A0\u00A0\u2022\u00A0\u00A0\u00A0Imagery";
      expect(normaliseText(typographyText)).toBe("Design - Typography - Layout   •   Color   •   Imagery");
    });
  });

  describe("edge cases", (): void => {
    it("should handle strings with only special characters", (): void => {
      expect(normaliseText("\u2026\u2026\u2026")).toBe(".........");
      expect(normaliseText("\u200B\u200B\u200B")).toBe("");
      expect(normaliseText("\u00A0\u00A0\u00A0")).toBe("   ");
    });

    it("should handle strings with unicode characters outside the normalisation scope", (): void => {
      expect(normaliseText("Hello 😀 World!")).toBe("Hello 😀 World!");
      expect(normaliseText("こんにちは\u00A0世界")).toBe("こんにちは 世界");
    });

    it("should handle strings with line breaks and tabs", (): void => {
      expect(normaliseText("Line 1\nLine 2\u00A0with spaces\tand tabs")).toBe("Line 1\nLine 2 with spaces\tand tabs");
    });

    it("should handle very long strings", (): void => {
      const longText = "a\u00A0".repeat(1000) + "b";
      const expectedLongResult = "a ".repeat(1000) + "b";
      expect(normaliseText(longText)).toBe(expectedLongResult);
    });

    it("should handle strings containing all ASCII printable characters", (): void => {
      const asciiPrintable =
        " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
      expect(normaliseText(asciiPrintable)).toBe(asciiPrintable);
    });
  });
});
