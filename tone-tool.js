// ancient, battle-tested code
// be cautious about making any changes!

const vowelSet = new Set(['a', 'e', 'i', 'o', 'u', 'v', 'ü', 'A', 'E', 'I', 'O', 'U', 'V', 'Ü']);
const toneMarkedVowels = 'āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜĀÁǍÀĒÉĚÈĪÍǏÌŌÓǑÒŪÚǓÙǕǗǙǛ';
const umlatu = "ü";
const capUmlatu = "Ü";

const toneMarkTable = {
  a: ["ā", "á", "ǎ", "à"],
  e: ["ē", "é", "ě", "è"],
  i: ["ī", "í", "ǐ", "ì"],
  o: ["ō", "ó", "ǒ", "ò"],
  u: ["ū", "ú", "ǔ", "ù"],
  "ü": ["ǖ", "ǘ", "ǚ", "ǜ"],
  v: ["ǖ", "ǘ", "ǚ", "ǜ"],
  A: ["Ā", "Á", "Ǎ", "À"],
  E: ["Ē", "É", "Ě", "È"],
  I: ["Ī", "Í", "Ǐ", "Ì"],
  O: ["Ō", "Ó", "Ǒ", "Ò"],
  U: ["Ū", "Ú", "Ǔ", "Ù"],
  //                        for readability
  "Ü": ["Ǖ", "Ǘ", "Ǚ", "Ǜ"],
  "V": ["Ǖ", "Ǘ", "Ǚ", "Ǜ"]
};

function toToneMarks(inputText, options = {}) {
  const { apostrophes = true } = options;
  let outputText = "";
  let currentWord = "";
  let currentChar = "";
  let i = 0;
  let foundVowels = 0;

  for (i = 0; i <= inputText.length; i++) {
    currentChar = inputText.charAt(i);

    // numbers 1-5 are tone marks, build the word until we hit one
    if (!(currentChar.match(/[1-5]/))) {
      if (vowelSet.has(currentChar)) foundVowels++;
      // if the last character was a vowel and this isn't...
      if (foundVowels !== 0 && currentChar.match(/[^aeiouvüngr]/i) || currentChar === "") {
        outputText += currentWord;
        currentWord = currentChar;
      } else {
        currentWord += currentChar;
      }
    } // if !match 1-5
    // the character must be a tone mark
    else {
      let toneNum = Number(currentChar);
      let wordLen = currentWord.length;
      foundVowels = 0;
      let useVowel = 1; // which vowel (1st or 2nd) will get the tone mark
      // step through each character in word

      // If it doesn't have vowels, just output it
      if (!currentWord.match(/[aeiouvü]/i)) {
        outputText += (currentWord + currentChar);
        currentWord = "";
      }

      // the tone goes over the second vowel for these combinations
      if (currentWord.match(/i[aeou]/i)) useVowel = 2;
      if (currentWord.match(/u[aeio]/i)) useVowel = 2;
      if (currentWord.match(/[vü]e/i)) useVowel = 2;

      // add apostrophes before 2nd or later syllables starting with a, e and o
      if (apostrophes) {
        const prevChar = outputText.slice(-1);
        if (prevChar.length > 0 && !prevChar.match(/[\s\-.,!?;:]/) && currentWord[0]?.match(/[aeo]/i)) {
          outputText += "'";
        }
      }

      // We'll check either the first or the first two vowels, depending on which should have the tone
      for (let j = 0; j <= wordLen && foundVowels < useVowel; j++) {
        let tempWord = "";
        const charInWord = currentWord.charAt(j);
        if (vowelSet.has(charInWord)) {
          foundVowels++;
          const tonedChar = applyToneToVowel(charInWord, toneNum);

          if (foundVowels >= useVowel) {
            tempWord = Array.from(currentWord).map((char, k) => {
              if (k === j) return tonedChar;
              return convertToUmlautIfV(char);
            }).join('');
            currentWord = "";
          }
        }
        outputText += tempWord;
      }
    }
  }

  return outputText;
}

