const { toneMarkTable, letters, vowels, consonants, toToneMarks } = require('./tone-tool');

const bpmfFinals = [
  "ㄧㄞ", "ㄧㄠ", "ㄧㄡ", "ㄧㄚ", "ㄧㄛ", "ㄧㄝ", "ㄧㄢ", "ㄧㄣ", "ㄧㄤ", "ㄧㄥ",
  "ㄨㄣ", "ㄨㄞ", "ㄨㄟ", "ㄨㄛ", "ㄨㄚ", "ㄨㄢ", "ㄨㄥ", "ㄨㄤ",
  "ㄩㄥ", "ㄩㄣ", "ㄩㄝ", "ㄩㄢ",
  // single-symbol
  "ㄤ", "ㄥ", "ㄢ", "ㄣ", "ㄞ", "ㄟ", "ㄠ", "ㄡ", "ㄚ", "ㄛ", "ㄜ", "ㄦ", "ㄧ", "ㄨ", "ㄩ"
];

const bpmfInitials = "ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙ";
const bpmfSyllabicOnly = "ㄓㄔㄕㄖㄗㄘㄙ";
const bpmfTones = "˙ˊˇˋ";

// create a regex that greedily matches the longest possible final
const finalMatcher = `(?:${bpmfFinals.join("|")})`;
// prefer (initial? + final) over syllabic-only in the alternation
const syllableMatcher = new RegExp(
  `(?:(?:[${bpmfInitials}]?${finalMatcher})|[${bpmfSyllabicOnly}])` + `[${bpmfTones}]?`,
  "g"
);

const bpmfTransforms = [
  // Pre-processing transformations (highest priority)
  { "・": " " },      // turn name separator dot into a space
  { "v": "ü" },       // v as ü
  { "er([1-5])": "ㄦ$1" },     // er + tone number → ㄦ + tone number
  { "r([1-5])": "ㄦ$1" },      // r + tone number → ㄦ + tone number (for erhua)
  { "r(?=(?:$|[^a-zü'1-5]))": "ㄦ" }, // bare erhua 'r' before boundary → ㄦ
  { "r$": "ㄦ" },     // erhua: trailing 'r' → ㄦ

  // Complex syllable mappings (highest priority)
  {
    "yao": "ㄧㄠ", "you": "ㄧㄡ", "yue": "ㄩㄝ", "yong": "ㄩㄥ",
    "yuan": "ㄩㄢ", "ying": "ㄧㄥ", "yun": "ㄩㄣ",
    "yang": "ㄧㄤ", "yan": "ㄧㄢ", "yin": "ㄧㄣ",
    "wei": "ㄨㄟ", "wang": "ㄨㄤ", "wan": "ㄨㄢ", "weng": "ㄨㄥ", "wen": "ㄨㄣ", "wai": "ㄨㄞ"
  },
  { "iang": "ㄧㄤ", "ing": "ㄧㄥ" },
  { "iai": "ㄧㄞ", "iao": "ㄧㄠ", "iu": "ㄧㄡ", "ian": "ㄧㄢ", "in": "ㄧㄣ" },
  {
    "uai": "ㄨㄞ", "uang": "ㄨㄤ", "uan": "ㄨㄢ", "ua": "ㄨㄚ",
    "uo": "ㄨㄛ", "ui": "ㄨㄟ", "un": "ㄨㄣ", "ün": "ㄩㄣ", "iong": "ㄩㄥ", "ong": "ㄨㄥ"
  },
  { "uan": "ㄩㄢ", "un": "ㄩㄣ", "ong": "ㄩㄥ", "ue": "ㄩㄝ" },
  { "zhi": "ㄓ", "chi": "ㄔ", "shi": "ㄕ", "ri": "ㄖ", "ang": "ㄤ", "eng": "ㄥ", "ai": "ㄞ", "ei": "ㄟ", "ao": "ㄠ", "ou": "ㄡ", "er": "ㄦ" },
  {
    "an": "ㄢ", "en": "ㄣ", "wa": "ㄨㄚ", "wo": "ㄨㄛ", "wu": "ㄨ",
    "ya": "ㄧㄚ", "yo": "ㄧㄛ", "ye": "ㄧㄝ", "yu": "ㄩ"
  },
  { "ia": "ㄧㄚ", "io": "ㄧㄛ", "ie": "ㄧㄝ" },
  {
    "zh": "ㄓ", "ch": "ㄔ", "sh": "ㄕ",
    "zi": "ㄗ", "ci": "ㄘ", "si": "ㄙ",
    "r": "ㄖ", "yi": "ㄧ", "üe": "ㄩㄝ"
  },
  {
    "b": "ㄅ", "p": "ㄆ", "m": "ㄇ", "f": "ㄈ",
    "d": "ㄉ", "t": "ㄊ", "n": "ㄋ", "l": "ㄌ",
    "g": "ㄍ", "k": "ㄎ", "h": "ㄏ",
    "j": "ㄐ", "q": "ㄑ", "x": "ㄒ",
    "z": "ㄗ", "c": "ㄘ", "s": "ㄙ",
    "i": "ㄧ", "u": "ㄨ", "ü": "ㄩ",
    "a": "ㄚ", "o": "ㄛ", "e": "ㄜ"
  },

  // Post-processing transformations (after basic conversions)
  { "(ㄐ|ㄑ|ㄒ)ㄨ": "$1ㄩ" }, // ju/qu/xu → ㄩ
  { "'": " " }                // strip disambiguation apostrophes from pinyin (e.g., Xi'an)
];

