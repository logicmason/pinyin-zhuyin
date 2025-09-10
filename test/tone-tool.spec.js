import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import { toToneMarks, toToneNumbers } from '../tone-tool.js';

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
      { input: "a1", expected: "ā" },
      { input: "e2", expected: "é" },
      { input: "i2", expected: "í" },
      { input: "o3", expected: "ǒ" },
      { input: "u3", expected: "ǔ" },
      { input: "v1", expected: "ǖ" },
      { input: "A1", expected: "Ā" },
      { input: "E2", expected: "É" },
      { input: "I1", expected: "Ī" },
      { input: "O1", expected: "Ō" },
      { input: "U1", expected: "Ū" },
      { input: "V1", expected: "Ǖ" },
      { input: "Ü5", expected: "Ü" },
      { input: "ü2", expected: "ǘ" },
      { input: "ke1", expected: "kē" },
      { input: "zhe4ge5", expected: "zhège" },
      { input: "ke1xue2", expected: "kēxué" },
      { input: "yin1yue4", expected: "yīnyuè" },
      { input: "ban4fa3", expected: "bànfǎ" },
      { input: "zou3lu4", expected: "zǒulù" },
      { input: "ji3dian3zhong1", expected: "jǐdiǎnzhōng" },
      { input: "jia1", expected: "jiā" },
      { input: "guai4bude2", expected: "guàibudé" },
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
      {
        input: "ta1 dai4zhe gou3 liu4wanr1 qu4 le.",
        expected: "tā dàizhe gǒu liùwānr qù le."
      },
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
      { input: "Da4an1 Sen1lin2 Gong1yuan2", expected: "Dà'ān Sēnlín Gōngyuán" },
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
      {
        input: "Shi4jie4 shang4 zui4 you3qu4 de5 yu3yan2 jiu4 shi4 zhong1wen2!",
        expected: "Shìjiè shàng zuì yǒuqù de yǔyán jiù shì zhōngwén!"
      },
      {
        input: "Wo3de guo2yu3 lao3shi1 ben1 60 sui4.",
        expected: "Wǒde guóyǔ lǎoshī bēn 60 suì."
      },
      {
        input: "Na4wei4 xian1sheng1 jiao4 Max, ta1 lai2zi4 De1guo2.",
        expected: "Nàwèi xiānshēng jiào Max, tā láizì Dēguó."
      },
      {
        input: "Cheng2zhu3 da4ren hui2lai2 le!",
        expected: "Chéngzhǔ dàren huílái le!"
      },
      {
        input: "Ta1 de CPzhi2 hen3 gao1.",
        expected: "Tā de CPzhí hěn gāo."
      },
      {
        input: "The city now known as Guang3zhou1 used to be called Canton.",
        expected: "The city now known as Guǎngzhōu used to be called Canton."
      },
      {
        input: "The northeastern region of China has three provinces—Ji2lin2, Hei1long2jiang1, and Liao2ning2.",
        expected: "The northeastern region of China has three provinces—Jílín, Hēilóngjiāng, and Liáoníng."
      },
    ];

    testCases.forEach(({ input, expected }) => {
      const actual = toToneMarks(input);
      expect(actual).to.equal(expected,
        `"${input}" should convert to "${expected}" but got "${actual}"`);
    });
  });

  it('should convert tone-marked pinyin to numbers (basic)', () => {
    const cases = [
      { input: 'ā á ǎ à', expected: 'a1 a2 a3 a4' },
      { input: 'nǐhǎo', expected: 'ni3hao3' },
      { input: "Dà'ān Sēnlín Gōngyuán", expected: "Da4'an1 Sen1lin2 Gong1yuan2" },
    ];
    cases.forEach(({ input, expected }) => {
      const actual = toToneNumbers(input, { showNeutralTone: true });
      expect(actual).to.equal(expected);
    });
  });

  it('should preserve ü/Ü and map tones to numbers', () => {
    const cases = [
      { input: 'lǜ', expected: 'lü4' },
      { input: 'nǚ', expected: 'nü3' },
      { input: 'NǙ', expected: 'Nü3' },
    ];
    cases.forEach(({ input, expected }) => {
      const actual = toToneNumbers(input);
      expect(actual).to.equal(expected);
    });
  });

  it('should emit neutral tone 5 when configured', () => {
    const cases = [
      { input: 'de', expected: 'de5' },
      { input: 'zhège dìfāng', expected: 'zhe4ge5 di4fang1' },
    ];
    cases.forEach(({ input, expected }) => {
      const actual = toToneNumbers(input, { showNeutralTone: true });
      expect(actual).to.equal(expected);
    });
  });

  it('should handle cases where apostrophes are needed to disambiguate syllable boundaries', () => {
    const cases = [
      { input: 'dūnangzhe', expected: 'du1nang5zhe5' },
      { input: "dūn'angzhe", expected: "dun1'ang5zhe5" },
      { input: "bengan", expected: 'ben5gan5' },
      { input: "beng'an", expected: "beng5'an5" },
      { input: "xianen", expected: 'xia5nen5' },
      { input: "xian'en", expected: "xian5'en5" },
      { input: "hengou", expected: 'hen5gou5' },
      { input: "heng'ou", expected: "heng5'ou5" },
      { input: "nǐmen a", expected: "ni3men5 a5" },
    ];
    cases.forEach(({ input, expected }) => {
      const actual = toToneNumbers(input, { showNeutralTone: true });
      expect(actual).to.equal(expected);
    });
  });

  it('should not add tone marks to non-pinyin syllables', () => {
    const cases = [
      { 
        input: "Wǒmen jīntiān lái jiǎng Google, Facebook lèisì startup de chuàngyè fāngshì.",
        expected: "Wo3men5 jin1tian1 lai2 jiang3 Google, Facebook lei4si4 startup de5 chuang4ye4 fang1shi4.",
      },
    ];
    cases.forEach(({ input, expected }) => {
      // const actual = toToneMarks(input, { showNeutralTone: true });
      const actual = toToneNumbers(input, { showNeutralTone: true });
      expect(actual).to.equal(expected);
    });
  });

  it('should correctly convert a tone-marked paragraph to numbers', () => {
    const cases = [
      {
        input: `Bùjiǔ, Liú lǎoshī yòu huílai le, hòumian gēnzhe Shùyùn pàngpàng de wàipó. Wàipó jǔzhe làzhú, yīlù dàshēng de dūnangzhe shénme. Wǒ gēn Shùyùn xiàng liǎng ge mù'ǒu, bù gǎn chū yī shēng. Shùyùn de wàipó yòng Guǎngxīhuà duì wǒmen shuō, “Nǐmen yào sǐ a! Dàshuǐ bǎ shé chōng chūlai; nǐmen bù pà shé lái yǎosǐ nǐmen a?”

...

Shíwǔ nián qián, wǒ qī suì de wàishengnǚ Wáng Qífāng cóng Bōshìdùn jìle yī fēng Yīngwén xìn gěi wǒ, wèn wǒ Fèichéng jiāoqū háoyǔ dáilai de dàshuǐ yǒu méiyou gěi wǒ jiā yǐnqi shénme máfan. Tā yě yāoqǐng wǒ qù Bōshìdùn wánr. Yǐhòu wǒ jīhū měi nián dōu dào Bōshìdùn qù.`,
        expected: `Bu4jiu3, Liu2 lao3shi1 you4 hui2lai5 le5, hou4mian5 gen1zhe5 Shu4yun4 pang4pang4 de5 wai4po2. Wai4po2 ju3zhe5 la4zhu2, yi1lu4 da4sheng1 de5 du1nang5zhe5 shen2me5. Wo3 gen1 Shu4yun4 xiang4 liang3 ge5 mu4'ou3, bu4 gan3 chu1 yi1 sheng1. Shu4yun4 de5 wai4po2 yong4 Guang3xi1hua4 dui4 wo3men5 shuo1, “Ni3men5 yao4 si3 a5! Da4shui3 ba3 she2 chong1 chu1lai5; ni3men5 bu4 pa4 she2 lai2 yao3si3 ni3men5 a5?”

...

Shi2wu3 nian2 qian2, wo3 qi1 sui4 de5 wai4sheng5nü3 Wang2 Qi2fang1 cong2 Bo1shi4dun4 ji4le5 yi1 feng1 Ying1wen2 xin4 gei3 wo3, wen4 wo3 Fei4cheng2 jiao1qu1 hao2yu3 dai2lai5 de5 da4shui3 you3 mei2you5 gei3 wo3 jia1 yin3qi5 shen2me5 ma2fan5. Ta1 ye3 yao1qing3 wo3 qu4 Bo1shi4dun4 wanr2. Yi3hou4 wo3 ji1hu1 mei3 nian2 dou1 dao4 Bo1shi4dun4 qu4.` },
    ];
    cases.forEach(({ input, expected }) => {
      const actual = toToneNumbers(input, { showNeutralTone: true });
      expect(actual).to.equal(expected);
    });
  });

  it('should not emit neutral tone 5 when not configured', () => {
    const cases = [
      { input: 'guàibudé', expected: 'guai4bude2' },
      { input: 'Chéngzhǔ dàren huílái le!', expected: 'Cheng2zhu3 da4ren hui2lai2 le!' },
      { input: 'zhège dìfāng', expected: 'zhe4ge di4fang1' },
    ];
    cases.forEach(({ input, expected }) => {
      const actual = toToneNumbers(input, { showNeutralTone: false });
      expect(actual).to.equal(expected);
    });
  });

  it('should place tone number relative to erhua r according to option', () => {
    const cases = [
      { input: 'huār', expectedAfter: 'huar1', expectedBefore: 'hua1r' },
      { input: 'zhèr', expectedAfter: 'zher4', expectedBefore: 'zhe4r' },
      { input: 'wānr', expectedAfter: 'wanr1', expectedBefore: 'wan1r' },
    ];
    cases.forEach(({ input, expectedAfter, expectedBefore }) => {
      expect(toToneNumbers(input, { erhuaTone: 'after-r' })).to.equal(expectedAfter);
      expect(toToneNumbers(input, { erhuaTone: 'before-r' })).to.equal(expectedBefore);
    });
  });
});