function applyToneToVowel(charInWord, toneNum) {
  if (toneNum <= 4) { return toneMarkTable[charInWord][toneNum - 1]; }
  if (toneNum === 5) { return convertToUmlautIfV(charInWord); }
  return charInWord;
}

function convertToUmlautIfV(char) {
  if (char === "v") return umlatu;
  if (char === "V") return capUmlatu;
  return char;
}

// Helper function to strip tones and lowercase for syllable boundary detection
function stripTonesAndLowercase(text) {
  // Create reverse mapping from tone-marked vowels to base vowels
  const toneToBase = {};
  for (const [baseVowel, toneMarks] of Object.entries(toneMarkTable)) {
    toneMarks.forEach((toneMark, index) => {
      toneToBase[toneMark] = baseVowel.toLowerCase();
    });
  }
  
  return text.split('').map(char => {
    if (toneToBase[char]) { return toneToBase[char]; }
    return char.toLowerCase();
  }).join('');
}

// Helper function to determine syllable boundaries using Pinyin orthography rules
function findSyllableBoundaries(text) {
  const boundaries = [];
  
  // Define character classes including tone-marked vowels
  const allVowels = `aeiouvüAEIOUVÜ${toneMarkedVowels}`;
  const allConsonants = 'bpmfdtnlgkhjqxrzcsyw';
  
  // Pinyin syllable pattern - more restrictive to avoid matching English words
  const syllablePattern = new RegExp(
    `(?:zh|ch|sh|[${allConsonants}])?` +  // optional initial (include r)
    `(?:[iuvü${toneMarkedVowels}])?` +    // optional medial
    `(?:` +
      // Complex compound finals (longest first)
      `(?:[${allVowels}](?:iang|iong|uang|ueng|ian|iao|ian|ing|ong|ang|eng|ai|ao|ei|ou|an|en|in|un|vn))|` +
      `(?:[${allVowels}](?:i|o|u|ng|n))|` +  // simpler compound finals (ng before n)
      `(?:[${allVowels}])` +                   // single vowels
    `)` +
    `(?:r(?![a-zü${toneMarkedVowels}]))?`,  // optional erhua (r not followed by vowel)
    'gi'
  );
  
  let match;
  while ((match = syllablePattern.exec(text)) !== null) {
    boundaries.push({ start: match.index, end: match.index + match[0].length });
  }
  
  // Apply apostrophe placement rule: if a syllable starting with a/o/e follows another syllable,
  // treat it as if there's an apostrophe between them
  const processedBoundaries = [];
  for (let i = 0; i < boundaries.length; i++) {
    const current = boundaries[i];
    const next = boundaries[i + 1];
    
    processedBoundaries.push(current);
    
    // Check if next syllable starts with a/o/e and should be separated
    if (next) {
      const nextSyllable = text.slice(next.start, next.end);
      const nextStartsWithAOE = /^[aoeāáǎàēéěèōóǒò]/i.test(nextSyllable);
      
      // Check if there's already an apostrophe between syllables
      const hasApostrophe = text.slice(current.end, next.start).includes("'");
      
      if (nextStartsWithAOE && !hasApostrophe) {
        // Apply apostrophe rule: the last consonant goes with the next syllable
        // But only if they're part of the same word (no space between them)
        const gap = text.slice(current.end, next.start);
        const isSameWord = !gap.includes(' ');
        
        if (isSameWord) {
          const currentSyllable = text.slice(current.start, current.end);
          if (currentSyllable.length > 1 && /[bcdfghjklmnpqrstvwxyz]$/i.test(currentSyllable)) {
            // Adjust current boundary to exclude the last consonant
            processedBoundaries[processedBoundaries.length - 1] = {
              start: current.start,
              end: current.end - 1
            };
            // Adjust next boundary to include the consonant
            boundaries[i + 1] = {
              start: next.start - 1,
              end: next.end
            };
          }
        }
      }
    }
  }
  
  return processedBoundaries;
}