const toneMarkToNumber = { "ˊ": "2", "ˇ": "3", "ˋ": "4", "˙": "5" }; // (no mark) → "1"

// Zhuyin → Pinyin transforms (ordered; greedy)
const pinyinTransforms = [
  // ---- Zero-initial y-/w-/yu- forms (anchored) ----
  { "^ㄧㄞ": "yai" }, { "^ㄧㄠ": "yao" }, { "^ㄧㄡ": "you" },
  { "^ㄧㄢ": "yan" }, { "^ㄧㄣ": "yin" }, { "^ㄧㄤ": "yang" }, { "^ㄧㄥ": "ying" },
  { "^ㄧㄚ": "ya" }, { "^ㄧㄛ": "yo" }, { "^ㄧㄝ": "ye" },
  { "^ㄧ": "yi" },

  { "^ㄨㄚ": "wa" }, { "^ㄨㄛ": "wo" }, { "^ㄨㄞ": "wai" }, { "^ㄨㄟ": "wei" },
  { "^ㄨㄢ": "wan" }, { "^ㄨㄣ": "wen" }, { "^ㄨㄤ": "wang" }, { "^ㄨㄥ": "weng" },
  { "^ㄨ": "wu" },

  { "^ㄩㄝ": "yue" }, { "^ㄩㄢ": "yuan" }, { "^ㄩㄣ": "yun" }, { "^ㄩㄥ": "yong" },
  { "^ㄩ": "yu" },

  // ---- Syllabic-only (whole syllable is one of these) ----
  { "^(ㄓ)$": "zhi" }, { "^(ㄔ)$": "chi" }, { "^(ㄕ)$": "shi" },
  { "^(ㄖ)$": "ri" }, { "^(ㄗ)$": "zi" }, { "^(ㄘ)$": "ci" }, { "^(ㄙ)$": "si" },

  // ---- Finals (with an initial present) ----
  { "ㄩㄥ": "iong" }, { "ㄨㄥ": "ong" }, { "ㄨㄤ": "uang" }, { "ㄧㄥ": "ing" }, { "ㄧㄤ": "iang" },
  { "ㄩㄣ": "ün" }, { "ㄩㄝ": "üe" }, { "ㄩㄢ": "üan" }, { "ㄨㄣ": "un" }, { "ㄨㄞ": "uai" },
  { "ㄨㄟ": "ui" }, { "ㄨㄛ": "uo" }, { "ㄨㄚ": "ua" }, { "ㄧㄡ": "iu" }, { "ㄧㄠ": "iao" },
  { "ㄧㄢ": "ian" }, { "ㄧㄣ": "in" }, { "ㄧㄝ": "ie" },

  // Single finals
  { "ㄤ": "ang" }, { "ㄥ": "eng" }, { "ㄢ": "an" }, { "ㄣ": "en" },
  { "ㄞ": "ai" }, { "ㄟ": "ei" }, { "ㄠ": "ao" }, { "ㄡ": "ou" },
  { "ㄚ": "a" }, { "ㄛ": "o" }, { "ㄜ": "e" }, { "ㄝ": "ê" },
  { "ㄧ": "i" }, { "ㄨ": "u" }, { "ㄩ": "ü" },

  // ---- Initials (start of syllable) ----
  { "^ㄓ": "zh" }, { "^ㄔ": "ch" }, { "^ㄕ": "sh" },
  { "^ㄖ": "r" }, { "^ㄗ": "z" }, { "^ㄘ": "c" }, { "^ㄙ": "s" },
  { "^ㄅ": "b" }, { "^ㄆ": "p" }, { "^ㄇ": "m" }, { "^ㄈ": "f" },
  { "^ㄉ": "d" }, { "^ㄊ": "t" }, { "^ㄋ": "n" }, { "^ㄌ": "l" },
  { "^ㄍ": "g" }, { "^ㄎ": "k" }, { "^ㄏ": "h" },
  { "^ㄐ": "j" }, { "^ㄑ": "q" }, { "^ㄒ": "x" },

  // ---- j/q/x + ü → u (covers ü, üe, üan, ün) ----
  { "^([jqx])ü": "$1u" }
];

