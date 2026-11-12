# OpenCC dictionaries / Apache-2.0

This project redistributes four original text dictionaries from Open Chinese Convert (OpenCC):
- STPhrases.txt
- STCharacters.txt
- TWVariantsPhrases.txt
- TWVariants.txt

Source: https://github.com/BYVoid/OpenCC
Pinned upstream commit: fae2a0a911c30764e669a7d8b0591cd8e852934a
Original copyright and SPDX headers remain in each dictionary.
License: Apache License 2.0. The full required license text is retained as LICENSE.

These dictionaries are consumed only by src/lib/zh-hant-display.mjs during static HTML/JSON output generation. Browser clients do not download the dictionaries, and research/ Markdown bytes, original source SHA, URLs, code and embedded original HALOFLUX reference are preserved.

Note: the local lightweight converter uses longest-match phrase and character maps for the standard s2tw display chain, **not** upstream's mmseg tokenizer or complete generated regional phrase dictionaries. Accordingly, unusual contextual conversions can differ from official OpenCC; it must not be represented as a byte-exact reproduction of upstream output. User-facing text is the target, not historical source evidence.
