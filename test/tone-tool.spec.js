const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const { toToneMarks } = require('../tone-tool.js');

describe('Pinyin Tone Tool', () => {
  it('should handle an empty string', () => {
    const input = "";
    const expected = "";
  
    const actual = toToneMarks(input);
    expect(actual).to.equal(expected,
      `"${input}" should convert to "${expected}" but got "${actual}"`);
  });

  it('should handle basic conversions', () => {
    const testCases = [
      { input: "a1", expected: "ā"},
      { input: "e2", expected: "é"},
      { input: "i2", expected: "í"},
      { input: "o3", expected: "ǒ"},
      { input: "u3", expected: "ǔ"},
      { input: "v1", expected: "ǖ"},
      { input: "A1", expected: "Ā"},
      { input: "E2", expected: "É"},
      { input: "I1", expected: "Ī"},
      { input: "O1", expected: "Ō"},
      { input: "U1", expected: "Ū"},
      { input: "V1", expected: "Ǖ"},
      { input: "Ü5", expected: "Ü"},
      { input: "ü2", expected: "ǘ"},
      { input: "ke1", expected: "kē"},
      { input: "zhe4ge5", expected: "zhège" },
      { input: "ke1xue2", expected: "kēxué"},
      { input: "yin1yue4", expected: "yīnyuè"},
      { input: "ban4fa3", expected: "bànfǎ"},
      { input: "zou3lu4", expected: "zǒulù"},
      { input: "ji3dian3zhong1", expected: "jǐdiǎnzhōng"},
      { input: "jia1", expected: "jiā"},
    ];

    testCases.forEach(({ input, expected }) => {
      const actual = toToneMarks(input);
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });

  it('should handle ü (yu) correctly', () => {
    const testCases = [
      { input: "lü4", expected: "lǜ" },
      { input: "nü3", expected: "nǚ" },
      { input: "nüe4", expected: "nüè" },
    ];

    testCases.forEach(({ input, expected }) => {
      const actual = toToneMarks(input);
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });

  it('should handle conversions of v to ü', () => {
    const testCases = [
      { input: "nüe4", expected: "nüè" },
      { input: "lv2zi5", expected: "lǘzi" },
      { input: "ce4lve4", expected: "cèlüè" },
      { input: "LV3XING2SHE4", expected: "LǙXÍNGSHÈ" },
      { input: "zhi2nv5", expected: "zhínü" },
      { input: "SUN1NV5", expected: "SŪNNÜ" },
      { input: "sun1nv5", expected: "sūnnü" },
    ];

    testCases.forEach(({ input, expected }) => {
      const actual = toToneMarks(input);
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });

  it('should handle conversions erhua', () => {
    const testCases = [
      { input: "hua1r", expected: "huār" },
      { input: "huar1", expected: "huār" },
      { input: "zhe4r", expected: "zhèr" },
      { input: "na4r", expected: "nàr" },
      { input: "yi1 hui3r", expected: "yī huǐr" },
      { input: "lan2 ker1", expected: "lán kēr" },
      { input: "ta1 dai4zhe gou3 liu4wanr1 qu4 le.",
        expected: "tā dàizhe gǒu liùwānr qù le." },
    ];

    testCases.forEach(({ input, expected }) => {
      const actual = toToneMarks(input);
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });

  it('should handle capitalized vowels', () => {
    const testCases = [
      { input: "Ai4guo2 Nan2lu4", expected: "Àiguó Nánlù" },
      { input: "Ou1zhou1", expected: "Ōuzhōu" },
      { input: "E2luo2si1", expected: "Éluósī" },
      { input: "I1li4ya4te4", expected: "Īlìyàtè" }, 
      { input: "Yi2he2yuan2", expected: "Yíhéyuán" }, 
    ];

    testCases.forEach(({ input, expected }) => {
      const actual = toToneMarks(input);
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });

  it('shouldn\'t convert clearly non-pinyin characters syllables', () => {
    const testCases = [
      { input: "123", expected: "123" },           // numbers only
      { input: "abc1", expected: "abc1" },         // consonants + tone number
      { input: "xyz2", expected: "xyz2" },         // consonants + tone number
      { input: "!@#3", expected: "!@#3" },         // punctuation + tone numbers
    ];

    testCases.forEach(({ input, expected }) => {
      const actual = toToneMarks(input);
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });

  it('should insert apostrophes where required', () => {
    const testCases = [
      { input: "Xi1an1", expected: "Xī'ān" },
      { input: "Da4an1 Sen1lin2 Gongyuan2", expected: "Dà'ān Sēnlín Gongyuán" },
      { input: "Ai4er3lan2", expected: "Ài'ěrlán" },
      { input: "bo2ai4", expected: "bó'ài" }, 
      { input: "gan3en1", expected: "gǎn'ēn" },
      { input: "Chang2an1", expected: "Cháng'ān" },
      { input: "ou3ran2", expected: "ǒurán" }, 
      { input: "hai3ou1", expected: "hǎi'ōu" }, 
      { input: "chao1e2", expected: "chāo'é" },
      { input: "dang3an4", expected: "dǎng'àn" },
      { input: "dan1ou3hun1", expected: "dān'ǒuhūn" },
      { input: "e2er2", expected: "é'ér" },
      { input: "Tian1an1men2", expected: "Tiān'ānmén" },
      { input: "di4-er4", expected: "dì-èr" },
      { input: "Ou1-An1-Hui4", expected: "Ōu-Ān-Huì" },

    ];

    testCases.forEach(({ input, expected }) => {
      const actual = toToneMarks(input);
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });

  it('should handle full sentences', () => {
    const testCases = [
      { input: "Shi4jie4 shang4 zui4 you3qu4 de5 yu3yan2 jiu4 shi4 zhong1wen2!",
        expected: "Shìjiè shàng zuì yǒuqù de yǔyán jiù shì zhōngwén!" },
      { input: "Wo3de guo2yu3 lao3shi1 ben1 60 sui4.",
        expected: "Wǒde guóyǔ lǎoshī bēn 60 suì." },
      { input: "Na4wei4 xian1sheng1 jiao4 Max, ta1 lai2zi4 De1guo2.",
        expected: "Nàwèi xiānshēng jiào Max, tā láizì Dēguó." },
      { input: "Ta1 de CPzhi2 hen3 gao1.",
        expected: "Tā de CPzhí hěn gāo." }, 
      { input: "The city now known as Guang3zhou1 used to be called Canton.",
        expected: "The city now known as Guǎngzhōu used to be called Canton." }, 
      { input: "The northeastern region of China has three provinces—Ji2lin2, Hei1long2jiang1, and Liao2ning2.",
        expected: "The northeastern region of China has three provinces—Jílín, Hēilóngjiāng, and Liáoníng." }, 
    ];

    testCases.forEach(({ input, expected }) => {
      const actual = toToneMarks(input);
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });
});