// optional, conditional post-transforms for z2p
const pinyinPostTransformsCollapse = [
  // n/l + üan → uan  (keep lüe/nüe intact)
  { "^([nl])ü(?=an)": "$1u" }
];

// --- helpers to keep z2p transform-driven but deterministic ---
const INITIALS_SET = new Set(Array.from(bpmfInitials));
const hasInitial = s => s && INITIALS_SET.has(s[0]);

// bucket your existing transform rules once (by pattern shape)
const noInitialRules = [];  // ^ㄧ / ^ㄨ / ^ㄩ → yi/… , wu/… , yu/…
const initialRules = [];   // ^… (all other initials)
const finalRules = [];    // finals usable regardless of initial

for (const rule of pinyinTransforms) {
  const pat = Object.keys(rule)[0];
  if (/^\^(?:ㄧ|ㄨ|ㄩ)/.test(pat)) { noInitialRules.push(rule); }
  else if (/^\^/.test(pat)) { initialRules.push(rule); }
  else { finalRules.push(rule); }
}

function applyRules(s, rules) {
  for (const r of rules) {
    const [pat, rep] = Object.entries(r)[0];
    s = s.replace(new RegExp(pat, "g"), rep);
  }
  return s;
}

// (tone placement handled by toToneMarks)

// Convert the whole string from numbers → marks, auto-detecting erhua forms
function numbersToMarks(s) {
  // Delegate to tone-tool’s pinyin number→mark converter without inserting apostrophes
  return toToneMarks(s, { apostrophes: false });
}

// Zhuyin syllable segmenter (regex + MoE-style erhua):
// - Merge ONLY a bare "ㄦ" (no tone) to the previous syllable.
// - If ㄦ has a tone, leave it as its own syllable.
function segmentBpmf(str) {
  const out = [];
  let i = 0, m;
  while ((m = syllableMatcher.exec(str))) {
    if (m.index > i) { out.push(str.slice(i, m.index)); } // keep gaps/punct
    out.push(m[0]);
    i = syllableMatcher.lastIndex;
  }
  if (i < str.length) { out.push(str.slice(i)); }

  return applyErhua(out);
}

