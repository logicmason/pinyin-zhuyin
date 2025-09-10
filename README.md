# Pinyin to Zhuyin Converter

A comprehensive Node.js library and command-line tool for converting between Pinyin (Romanized Chinese) and Zhuyin (Bopomofo, ㄅㄆㄇㄈ) phonetic systems. This converter supports bidirectional conversion with advanced features like tone handling, erhua (儿化), and various output formats.

## Features

- **Bidirectional Conversion**: Convert from Pinyin to Zhuyin (`p2z`) and Zhuyin to Pinyin (`z2p`)
- **Tone Support**: Handles all 5 tones including neutral tone (5th tone)
- **Tone Mark Options**: Output with tone marks (ā, á, ǎ, à) or tone numbers (1, 2, 3, 4, 5)
- **Erhua Support**: Handles northern dialect erhua (儿化) with flexible tone placement
- **Umlaut Handling**: Supports both `ü` and `v` for the same sound
- **Syllable Segmentation**: Intelligent syllable boundary detection
- **Command Line Tools**: Both file-based and interactive conversion modes
- **Comprehensive Test Suite**: Extensive test coverage for edge cases

## Installation

### From Source

```bash
git clone https://github.com/logicmason/pinyin-to-zhuyin.git
cd pinyin-to-zhuyin
npm install
npm install -g .
```

### As a Dependency

```bash
npm install pinyin-to-zhuyin
```

## Usage

### Command Line Tools

#### `p2z` - File Converter
Convert a pinyin text file to zhuyin:

```bash
p2z input.txt
```

Example:
```bash
echo "cheng2gong1le5!" | p2z
# Output: ㄔㄥˊ ㄍㄨㄥ ˙ㄌㄜ!
```

#### `p2z-stream` - Interactive Mode
Start an interactive conversion session:

```bash
p2z-stream
```

Example session:
```bash
> ni3hao3
ㄋㄧˇ ㄏㄠˇ
> you3 ren2 zai4 ma5?
ㄧㄡˇ ㄖㄣˊ ㄗㄞˋ ㄇㄚ˙?
> exit
```

### Programmatic API

#### Pinyin to Zhuyin (`p2z`)

```javascript
const { p2z } = require('pinyin-to-zhuyin');

// Basic conversion
console.log(p2z('ni3hao3')); // ㄋㄧˇㄏㄠˇ

// With options
const options = {
  tonemarks: true,          // Use tone marks instead of numbers
  convertPunctuation: false // Convert Chinese punctuation
};

console.log(p2z('Wo3 de ke4ben3', options)); // ㄨㄛˇ ˙ㄉㄜ ㄎㄜˋ ㄅㄣˇ
```

#### Zhuyin to Pinyin (`z2p`)

```javascript
const { z2p } = require('pinyin-to-zhuyin');

// Basic conversion
console.log(z2p('ㄋㄧˇㄏㄠˇ')); // nǐhǎo

// With options
const options = {
  erhuaTone: 'after-r',          // Place pinyin tone after 'r' in erhua
  umlautMode: 'collapse-nl-uan', // Handle n/l + üan → uan (see: https://www.moedict.tw/%E6%94%A3)
  tonemarks: true,               // Use tone marks
  markNeutralTone: false,        // Hide neutral tone numbers
  apostrophes: 'auto'            // Add apostrophes for syllable boundaries
};

console.log(z2p('ㄏㄨㄚㄦ', options)); // huār
```

### Tone utilities

- `toToneMarks(input: string)` – Convert Pinyin with tone numbers to tone marks (adds apostrophes where required). Defined in `tone-tool.js`.
- Tone data/helpers live in `tone-tool.js` and are reused by the converters:
  - `toneMarkTable` – tone placement mapping.
  - `vowels`, `consonants` – character-class fragments used to build tokenizer regexes in `p2z`.

## API Reference

### `p2z(pinyin, options)`

Converts Pinyin to Zhuyin.

**Parameters:**

- `pinyin` (string): Input pinyin text
- `options` (object, optional):
  - `tonemarks` (boolean, default: true): Use tone marks instead of numbers
  - `convertPunctuation` (boolean, default: false): Convert ,.?!;: to ，,。？！；： 

