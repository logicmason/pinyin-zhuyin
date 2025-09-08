// ancient, battle-tested code
// be cautious about making any changes!

const vowelSet = new Set(['a', 'e', 'i', 'o', 'u', 'v', 'ü', 'A', 'E', 'I', 'O', 'U', 'V', 'Ü']);
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

// Inverse conversion: tone marks → tone numbers
function toToneNumbers(inputText, options = {}) {
  const { erhuaTone = 'after-r', showNeutralTone = true } = options;

  // Build inverse map: toned vowel -> [base, toneNumber]
  const inverse = new Map();
  for (const [base, arr] of Object.entries(toneMarkTable)) {
    if (base === 'v' || base === 'V') continue;
    arr.forEach((toned, idx) => {
      inverse.set(toned, [base, String(idx + 1)]);
    });
  }

  let out = "";
  let syll = "";
  let tone = ""; // '1'..'4'
  let seenVowel = false;

  const flushSyllable = () => {
    if (syll.length === 0) return;
    if (/r$/i.test(syll) && tone) {
      out += (erhuaTone === 'before-r')
        ? syll.replace(/r$/i, tone + 'r')
        : syll.replace(/r$/i, 'r' + tone);
    } else {
      if (tone) out += syll + tone;
      else out += syll + (seenVowel && showNeutralTone ? '5' : '');
    }
    syll = "";
    tone = "";
    seenVowel = false;
  };

  const isBoundary = (ch) => /[\s\-.,!?;:]/.test(ch);
  const isSyllableBreaker = (ch) => /[^aeiouvüngr]/i.test(ch);

  for (let i = 0; i <= inputText.length; i++) {
    const ch = inputText.charAt(i);

    const inv = inverse.get(ch);
    if (inv) {
      let [base, n] = inv;
      // Normalize uppercase umlaut base to lowercase ü to match expectations (e.g., NǙ -> Nü3)
      if (base === 'Ü') base = 'ü';
      syll += base;
      tone = n; // explicit tone 1–4
      seenVowel = true;

      // After a toned vowel, greedily consume pinyin finals: additional vowels,
      // optional nasal coda n/ng, and optional erhua r before flushing.
      let j = i + 1;
      // additional vowels
      while (j < inputText.length) {
        const c = inputText.charAt(j);
        if (/[AEIOUaeiouÜü]/.test(c)) { syll += c; j++; continue; }
        break;
      }
      // nasal coda
      if (j + 1 < inputText.length && /ng/i.test(inputText.slice(j, j + 2))) {
        syll += inputText.slice(j, j + 2);
        j += 2;
      } else if (j < inputText.length && /n/i.test(inputText.charAt(j))) {
        syll += inputText.charAt(j);
        j += 1;
      }
      // erhua 'r' only if it does NOT start the next syllable
      if (j < inputText.length && /r/i.test(inputText.charAt(j))) {
        const nextNext = inputText.charAt(j + 1);
        // If nextNext is a boundary (space/punct) or end, treat as erhua; otherwise, leave 'r' for next syllable
        if (!nextNext || /[\s\-.,!?;:]/.test(nextNext)) {
          syll += inputText.charAt(j);
          j += 1;
        }
      }
      i = j - 1;
      flushSyllable();
      continue;
    }

    if (ch === '') { flushSyllable(); continue; }

    if (isBoundary(ch)) { flushSyllable(); out += ch; continue; }

    // syllable breaker (after we've seen a vowel): split like toToneMarks
    if (seenVowel && isSyllableBreaker(ch)) { flushSyllable(); }

    // accumulate char
    if (vowelSet.has(ch)) seenVowel = true;
    syll += ch;
  }

  return out;
}

module.exports = {
  toToneMarks,
  toToneNumbers,
  toneMarkTable,
  vowelSet,
  // Regex class helpers
  letters: "a-zü",
  vowels: "aeiouü",
  // consonants range chosen to match pinyin syllable segmentation assumptions
  consonants: "b-df-hj-np-tv-z",
};
