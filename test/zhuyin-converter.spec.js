import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { expect } from 'chai';
import { p2z, z2p } from '../pinyin-zhuyin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Import the converter
describe('Pinyin to Zhuyin Converter', () => {
  let opts = { tonemarks: true, inputHasToneMarks: true }

  it('should handle ü (yu) correctly', () => {
    const testCases = [
      { input: "lü4", expected: "ㄌㄩˋ" },
      { input: "nü3", expected: "ㄋㄩˇ" },
      { input: "ju1", expected: "ㄐㄩ" },
      { input: "qu3", expected: "ㄑㄩˇ" },
      { input: "xu1", expected: "ㄒㄩ" }
    ];

    testCases.forEach(({ input, expected }) => {
      const actual = p2z(input, opts);
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });

  it('should handle v as ü interchangeably', () => {
    const testCases = [
      { input: "lv4", expected: "ㄌㄩˋ" },
      { input: "nv3", expected: "ㄋㄩˇ" },
      { input: "jv1", expected: "ㄐㄩ" },
      { input: "qv3", expected: "ㄑㄩˇ" },
      { input: "xv1", expected: "ㄒㄩ" },
      { input: "lve4", expected: "ㄌㄩㄝˋ" },
      { input: "nve3", expected: "ㄋㄩㄝˇ" },
      { input: "jve1", expected: "ㄐㄩㄝ" },
      { input: "qve3", expected: "ㄑㄩㄝˇ" },
      { input: "xve1", expected: "ㄒㄩㄝ" },
      { input: "lvan4", expected: "ㄌㄩㄢˋ" },
      { input: "nvan3", expected: "ㄋㄩㄢˇ" },
      { input: "jvan1", expected: "ㄐㄩㄢ" },
      { input: "qvan3", expected: "ㄑㄩㄢˇ" },
      { input: "xvan1", expected: "ㄒㄩㄢ" }
    ];

    testCases.forEach(({ input, expected }) => {
      const actual = p2z(input, opts);
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });

  it('should handle neutral tones correctly', () => {
    const testCases = [
      { input: "hu2tong5", expected: "ㄏㄨˊ ˙ㄊㄨㄥ" },
      { input: "hu2tong", expected: "ㄏㄨˊ ˙ㄊㄨㄥ" },
      { input: "Wo3 de ke4ben3", expected: "ㄨㄛˇ ˙ㄉㄜ ㄎㄜˋ ㄅㄣˇ" },
      { input: "ei", expected: "˙ㄟ" },
      { input: "e5", expected: "˙ㄜ" },
      { input: "yo", expected: "˙ㄧㄛ" },
      { input: "lv", expected: "˙ㄌㄩ" },
      { input: "Zhe4ge dong1xi1", expected: "ㄓㄜˋ ˙ㄍㄜ ㄉㄨㄥ ㄒㄧ" },
      { input: "Bu2 hui4 ba", expected: "ㄅㄨˊ ㄏㄨㄟˋ ˙ㄅㄚ" },
      { input: "Ta1 jin1tian1 da3ban5 le", expected: "ㄊㄚ ㄐㄧㄣ ㄊㄧㄢ ㄉㄚˇ ˙ㄅㄢ ˙ㄌㄜ" },

    ];

    testCases.forEach(({ input, expected }) => {
      const actual = p2z(input, opts);
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });

  it('should remove apostrophes from zhuyin output', () => {
    const testCases = [
      { input: "Xi'an", expected: "˙ㄒㄧ ˙ㄢ" },
      { input: "Xi1'an1", expected: "ㄒㄧ ㄢ" },
      { input: "Da4'an1 Sen1lin2 Gong1yuan2", expected: "ㄉㄚˋ ㄢ ㄙㄣ ㄌㄧㄣˊ ㄍㄨㄥ ㄩㄢˊ" }
    ];

    testCases.forEach(({ input, expected }) => {
      const actual = p2z(input, opts);
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });

  it('should handle erhua (儿化) correctly', () => {
    const testCases = [
      { input: "hua1r", expected: "ㄏㄨㄚㄦ" },
      { input: "zhe4r", expected: "ㄓㄜˋㄦ" },
      { input: "na4r", expected: "ㄋㄚˋㄦ" },
      { input: "yi1 ba5r", expected: "ㄧ ˙ㄅㄚㄦ" },
      { input: "yi1 bar5", expected: "ㄧ ˙ㄅㄚㄦ" },
      { input: "ta1 dai4zhe gou3 liu4wanr1 qu4 le",
        expected: "ㄊㄚ ㄉㄞˋ ˙ㄓㄜ ㄍㄡˇ ㄌㄧㄡˋ ㄨㄢㄦ ㄑㄩˋ ˙ㄌㄜ" }
    ];

    testCases.forEach(({ input, expected }) => {
      const actual = p2z(input, opts);
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });

  it('should handle syllable boundary ambiguity', () => {
    const testCases = [
      { input: "xiang1", expected: "ㄒㄧㄤ" },
      { input: "xi'an1", expected: "˙ㄒㄧ ㄢ" }
    ];

    testCases.forEach(({ input, expected }) => {
      const actual = p2z(input, opts);
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });
  it('should convert punctuation correctly when set to convert', () => {
    const testCases = [
      { input: "Yǐhòu wǒ jīhū měi nián dōu dào Bōshìdùn qù.",
        expected: "ㄧˇ ㄏㄡˋ ㄨㄛˇ ㄐㄧ ㄏㄨ ㄇㄟˇ ㄋㄧㄢˊ ㄉㄡ ㄉㄠˋ ㄅㄛ ㄕˋ ㄉㄨㄣˋ ㄑㄩˋ。" },
      { input: '“tā shuō: ‘nǐhǎo’, rán hòu jiù zǒu lē.”',
        expected: "「ㄊㄚ ㄕㄨㄛ：『ㄋㄧˇ ㄏㄠˇ』，ㄖㄢˊ ㄏㄡˋ ㄐㄧㄡˋ ㄗㄡˇ ㄌㄜ。」" },
    ];

    testCases.forEach(({ input, expected }) => {
      const actual = p2z(input, { convertPunctuation: true });
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });

  it('should convert pinyin input file to expected zhuyin output', () => {
    const fixturesDir = path.join(__dirname, 'fixtures');
    const inputFile = path.join(fixturesDir, 'pinyin-input-1.txt');
    const outputFile = path.join(fixturesDir, 'zhuyin-output-1.txt');

    // Read the input and expected output files
    const pinyinLines = fs.readFileSync(inputFile, 'utf8').trim().split('\n');
    const expectedZhuyinLines = fs.readFileSync(outputFile, 'utf8').trim().split('\n');

    // Ensure we have the same number of lines
    expect(pinyinLines.length).to.equal(expectedZhuyinLines.length,
      `Input has ${pinyinLines.length} lines but output has ${expectedZhuyinLines.length} lines`);

    // Test each line individually
    pinyinLines.forEach((pinyinInput, index) => {
      const expectedZhuyin = expectedZhuyinLines[index];
      const actualZhuyin = p2z(pinyinInput, opts);

      expect(actualZhuyin).to.equal(expectedZhuyin,
        `Line ${index + 1}: "${pinyinInput}" should convert to "${expectedZhuyin}" but got "${actualZhuyin}"`);
    });
  });

  it('should segment syllables correctly around apostrophes', () => {
    const normalize = s => s.replace(/[˙ˊˇˋ1-5]/g, ''); // strip tone marks/numbers
    const cases = [
      { input: "Xi1'an1", expected: "ㄒㄧ ㄢ" },
      { input: "xi1'an1", expected: "ㄒㄧ ㄢ" },
      { input: "xian1", expected: "ㄒㄧㄢ" },
      { input: "dang'an", expected: "ㄉㄤ ㄢ" },
    ];
    cases.forEach(({ input, expected }) => {
      const actual = p2z(input, { tonemarks: true });
      expect(normalize(actual)).to.equal(normalize(expected),
        `"${input}" should segment to "${expected}" but got "${actual}"`);
    });
  });

  it('should not split erhua r from the preceding syllable (ignore tones)', () => {
    const normalize = s => s.replace(/[˙ˊˇˋ1-5]/g, '');
    const cases = [
      { input: "hua1r", expected: "ㄏㄨㄚㄦ" },
      { input: "huar1", expected: "ㄏㄨㄚㄦ" },
    ];
    cases.forEach(({ input, expected }) => {
      const actual = p2z(input, { tonemarks: true });
      expect(normalize(actual)).to.equal(normalize(expected),
        `"${input}" should segment to "${expected}" but got "${actual}"`);
    });
  });

  it('should segment zero-initial a/e/o syllables only when disambiguated by apostrophe (ignore tones)', () => {
    const normalize = s => s.replace(/[˙ˊˇˋ1-5]/g, '');
    const cases = [
      { input: "boao", expected: "ㄅㄛㄠ" },          // no apostrophe → one syllable cluster
      { input: "bo'ao", expected: "ㄅㄛ ㄠ" },        // apostrophe forces split
      { input: "kean", expected: "ㄎㄜㄢ" },
      { input: "ke'an", expected: "ㄎㄜ ㄢ" },
    ];
    cases.forEach(({ input, expected }) => {
      const actual = p2z(input, { tonemarks: true });
      expect(normalize(actual)).to.equal(normalize(expected),
        `"${input}" should segment to "${expected}" but got "${actual}"`);
    });
  });

  it('should keep j/q/x + ü clusters intact (ignore tones)', () => {
    const normalize = s => s.replace(/[˙ˊˇˋ1-5]/g, '');
    const cases = [
      { input: "lüe", expected: "ㄌㄩㄝ" },
      { input: "jue", expected: "ㄐㄩㄝ" },
      { input: "xuan", expected: "ㄒㄩㄢ" },
      { input: "quan", expected: "ㄑㄩㄢ" },
    ];
    cases.forEach(({ input, expected }) => {
      const actual = p2z(input, { tonemarks: true });
      expect(normalize(actual)).to.equal(normalize(expected),
        `"${input}" should segment to "${expected}" but got "${actual}"`);
    });
  });

  it('should handle input with tone marks', () => {
    const normalize = s => s.replace(/[˙ˊˇˋ1-5]/g, '');
    const cases = [
      { input: "zǎo ān",
        expected: "ㄗㄠˇ ㄢ" },
      { input: "yī méi jièzhǐ",
        expected: "ㄧ ㄇㄟˊ ㄐㄧㄝˋ ㄓˇ" },
      { input: "Wǒ fàng nǐ yī mǎ",
        expected: "ㄨㄛˇ ㄈㄤˋ ㄋㄧˇ ㄧ ㄇㄚˇ" },
      { input: "zhège dìfāng, hǎoxiàng wǒ lái guò le!",
        expected: "ㄓㄜˋ ˙ㄍㄜ ㄉㄧˋ ㄈㄤ, ㄏㄠˇ ㄒㄧㄤˋ ㄨㄛˇ ㄌㄞˊ ㄍㄨㄛˋ ˙ㄌㄜ!" },
        // input: ""
    ];
    cases.forEach(({ input, expected }) => {
      const actual = p2z(input, { tonemarks: true, inputHasToneMarks: true });
      expect(normalize(actual)).to.equal(normalize(expected),
        `"${input}" should segment to "${expected}" but got "${actual}"`);
    });
  });
});

describe('Zhuyin to Pinyin Converter', () => {
  let opts = { tonemarks: false }

  it('should convert basic zhuyin to lowercase pinyin', () => {
    const testCases = [
      { input: "ㄋㄧˇㄏㄠˇ", expected: "ni3hao3" },
      { input: "ㄅㄞㄅㄞ", expected: "bai1bai1" },
      { input: "ㄖㄣˊ", expected: "ren2" },
      { input: "˙ㄉㄜ", expected: "de5" },
      { input: "ㄐㄩㄝˊㄉㄧㄥˋ", expected: "jue2ding4" },
      { input: "ㄘㄜˋㄌㄩㄝˋ", expected: "ce4lüe4" },
      { input: "ㄦˊㄑㄧㄝˇ", expected: "er2qie3" },
      { input: "ㄧㄥㄒㄩㄥˇ", expected: "ying1xiong3" },
      { input: "ㄐㄩㄥˇ", expected: "jiong3" },
      { input: "ㄗㄜˊㄖㄣˋ", expected: "ze2ren4" },
      { input: "ㄧㄚˋ", expected: "ya4" },
      { input: "ㄒㄧㄚˋ", expected: "xia4" },
      { input: "˙ㄧㄛ", expected: "yo5" },
      { input: "ㄧㄞˊ", expected: "yai2" },
    ];

    testCases.forEach(({ input, expected }) => {
      const actual = z2p(input, opts);
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });

  it("it shouldn't break when neutral tones are on the wrong side", () => {
    const testCases = [
      { input: "˙ㄉㄜ", expected: "de5" },
      { input: "ㄉㄜ˙", expected: "de5" },
      { input: "ㄏㄠˇ ㄇㄚ˙", expected: "hao3 ma5" },
      { input: "ㄞ˙", expected: "ai5" },
      { input: "ㄧㄛ˙", expected: "yo5" },
      { input: "ㄖㄣˋㄕ˙ ㄇㄚ˙", expected: "ren4shi5 ma5" },
      // very unreasonable but try to support
      { input: "ㄖㄣˋ˙ㄕㄇㄚ˙", expected: "ren4shi5ma5" },
      { input: "ㄖㄣˋㄕ˙ㄇㄚ˙", expected: "ren4shi5ma5" },
    ];

    testCases.forEach(({ input, expected }) => {
      const actual = z2p(input, opts);
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });

  it('should convert ㄩ to ü (not v)', () => {
    const testCases = [
      { input: "ㄌㄩˋ", expected: "lü4" },
      { input: "ㄋㄩˇ", expected: "nü3" },
      { input: "ㄐㄩ", expected: "ju1" },
      { input: "ㄑㄩˇ", expected: "qu3" },
      { input: "ㄒㄩ", expected: "xu1" },
      { input: "ㄌㄩㄝˋ", expected: "lüe4" },
      { input: "ㄋㄩㄝˇ", expected: "nüe3" },
      { input: "ㄐㄩㄝ", expected: "jue1" },
      { input: "ㄑㄩㄝˇ", expected: "que3" },
      { input: "ㄒㄩㄝ", expected: "xue1" }
    ];

    testCases.forEach(({ input, expected }) => {
      const actual = z2p(input, opts);
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });

  it('should optionally strip umlaut from n/l + üan for rare syllables like 攣', () => {
    const stripUmlautCases = [
      { input: "ㄌㄩㄢˊ", expected: "luan2" },
      { input: "ㄌㄩㄢˇ", expected: "luan3" },
    ];

    stripUmlautCases.forEach(({ input, expected }) => {
      const actual = z2p(input, { nlUmlautU: "stripUmlaut", tonemarks: false });
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });

    const preserveUmlautCases = [
      { input: "ㄌㄩㄢˊ", expected: "lüan2" },
      { input: "ㄌㄩㄢˇ", expected: "lüan3" },
    ];

    preserveUmlautCases.forEach(({ input, expected }) => {
      const actual = z2p(input, { nlUmlautU: "preserveUmlaut", tonemarks: false });
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });


  it('should handle erhua (儿化) correctly', () => {
    opts.erhuaTone = "before-r";
    const testCases = [
      { input: "ㄏㄨㄚㄦ", expected: "hua1r" },
      { input: "ㄓㄜˋㄦ", expected: "zhe4r" },
      { input: "ㄋㄚˋㄦ", expected: "na4r" }
    ];

    testCases.forEach(({ input, expected }) => {
      const actual = z2p(input, opts);
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });

    opts.erhuaTone = "after-r";
    const moreTestCases = [
      { input: "ㄏㄨㄚㄦ", expected: "huar1" },
      { input: "ㄓㄜˋㄦ", expected: "zher4" },
      { input: "ㄋㄚˋㄦ", expected: "nar4" }
    ];

    moreTestCases.forEach(({ input, expected }) => {
      const actual = z2p(input, opts);
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });

  it('should convert ・ separators to spaces', () => {
    const testCases = [
      { input: "ㄇㄞˋㄎㄜˋㄦˇ・ㄑㄧㄠˊㄉㄢ", expected: "mai4ke4er3 qiao2dan1" }
    ];

    testCases.forEach(({ input, expected }) => {
      const actual = z2p(input, opts);
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });

  it('should preserve spaces and punctuation unless set to convert', () => {
    const testCases = [
      { input: "ㄧㄡˇ ㄖㄣˊ ㄗㄞˋ ㄇㄚ˙?", expected: "you3 ren2 zai4 ma5?" },
      { input: "ㄓㄜˋㄍㄜ˙ ㄉㄧˋㄈㄤ, ㄏㄠˇㄒㄧㄤˋ ㄨㄛˇ ㄌㄞˊ ㄍㄨㄛˋ ㄌㄜ˙!", expected: "zhe4ge5 di4fang1, hao3xiang4 wo3 lai2 guo4 le5!" },
      { input: "ㄋㄧˇㄏㄠˇ... ㄨㄛˇ ㄕˋ ㄒㄧㄠˇㄓㄤ", expected: "ni3hao3... wo3 shi4 xiao3zhang1" },
      { input: "ㄙㄨˊㄏㄨㄚˋ ㄕㄨㄛ：「ㄐㄧㄤㄊㄞˋㄍㄨㄥ ㄉㄧㄠˋㄩˊ, ㄩㄢˋㄓㄜˇ ㄕㄤˋㄍㄡˇ」",
        expected: "su2hua4 shuo1：「jiang1tai4gong1 diao4yu2, yuan4zhe3 shang4gou3」" }
    ];

    testCases.forEach(({ input, expected }) => {
      const actual = z2p(input, { tonemarks: false, convertPunctuation: false });
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });

  it('should convert punctuation correctly when set to convert', () => {
    const testCases = [
      { input: "ㄋㄧˇㄏㄠˇ，ㄕˋㄐㄧㄝˋ。", expected: "nǐhǎo, shìjiè." },
      { input: "ㄋㄧˇㄏㄠˇ！ㄗㄞˋㄐㄧㄢˋ。", expected: "nǐhǎo! zàijiàn." },
      { input: "ㄨㄤˊㄇㄟˇ：「ㄏㄞ！」", expected: "wángměi: “hāi!”" },
      { input: "「ㄋㄧˇㄏㄠˇ。」", expected: "“nǐhǎo.”" },
      { input: "「ㄊㄚ ㄕㄨㄛ：『ㄋㄧˇㄏㄠˇ』，ㄖㄢˊ ㄏㄡˋ ㄐㄧㄡˋ ㄗㄡˇ ˙ㄌㄜ。」",
        expected: "“tā shuō: ‘nǐhǎo’, rán hòu jiù zǒu lē.”" },
      { input: "ㄋㄧˇㄏㄠˇ， ㄕˋ", expected: "nǐhǎo, shì" },
      { input: "ㄋㄧˇㄏㄠˇ...ㄗㄞˋㄐㄧㄢˋ", expected: "nǐhǎo... zàijiàn" },
      { input: "ㄧㄡˇ ㄖㄣˊ ㄗㄞˋ ㄇㄚ˙?", expected: "yǒu rén zài ma?" },
      { input: "ㄓㄜˋㄍㄜ˙ ㄉㄧˋㄈㄤ, ㄏㄠˇㄒㄧㄤˋ ㄨㄛˇ ㄌㄞˊ ㄍㄨㄛˋ ㄌㄜ˙!",
        expected: "zhège dìfāng, hǎoxiàng wǒ lái guò le!" },
      { input: "ㄋㄧˇㄏㄠˇ... ㄨㄛˇ ㄕˋ ㄒㄧㄠˇㄓㄤ", expected: "nǐhǎo... wǒ shì xiǎozhāng" },
      { input: "ㄙㄨˊㄏㄨㄚˋ ㄕㄨㄛ：「ㄐㄧㄤㄊㄞˋㄍㄨㄥ ㄉㄧㄠˋㄩˊ, ㄩㄢˋㄓㄜˇ ㄕㄤˋㄍㄡˇ」",
        expected: "súhuà shuō: “jiāngtàigōng diàoyú, yuànzhě shànggǒu”" },
      { input: "ㄌㄠˇ ㄕ ㄕㄨㄛ: “ㄋㄧˇ ˙ㄇㄣ ㄧㄠˋ ㄐㄧˋ ㄓㄨˋ ㄍㄨㄛˊ ㄈㄨˋ ㄕㄨㄛ ˙ㄉㄜ ‘ㄑㄧㄥ ㄋㄧㄢˊ ㄧㄠˋ ㄌㄧˋ ㄓˋ ㄗㄨㄛˋ ㄉㄚˋ ㄕˋ, ㄅㄨˋ ㄧㄠˋ ㄗㄨㄛˋ ㄉㄚˋ ㄍㄨㄢ’ ㄓㄜˋ ㄐㄩˋ ㄏㄨㄚˋ.”",
        expected: "lǎo shī shuō: “nǐ mēn yào jì zhù guó fù shuō dē ‘qīng nián yào lì zhì zuò dà shì, bù yào zuò dà guān’ zhè jù huà.”" },
    ];

    testCases.forEach(({ input, expected }) => {
      const actual = z2p(input, { tonemarks: true, convertPunctuation: true });
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });

  it('should add apostrophes where required', () => {
    opts.apostrophes = "auto";
    opts.tonemarks = false;
    const testCases = [
      { input: "ㄉㄚˋㄢ", expected: "da4an1" },
      { input: "ㄉㄚˋㄢ ㄙㄣㄌㄧㄣˊ ㄍㄨㄥㄩㄢˊ", expected: "da4an1 sen1lin2 gong1yuan2" }
    ];

    testCases.forEach(({ input, expected }) => {
      const actual = z2p(input, opts);
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });

    opts.tonemarks = true;
    const moreTestCases = [
      { input: "ㄉㄚˋㄢ", expected: "dà'ān" },
      { input: "ㄉㄚˋㄢ ㄙㄣㄌㄧㄣˊ ㄍㄨㄥㄩㄢˊ", expected: "dà'ān sēnlín gōngyuán" }
    ];

    moreTestCases.forEach(({ input, expected }) => {
      const actual = z2p(input, opts);
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });

  it('should convert all syllables from the reference list correctly (zhuyin to pinyin)', () => {
    // Read the syllables list
    const syllablesFile = path.join(__dirname, 'fixtures', 'pinyin-zhuyin-syllables-list.txt');
    const syllablesData = fs.readFileSync(syllablesFile, 'utf8');
    
    // Parse the file into test cases
    const testCases = syllablesData
      .trim()
      .split('\n')
      .map(line => {
        const [zhuyin, pinyin] = line.split('\t');
        return { input: zhuyin.trim(), expected: pinyin.trim() + '1' }; // Zhuyin without tone = 1st tone
      })
      .filter(testCase => testCase.input && testCase.expected); // Remove empty lines
    
    // Test each syllable (zhuyin without tones -> pinyin with 1st tone)
    testCases.forEach(({ input, expected }) => {
      const actual = z2p(input, { tonemarks: false });
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });

  it('should convert all syllables from the reference list correctly (pinyin to zhuyin)', () => {
    // Read the syllables list
    const syllablesFile = path.join(__dirname, 'fixtures', 'pinyin-zhuyin-syllables-list.txt');
    const syllablesData = fs.readFileSync(syllablesFile, 'utf8');
    
    // Parse the file into test cases
    const testCases = syllablesData
      .trim()
      .split('\n')
      .map(line => {
        const [zhuyin, pinyin] = line.split('\t');
        return { input: pinyin.trim(), expected: zhuyin.trim() + '5' }; // Pinyin without tone = 5th tone
      })
      .filter(testCase => testCase.input && testCase.expected); // Remove empty lines
    
    // Test each syllable (pinyin without tones -> zhuyin with 5th tone)
    testCases.forEach(({ input, expected }) => {
      const actual = p2z(input, { tonemarks: false });
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });
});