**Returns:** (string) Zhuyin text

### `z2p(zhuyin, options)`

Converts Zhuyin to Pinyin.

**Parameters:**

- `zhuyin` (string): Input zhuyin text
- `options` (object, optional):
  - `erhuaTone` (string, default: 'after-r'): Tone placement for erhua ('before-r' or 'after-r')
  - `umlautMode` (string, default: 'collapse-nl-uan'): Handle n/l + üan → uan
  - `tonemarks` (boolean, default: true): Use tone marks instead of numbers
  - `markNeutralTone` (boolean, default: false): Show neutral tone as number 5
  - `apostrophes` (string, default: 'auto'): Apostrophe behavior ('auto', true, false)

**Returns:** (string) Pinyin text

## Examples

### Basic Conversions

```javascript
const { p2z, z2p } = require('pinyin-to-zhuyin');

// Pinyin to Zhuyin
p2z('ni3hao3')           // ㄋㄧˇㄏㄠˇ
p2z('zhong1guo2')        // ㄓㄨㄥ ㄍㄨㄛˊ
p2z('lü4')               // ㄌㄩˋ
p2z('hua1r')             // ㄏㄨㄚㄦ

// Zhuyin to Pinyin
z2p('ㄋㄧˇㄏㄠˇ')         // nǐhǎo
z2p('ㄓㄨㄥ ㄍㄨㄛˊ')     // zhōng guó
z2p('ㄌㄩˋ')             // lü4
z2p('ㄏㄨㄚㄦ')           // huār
```

### Advanced Features

```javascript
// Erhua handling
p2z('hua1r')             // ㄏㄨㄚㄦ
z2p('ㄏㄨㄚㄦ', { erhuaTone: 'before-r' })  // hua1r
z2p('ㄏㄨㄚㄦ', { erhuaTone: 'after-r' })   // huār1

// Tone mark vs numbers
p2z('ni3hao3', { tonemarks: true })   // ㄋㄧˇㄏㄠˇ
p2z('ni3hao3', { tonemarks: false })  // ㄋㄧ3ㄏㄠ3

z2p('ㄋㄧˇㄏㄠˇ', { tonemarks: true })  // nǐhǎo
z2p('ㄋㄧˇㄏㄠˇ', { tonemarks: false }) // ni3hao3

// Neutral tone handling
p2z('Wo3 de ke4ben3')    // ㄨㄛˇ ˙ㄉㄜ ㄎㄜˋ ㄅㄣˇ
z2p('ㄨㄛˇ ˙ㄉㄜ ㄎㄜˋ ㄅㄣˇ', { markNeutralTone: false }) // wo3 de ke4ben3
```

## Supported Features

### Tone System

- **Tone 1**: High level (unmarked in zhuyin, ā in pinyin)
- **Tone 2**: Rising (ˊ in zhuyin, á in pinyin)
- **Tone 3**: Falling-rising (ˇ in zhuyin, ǎ in pinyin)
- **Tone 4**: Falling (ˋ in zhuyin, à in pinyin)
- **Tone 5**: Neutral (˙ in zhuyin, unmarked in pinyin)

### Special Cases

- **Erhua (儿化)**: Handles northern dialect erhua with flexible tone placement
- **Umlaut**: Supports both `ü` and `v` for the same sound
- **Syllable Boundaries**: Intelligent detection and apostrophe insertion
- **Disambiguation**: Handles ambiguous cases like `xi'an` vs `xiang`

### Input Formats

- Tone numbers: `ni3hao3`
- Tone marks: `nǐhǎo`
- Mixed formats supported
- Chinese punctuation conversion available

## Testing

Run the test suite:

```bash
npm test
```

The test suite includes comprehensive coverage for:

- Basic conversions
- Tone handling
- Erhua support
- Umlaut variations
- Edge cases and special characters
- File-based conversions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Repository Structure

```text
pinyin-to-zhuyin/
├── pinyin-to-zhuyin.js    # Main library
├── p2z.js                 # Command-line file converter
├── p2z-stream.js          # Interactive command-line tool
├── package.json           # Package configuration
├── test/
│   ├── converter.spec.js  # Test suite
│   └── fixtures/          # Test data files
└── README.md              # This file
```
