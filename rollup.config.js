import resolve from '@rollup/plugin-node-resolve'

const banner = '// pinyin-to-zhuyin — MIT License'

export default {
  input: 'pinyin-zhuyin.js',
  output: {
    file: 'dist/pinyin-to-zhuyin.esm.js',
    format: 'esm',
    banner,
  },
  plugins: [resolve()],
}
