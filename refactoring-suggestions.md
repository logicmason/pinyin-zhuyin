# pinyin-to-zhuyin Refactoring Suggestions

## Context

`pinyin-zhuyin.js` is a well-written ES module that exports `p2z` and `z2p`. It depends on
`pinyin-tone-tool` (which the author also maintains) and should remain a separate package.

The library works correctly in Node.js. There are two problems:

**Browser use**: the bare specifier `import { ... } from 'pinyin-tone-tool'` is not resolvable
in a browser without either a bundler or an import map. CDN delivery (jsDelivr, unpkg) fails
silently for this reason.

**Broken dependency declaration**: `pinyin-tone-tool` is in `devDependencies`, but
`pinyin-zhuyin.js` imports from it at runtime. Any consumer who installs `pinyin-to-zhuyin`
from npm will not have `pinyin-tone-tool` installed automatically, causing an import failure.

---

## Goals

1. Fix the broken dependency declaration so Node.js consumers get `pinyin-tone-tool` automatically.
2. Make the library loadable in a browser directly from a CDN (no bundler required by consumer).
3. Keep `pinyin-tone-tool` as a separate package.
4. Produce proper `dist/` output generated from the current source.
5. Clean up `package.json` to match modern conventions.

---

## Recommended changes

### 1. Add `dist/` to `.gitignore`

A previous session found a stale `dist/index.js` locally. Investigation confirmed it was never
committed to git and was never part of the published npm tarball — it was a leftover untracked
build artifact. To prevent future confusion, add `dist/` to `.gitignore`:

```
dist/
```

This ensures generated files are never accidentally committed.

---

### 2. Fix `pinyin-tone-tool` dependency

Move `pinyin-tone-tool` from `devDependencies` to `dependencies`:

```json
"dependencies": {
  "pinyin-tone-tool": "^1.0.5"
}
```

The source file `pinyin-zhuyin.js` imports from it, and `"main"` points to that source file.
Node.js consumers need it installed automatically.

---

### 3. Add a build step with rollup

Rollup is the right tool here. It can:

- Bundle `pinyin-tone-tool` inline for browser targets (resolving the bare specifier)
- Emit both ESM and UMD browser outputs from the same source
- Leave the source file `pinyin-zhuyin.js` completely unchanged

There is no need for a CJS output. The package has `"type": "module"` and has always been
ESM-only. All supported Node.js LTS versions (18+) handle native ESM without any compilation
step. CJS support is not worth the added complexity in 2026.

Install:

```
npm install --save-dev rollup @rollup/plugin-node-resolve
```

Create `rollup.config.js`:

```js
import resolve from '@rollup/plugin-node-resolve'

const banner = '// pinyin-to-zhuyin — MIT License'

export default [
  // ESM bundle for browsers (pinyin-tone-tool inlined, bare specifier gone)
  {
    input: 'pinyin-zhuyin.js',
    output: {
      file: 'dist/pinyin-to-zhuyin.esm.js',
      format: 'esm',
      banner,
    },
    plugins: [resolve()],
  },
  // UMD bundle for <script> tags (exposes window.pinyinZhuyin)
  {
    input: 'pinyin-zhuyin.js',
    output: {
      file: 'dist/pinyin-to-zhuyin.umd.js',
      format: 'umd',
      name: 'pinyinZhuyin',
      banner,
    },
    plugins: [resolve()],
  },
]
```

Both bundles inline `pinyin-tone-tool` via `resolve()` so no bare specifiers remain.

Update `package.json` scripts:

```json
"scripts": {
  "build": "rollup -c",
  "test": "nyc mocha --reporter spec"
}
```

---

### 4. Update `package.json` entry points

```json
{
  "main": "pinyin-zhuyin.js",
  "browser": "dist/pinyin-to-zhuyin.umd.js",
  "exports": {
    ".": {
      "browser": "./dist/pinyin-to-zhuyin.esm.js",
      "import": "./pinyin-zhuyin.js",
      "default": "./pinyin-zhuyin.js"
    }
  },
  "files": ["dist", "pinyin-zhuyin.js"],
  "sideEffects": false
}
```

- `"main"` stays pointing to the source file — Node.js resolves it natively as ESM
- `"browser"` is what unpkg/jsDelivr serve by default when no path is specified
- `"exports"."browser"` is used by bundlers (webpack, Vite) targeting a browser environment;
  they receive the pre-built ESM bundle with `pinyin-tone-tool` already inlined
- `"exports"."import"` points Node.js consumers back to the source (no build needed for Node)
- `"sideEffects": false` enables dead-code elimination in bundlers
- The non-standard `"module"` field is omitted; the `"exports"` conditions cover the same cases
  with better tooling support

---

### 5. CDN usage after publishing

Once built and published, consumers can use:

**Script tag (UMD — no import map needed):**

```html
<!-- jsDelivr (recommended) -->
<script src="https://cdn.jsdelivr.net/npm/pinyin-to-zhuyin/dist/pinyin-to-zhuyin.umd.js"></script>
<script>
  const { p2z, z2p } = window.pinyinZhuyin
</script>
```

```html
<!-- unpkg (alternative) -->
<script src="https://unpkg.com/pinyin-to-zhuyin/dist/pinyin-to-zhuyin.umd.js"></script>
<script>
  const { p2z, z2p } = window.pinyinZhuyin
</script>
```

**ES module import (browser-native, no bundler):**

```html
<script type="module">
  import { p2z } from 'https://cdn.jsdelivr.net/npm/pinyin-to-zhuyin/dist/pinyin-to-zhuyin.esm.js'
</script>
```

The ESM bundle has `pinyin-tone-tool` inlined so there are no remaining bare specifiers.

---

### 6. Optional: import map approach (for CDN-loading without bundling)

If you prefer not to bundle `pinyin-tone-tool` into the browser build, consumers can use an
import map instead. `pinyin-tone-tool` is self-contained (no external dependencies, pure JS),
so it loads fine in a browser via CDN as-is:

```html
<script type="importmap">
{
  "imports": {
    "pinyin-tone-tool": "https://cdn.jsdelivr.net/npm/pinyin-tone-tool/tone-tool.js"
  }
}
</script>
<script type="module">
  import { p2z } from 'https://cdn.jsdelivr.net/npm/pinyin-to-zhuyin/pinyin-zhuyin.js'
</script>
```

This keeps both packages fully separated at runtime. Import maps are universally supported
across all modern browsers as of 2026 (Chrome 89+, Firefox 108+, Safari 16.4+).

---

## Summary checklist

- [ ] Add `dist/` to `.gitignore`
- [ ] Move `pinyin-tone-tool` from `devDependencies` to `dependencies`
- [ ] Install rollup and `@rollup/plugin-node-resolve` as dev dependencies
- [ ] Add `rollup.config.js` as described above (ESM + UMD only; no CJS)
- [ ] Update `package.json`: `"build"` script, `"main"`, `"browser"`, `"exports"`, `"files"`, `"sideEffects"`
- [ ] Run `npm run build` and verify output in `dist/`
- [ ] Verify `dist/pinyin-to-zhuyin.umd.js` works in a browser via `<script>` tag
- [ ] Verify `dist/pinyin-to-zhuyin.esm.js` works via `<script type="module">` from a CDN URL
- [ ] Verify source `pinyin-zhuyin.js` still works in Node.js directly (no CJS needed)
- [ ] Publish updated package to npm