const applyErhua = (tokens) => {
  const endsWithEr = /ㄦ(?:[˙ˊˇˋ])?$/;
  return tokens.reduce((acc, t) => {
    if (t === "ㄦ") {
      const prev = acc[acc.length - 1];
      if (prev && !endsWithEr.test(prev)) {
        acc[acc.length - 1] = prev + "ㄦ";
        return acc;
      }
    }
    acc.push(t);
    return acc;
  }, []);
};

// Convert ONE segmented bpmf syllable → pinyin **with tone numbers**
// - Neutral '5' is dropped when opts.markNeutralTone === false
function bpmfSyllableToPinyin(zh, opts) {
  const toneChar = zh.match(/[˙ˊˇˋ]/)?.[0];
  let toneNum = toneChar ? toneMarkToNumber[toneChar] : "1";
  let core = zh.replace(/[˙ˊˇˋ]/g, "");

  // hide neutral '5' if requested
  if (toneNum === "5" && !opts.markNeutralTone) toneNum = "";

  // standalone ㄦ → er + number (or bare "er" if neutral hidden)
  if (core === "ㄦ") return "er" + (toneNum || "");

  // erhua: bare ㄦ suffix (segmenter only merges bare ㄦ)
  const hasErhua = /ㄦ$/.test(core);
  if (hasErhua) core = core.slice(0, -1);

  // syllabic-only
  if (/^[ㄓㄔㄕㄖㄗㄘㄙ]$/.test(core)) {
    const map = { "ㄓ": "zhi", "ㄔ": "chi", "ㄕ": "shi", "ㄖ": "ri", "ㄗ": "zi", "ㄘ": "ci", "ㄙ": "si" };
    const base = map[core];
    if (hasErhua) {
      return (opts.erhuaTone === "after-r")
        ? base + "r" + (toneNum || "")
        : base + (toneNum || "") + "r";
    }
    return base + (toneNum || "");
  }

  // deterministic, transform-driven mapping
  let py;
  if (hasInitial(core)) {
    py = applyRules(core, finalRules);
    py = applyRules(py, initialRules);
  } else {
    py = applyRules(core, noInitialRules);
    py = applyRules(py, finalRules);
  }

  // default, but optional post-transforms (umlaut handling)
  if (opts.umlautMode === "collapse-nl-uan") {
    py = applyRules(py, pinyinPostTransformsCollapse);
  }

  if (hasErhua) {
    return (opts.erhuaTone === "after-r")
      ? py + "r" + (toneNum || "")
      : py + (toneNum || "") + "r";
  }
  return py + (toneNum || "");
}

// Public API: full-string converter (tokenizes, converts each syllable)
// Inserts apostrophes between adjacent syllables when next begins with a/o/e
const z2p = function (zhuyin, options = {}) {
  const {
    erhuaTone = "after-r",
    umlautMode = "collapse-nl-uan",
    tonemarks = true,
    markNeutralTone = !tonemarks, // treats zhe4ge in pinyin as zhe4ge5
    apostrophes = "auto"
  } = options;

  // normalize ・ → space
  const normalized = zhuyin.replace(/・/g, " ");

  // build with **numbers** (or hidden 5), then optional apostrophes
  const tokens = segmentBpmf(normalized);
  const pieces = [];
  let prevWasSyllable = false;

  // decide apostrophe behavior
  const addApos = apostrophes === true || (apostrophes === "auto" && tonemarks === true);

  for (const token of tokens) {
    if (/[ㄅ-ㄩ˙ˊˇˋ]/.test(token)) {
      const pyNum = bpmfSyllableToPinyin(token, { markNeutralTone, erhuaTone, umlautMode }); // numbers only
      if (addApos && prevWasSyllable && /^[aoe]/i.test(pyNum)) pieces.push("'");
      pieces.push(pyNum);
      prevWasSyllable = true;
    } else {
      pieces.push(token);
      prevWasSyllable = false;
    }
  }

  const outNums = pieces.join("");

  // Single switch to marks (auto-detects erhua style)
  return tonemarks ? numbersToMarks(outNums) : outNums;
};

