# CleanCopy Browser Extension

A browser extension that normalises and cleans text when copying. It adds a right-click menu option to copy text with special characters removed or normalised.

## Features

- **Space Normalisation**: Converts all Unicode space separators to standard spaces (U+00A0, U+1680, U+2000–U+200A, U+202F, U+205F, U+3000)
- **Dash Normalisation**: Converts all dash variations (em, en, figure dash, horizontal bar) to hyphen (U+2012–U+2015, U+2212)
- **Quote Normalisation**: Normalises smart and typographic quotes to standard ASCII (' and ") (U+2018–U+201F, U+2032–U+2036, U+00AB, U+00BB)
- **Punctuation Normalisation**: Converts ellipsis and bullets to standard punctuation, normalises full-width punctuation (U+2026, U+2022, U+00B7, U+FF01–U+FF5E)
- **Hidden Character Removal**: Removes all hidden characters like soft hyphens, zero-width spaces, ZWJ, ZWNJ, bidi controls, variation selectors (U+00AD, U+180E, U+200B–U+200F, U+202A–U+202E, U+2060–U+206F, U+FE00–U+FE0F, U+FEFF)

## Inspiration

The idea for this came after reading a [Reddit post](https://www.reddit.com/r/ChatGPTPromptGenius/comments/1kh9od3/your_ai_content_is_secretly_flagged_by_hidden/) on the issue.

The author of that post, [Officiallabrador](https://www.reddit.com/user/Officiallabrador), has created a [web-based tool](https://www.thepromptindex.com/ai_humanizer.php) which does the same thing as this browser extension.

## Installation

### From Source

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Build the extension:
   ```
   npm run build:firefox
   ```
   or
   ```
   npm run build:chrome
   ```
   (Note: `npm run build` will build Chrome by default)
4. Load the extension:
   - **Firefox**: Go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on" and select any file in the `dist` directory
   - **Chrome**: Go to `chrome://extensions/`, enable "Developer mode", click "Load unpacked" and select the `dist` directory

### Package the Extension

To create a packaged extension for distribution:

```
npm run package:firefox
```
or
```
npm run package:chrome
```

This will create a `.zip` file in the `web-ext-artifacts` directory that you can submit to the Chrome Web Store or Firefox Add-ons site.

## Usage

1. Select text on any webpage
2. Right-click on the selected text
3. Choose "Copy as Normalised Text" from the context menu
4. Paste the cleaned text anywhere you want

## Development

### Browser-specific commands
- **Build for Firefox**: `npm run build:firefox`
- **Build for Chrome**: `npm run build:chrome`
- **Watch for Firefox**: `npm run watch:firefox`
- **Run in Firefox**: `npm run start:firefox`
- **Run in Chrome**: `npm run start:chrome`
- **Package for Firefox**: `npm run package:firefox`
- **Package for Chrome**: `npm run package:chrome`

## Platform Compatibility

This extension works on:
- Linux
- Windows
- Mac

## Browser Compatibility

Tested and compatible with:
- Firefox (latest versions)
- Chrome (latest versions)
- Chromium-based browsers (Edge, Brave, etc.)

## License

MIT
