function convert(input, markNeutral = true) {
  // normalize to NFD "decomposed" form, which splits diacritics from the root character, e.g. "à" -> "a" + "`"
  const decomposed = input.normalize('NFD')
  // split on syllable initial or non-word char, including the matches in the results
  const fragments = decomposed.split(/((?:(?:(?:[csz]h|[bcdfghjklmnpqrstwxyz])(?=[aeiouü]))|[^\p{L}\p{M}])+)/iu)
  // pair the start of syllable (or non-word char) with rest of relevant syllable
  const pairs = Object.values(Object.groupBy(
    fragments,
    (_, i) => Math.floor((i + 1) / 2),
  ))
  const syllables = pairs.map((x) => x.join(''))

  return syllables
    .filter(Boolean)
    .map((syllable) => {
      // Check for both composed and decomposed tone marks
      const composedToneMarks = {
        'ā': 1, 'á': 2, 'ǎ': 3, 'à': 4,
        'ē': 1, 'é': 2, 'ě': 3, 'è': 4,
        'ī': 1, 'í': 2, 'ǐ': 3, 'ì': 4,
        'ō': 1, 'ó': 2, 'ǒ': 3, 'ò': 4,
        'ū': 1, 'ú': 2, 'ǔ': 3, 'ù': 4,
        'ǖ': 1, 'ǘ': 2, 'ǚ': 3, 'ǜ': 4,
        'Ā': 1, 'Á': 2, 'Ǎ': 3, 'À': 4,
        'Ē': 1, 'É': 2, 'Ě': 3, 'È': 4,
        'Ī': 1, 'Í': 2, 'Ǐ': 3, 'Ì': 4,
        'Ō': 1, 'Ó': 2, 'Ǒ': 3, 'Ò': 4,
        'Ū': 1, 'Ú': 2, 'Ǔ': 3, 'Ù': 4,
        'Ǖ': 1, 'Ǘ': 2, 'Ǚ': 3, 'Ǜ': 4
      };

      // Check for composed tone marks first
      for (const [char, toneNum] of Object.entries(composedToneMarks)) {
        if (syllable.includes(char)) {
          return syllable.replace(char, char.normalize('NFD')[0]) + toneNum;
        }
      }

      // Then check for decomposed marks (existing logic)
      for (const [mark] of syllable.matchAll(/\p{M}/gu)) {
        // 1, 2, 3, or 4 (or 0 if not present in the list)
        const toneNumber = ['̄', '́', '̌', '̀'].indexOf(mark) + 1
        // if 0 (e.g. is umlaut), go to next mark
        if (!toneNumber) continue
        return `${syllable.replace(new RegExp(mark), '')}${toneNumber}`
      }

      // if no mark found and syllable ends with letter, assume neutral tone
      const hasVowels = /[aeiouüAEIOUÜ]/u.test(syllable);
      const hasAnyToneMarks = /[\u0300-\u036F]|[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜĀÁǍÀĒÉĚÈĪÍǏÌŌÓǑÒŪÚǓÙǕǗǙǛ]/u.test(syllable);
      return markNeutral && hasVowels && !hasAnyToneMarks ? `${syllable}5` : syllable
    })
    .join('')
    // normalize any remaining diacritics to NFC "composed" form
    .normalize('NFC')
}