const p2z = function (pinyin = "", options = {}) {
  const {
    tonemarks = true,       // true uses tone marks, false uses tone numbers
    convertPunctuation = false
  } = options;

  let output = pinyin.toLowerCase();

  const tones = { "1": "", "2": "ˊ", "3": "ˇ", "4": "ˋ", "5": "˙" };

  // Normalize erhua tones: move tone after 'r' onto the preceding syllable
  // e.g., duor5 -> duo5r; but do NOT change true syllable "er3"
  output = output.replace(/([a-zü]+)r([1-5])/gi, (m, base, n) => {
    return base.toLowerCase() === "e" ? m : `${base}${n}r`;
  });

  // Identifyneutral tone for syllables without explicit numbers.
  // Handle boundaries at end of string, punctuation, or apostrophes (syllable separators).
  // Vowel-final syllables (e.g., "a", "xi", "nü"):

  // Build regexes from smaller parts for readability

  // Apostrophe boundary: treat as syllable break only if it does NOT precede a toned syllable
  const danglingApostrophe = `'(?![a-zü]+[1-5])`;

  // Neutral-marking boundary: end of string, non-letter, or the apostrophe above
  const boundary = `(?:$|[^a-zü'1-5]|${danglingApostrophe})`;

  // Vowel-final syllables (supports single-letter syllables like "a", and ü endings)
  const vowelFinalSyllable = new RegExp(`([a-zü]*[${vowels}])(?=${boundary})`, "gi");
  output = output.replace(vowelFinalSyllable, "$15");

  // Consonant-final syllables (e.g., tong) — exclude lone 'r' (erhua handled later)
  const consonantFinalSyllable = new RegExp(`([a-zü]+[${consonants}])(?=${boundary})`, "gi");
  output = output.replace(consonantFinalSyllable, (match) => {
    return match.toLowerCase() === "r" ? match : match + "5";
  });

  // Add spaces after each (syllable + tone) followed immediately by another syllable,
  // but do NOT split when the next char is an erhua 'r' (keep ...1r intact)
  const notErhuaNext = `(?!r(?:$|[1-5]|[^a-zü'1-5]))`;
  output = output.replace(new RegExp(`([a-zü]+[1-5])(?=${notErhuaNext}[a-zü])`, "g"), "$1 ");

  bpmfTransforms.forEach(function (transformationSet) {
    Object.keys(transformationSet).forEach((key) => {
      const rexp = new RegExp(key, "g");
      output = output.replace(rexp, transformationSet[key]);
    });
  });

  if (tonemarks) {
    // Convert neutral tone (5) to ˙ and place it before the syllable
    output = output.replace(new RegExp(`(${syllableMatcher.source})5`, "g"), "˙$1");

    // Convert tones numbers 2, 3, and 4 to tone marks after the syllable
    Object.keys(tones).forEach((key) => {
      const rexp = new RegExp(`(${syllableMatcher.source})${key}`, "g");
      output = output.replace(rexp, `$1${tones[key]}`);
    });
  }

  if (convertPunctuation) {
    const punctuation = { "，": ",", "。": ".", "？": "?", "！": "!", "；": ";", "：": ":" };
    Object.keys(punctuation).forEach((key) => {
      const rexp = new RegExp(key, "g");
      output = output.replace(rexp, punctuation[key]);
    });
  }

  return output;
}

module.exports.bpmfTransforms = bpmfTransforms;
module.exports.pinyinTransforms = pinyinTransforms;
module.exports.p2z = p2z;
module.exports.z2p = z2p;
