# Pinyin <-> Zhuyin Converter

A comprehensive Node.js library and command-line tool for converting between Pinyin (Romanized Chinese) and Zhuyin (Bopomofo, ㄅㄆㄇㄈ) Mandarin phonetic systems. This converter supports bidirectional conversion with advanced features like tone handling, erhua (儿化), and various output formats. See [online demo](https://imperialexam.com/zhuyin-tool).

## Features

- **Bidirectional Conversion**: Convert from Pinyin to Zhuyin (`p2z`) and Zhuyin to Pinyin (`z2p`)
- **Command Line Tools**: Basic CLI interface
- **Comprehensive Test Suite**: Extensive test coverage for edge cases
- **Erhua Support**: Handles northern dialect erhua (儿化) with flexible tone placement
- **Tone Support**: Handles all 5 tones including neutral tone (5th tone)
- **Tone Mark Options**: Output with tone marks (ā, á, ǎ, à) or tone numbers (1, 2, 3, 4, 5)
- **Handles rare syllables**: Optionally collapse n/l + üan → uan (see: https://www.moedict.tw/攣)
- **Syllable Segmentation**: Intelligent syllable boundary detection
- **Umlaut Handling**: Supports both `ü` and `v` for the same sound

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

#### `p2z` - Pinyin to Zhuyin Converter

Convert pinyin text to zhuyin:

```bash
# Convert file
p2z input.txt

# Convert from stdin
echo 'ni3hao3' | p2z

# Show help
p2z --help
```

**Options:**

- `--tonemarks`: Use tone marks instead of tone numbers
- `--no-neutral`: Do not mark neutral tones  
- `--convert-punctuation`: Convert punctuation (Chinese ↔ English)
- `--help`: Show help message

#### `z2p` - Zhuyin to Pinyin Converter

Convert zhuyin text to pinyin:

```bash
# Convert file
z2p input.txt

# Convert from stdin
echo 'ㄋㄧˇㄏㄠˇ' | z2p

# Show help
z2p --help
```

**Options:**

- `--tonemarks`: Use tone marks instead of tone numbers
- `--convert-punctuation`: Convert punctuation (Chinese ↔ English)
- `--help`: Show help message


### Programmatic API

#### Pinyin to Zhuyin (`p2z`)

```javascript
import { p2z } from 'pinyin-to-zhuyin';

// Basic conversion
console.log(p2z('ni3hao3')); // ㄋㄧˇㄏㄠˇ

// With options
const options = {
  tonemarks: true,           // Use tone marks instead of numbers
  inputHasToneMarks: true,   // Handle input with tone marks (instead of numbers)
  convertPunctuation: false  // Convert Chinese punctuation
};

console.log(p2z('Wo3 de ke4ben3', options)); // ㄨㄛˇ ˙ㄉㄜ ㄎㄜˋ ㄅㄣˇ
```

#### Zhuyin to Pinyin (`z2p`)

```javascript
import { z2p } from 'pinyin-to-zhuyin';

// Basic conversion
console.log(z2p('ㄋㄧˇㄏㄠˇ')); // nǐhǎo

// With options
const options = {
  erhuaTone: "after-r",          // Place pinyin tone after 'r' in erhua
  nlUmlautU: "preserveUmlaut",   // Optionally preserve or collapse n/l + üan → uan, see: https://www.moedict.tw/攣
  tonemarks: true,               // Use tone marks (instead of numbers)
  markNeutralTone: false,        // Hide neutral tone numbers
  apostrophes: 'auto'            // Add apostrophes where required at syllable boundaries
};

console.log(z2p('ㄏㄨㄚㄦ', options)); // huār
```

### Tone utilities (tone-tool.js)

- `toToneMarks(input: string)` – Convert Pinyin with tone numbers to tone marks.
- `toToneNumbers(input: string)` – Convert Pinyin with tone marks to tone numbers.
- Tone data/helpers live in `tone-tool.js` and are reused by the converters:
- `toneMarkTable` – tone placement mapping.
- `vowels`, `consonants` – character-class fragments used to build tokenizer regexes in `p2z`.

This tool handles mixed language inputs gracefully where possible. Dedicated repo [here](https://github.com/logicmason/pinyin-tone-tool).

Examples:

```javascript
numbersToMarks('hai3ou1')
// hǎi'ōu

numbersToMarks('Na4wei4 xian1sheng1 jiao4 Max, ta1 lai2zi4 De1guo2.')
// Nàwèi xiānshēng jiào Max, tā láizì Dēguó.

marksToNumbers('The northeastern region of China has three provinces—Jílín, Hēilóngjiāng, and Liáoníng.')
// The northeastern region of China has three provinces—Ji2lin2, Hei1long2jiang1, and Liao2ning2. 
```

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
  - `nlUmlautU` (string, default: 'collapse-nl-uan'): Handle n/l + üan → uan
  - `tonemarks` (boolean, default: true): Use tone marks instead of numbers
  - `markNeutralTone` (boolean, default: false): Show neutral tone as number 5
  - `apostrophes` (string, default: 'auto'): Apostrophe behavior ('auto', true, false)

**Returns:** (string) Pinyin text

## Examples

### Basic Conversions

```javascript
import { p2z, z2p } from 'pinyin-to-zhuyin';

// Pinyin to Zhuyin
p2z('ni3hao3')           // ㄋㄧˇ ㄏㄠˇ
p2z('zhong1guo2')        // ㄓㄨㄥ ㄍㄨㄛˊ
p2z('Wo3 de ke4ben3')    // ㄨㄛˇ ˙ㄉㄜ ㄎㄜˋ ㄅㄣˇ
p2z('hua1r')             // ㄏㄨㄚㄦ

// Zhuyin to Pinyin
z2p('ㄋㄧˇㄏㄠˇ')               // nǐhǎo
z2p('ㄓㄨㄥ ㄍㄨㄛˊ')           // zhōng guó
z2p('ㄨㄛˇ ˙ㄉㄜ ㄎㄜˋ ㄅㄣˇ')  // wo3 de ke4ben3
z2p('ㄏㄨㄚㄦ')                 // huār
```

### Advanced Features

```javascript
p2z('“tā shuō: ‘nǐhǎo’, rán hòu jiù zǒu lē.”', { convertPunctuation: true })
// Output: 「ㄊㄚ ㄕㄨㄛ：『ㄋㄧˇ ㄏㄠˇ』，ㄖㄢˊ ㄏㄡˋ ㄐㄧㄡˋ ㄗㄡˇ ㄌㄜ。」

// Long sentences with punctuation conversion
z2p('「ㄊㄚ ㄕㄨㄛ：『ㄋㄧˇㄏㄠˇ』，ㄖㄢˊ ㄏㄡˋ ㄐㄧㄡˋ ㄗㄡˇ ˙ㄌㄜ。」', { convertPunctuation: true })
// Output: “tā shuō: ‘nǐhǎo’, rán hòu jiù zǒu lē.”

// Chinese: 俗話說：「江太公釣魚，願者上鉤」
z2p('ㄙㄨˊㄏㄨㄚˋ ㄕㄨㄛ：「ㄐㄧㄤㄊㄞˋㄍㄨㄥ ㄉㄧㄠˋㄩˊ, ㄩㄢˋㄓㄜˇ ㄕㄤˋㄍㄡˇ」', { convertPunctuation: true })
// Output: súhuà shuō: jiāngtàigōng diàoyú, yuànzhě shànggǒu

// Erhua handling
p2z('hua1r')             // ㄏㄨㄚㄦ
z2p('ㄏㄨㄚㄦ', { erhuaTone: 'before-r' })  // hua1r
z2p('ㄏㄨㄚㄦ', { erhuaTone: 'after-r' })   // huār1

// Tone mark vs numbers
p2z('ni3hao3', { tonemarks: true })   // ㄋㄧˇ ㄏㄠˇ
p2z('ni3hao3', { tonemarks: false })  // ㄋㄧ3 ㄏㄠ3

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

MIT License

## Repository Structure

```text
pinyin-to-zhuyin/
├── pinyin-zhuyin.js          # Main library
├── p2z.js                    # Command-line pinyin to zhuyin converter
├── z2p.js                    # Command-line zhuyin to pinyin converter
├── package.json              # Package configuration
├── test/
│   ├── zhuyin-converter.spec.js  # Main test suite
│   └── fixtures/                 # Test data files
└── README.md                     # This file
```