function extractToneNumber(syllable) {
  // Create reverse mapping from tone-marked vowels to tone numbers
  const toneToNumber = {};
  for (const [baseVowel, toneMarks] of Object.entries(toneMarkTable)) {
    toneMarks.forEach((toneMark, index) => {
      toneToNumber[toneMark] = index + 1; // 1-4 for tones
    });
  }
  
  // Look for tone-marked vowels in the syllable
  for (const char of syllable) {
    if (toneToNumber[char]) {
      return toneToNumber[char];
    }
  }
  
  // No tone mark found - this is a neutral tone
  return 5;
}

// strips tone marks from a syllable while preserving capitalization
function stripToneFromSyllable(syllable) {
  const toneToBase = {};
  for (const [baseVowel, toneMarks] of Object.entries(toneMarkTable)) {
    toneMarks.forEach((toneMark, index) => {
      toneToBase[toneMark] = baseVowel;
    });
  }
  
  return syllable.split('').map(char => {
    if (toneToBase[char]) {
      // Preserve ü/Ü as-is (don't convert to v/V)
      if ("ǖǘǚǜǕǗǙǛ".includes(char)) { return 'ü'; }
      return toneToBase[char];
    }
    return char;
  }).join('');
}

// Helper function to check if a word is clearly non-Pinyin
function isNonPinyinWord(word) {
  // Use the existing syllable segmentation logic to test if the word can be fully segmented
  const boundaries = findSyllableBoundaries(word);
  
  // If no syllables were found, it's not Pinyin
  if (boundaries.length === 0) {
    return true;
  }
  
  // If the syllables don't cover the entire word, it's not Pinyin
  const totalSyllableLength = boundaries.reduce((sum, boundary) => sum + (boundary.end - boundary.start), 0);
  if (totalSyllableLength < word.length) {
    return true;
  }
  
  return false;
}

function toToneNumbers(text, options = {}) {
  const { erhuaTone = 'after-r', showNeutralTone = true } = options;
  
  if (!text) return text;
  
  // Split text into words and process each word
  const words = text.split(new RegExp(`(\\s+|[^\\w${toneMarkedVowels}]+)`));

  return words.map(word => {
    // Skip non-word characters (spaces, punctuation, etc.)
    if (!new RegExp(`^[\\w${toneMarkedVowels}]+$`).test(word)) {
      return word;
    }
    
    // Check if this word is clearly non-Pinyin
    if (isNonPinyinWord(word)) {
      return word; // Leave non-Pinyin words unchanged
    }
    
    // Process as Pinyin word
    const boundaries = findSyllableBoundaries(word);
    let result = '';
    let lastBoundaryEnd = 0;
    
    for (const boundary of boundaries) {
      // Add any non-Pinyin text before this syllable
      if (boundary.start > lastBoundaryEnd) {
        result += word.slice(lastBoundaryEnd, boundary.start);
      }
      
      const syllable = word.slice(boundary.start, boundary.end);
      const toneNumber = extractToneNumber(syllable);
      const baseSyllable = stripToneFromSyllable(syllable);
      
      // Handle erhua tone placement
      if (baseSyllable.endsWith('r') && baseSyllable.length > 1) {
        const baseWithoutR = baseSyllable.slice(0, -1);
        
        if (erhuaTone === 'after-r') {
          result += baseWithoutR + 'r' + toneNumber;
        } else {
          result += baseWithoutR + toneNumber + 'r';
        }
      } else {
        // Regular syllable - add tone number at the end
        result += baseSyllable + toneNumber;
      }
      
      lastBoundaryEnd = boundary.end;
    }
    
    // Add any remaining non-Pinyin text
    if (lastBoundaryEnd < word.length) {
      result += word.slice(lastBoundaryEnd);
    }
    
    // Handle showNeutralTone option
    if (!showNeutralTone) {
      result = result.replace(/5/g, '');
    }
    
    return result;
  }).join('');
}

module.exports = {
  toToneMarks,
  toToneNumbers,
  isNonPinyinWord,
  toneMarkTable,
  vowelSet,
  // Regex class helpers
  // consonants range chosen to match pinyin syllable segmentation assumptions
  consonants: "b-df-hj-np-tv-z",
  vowels: "aeiouü",
  // Debug functions
  stripTonesAndLowercase,
  findSyllableBoundaries,
};
