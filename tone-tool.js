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

function addTones(inputText) {
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

      //add appostrophes before 2nd or later syllables starting with a, e and o
      const prevChar = outputText.slice(-1);
      if (prevChar.length > 0 && !prevChar.match(/[\s\-.,!?;:]/) && currentWord[0]?.match(/[aeo]/i)) {
        outputText += "'";
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

module.exports = {
  addTones,  // rename addtones to addTones for consistency
  toneMarkTable,
  vowelSet,
};
