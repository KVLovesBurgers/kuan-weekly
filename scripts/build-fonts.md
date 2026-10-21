# 字型子集重建

來源：Noto Sans TC / Noto Serif TC 可變字型（/workspace/fonts）。

1. 內文 400：`fonttools varLib.instancer NotoSansTC.ttf wght=400`，再用 `pyftsubset --text-file=<app、components、lib、data 內所有字> --flavor=woff2` → `public/fonts/noto-sans-tc-400.woff2`（唯一 preload）。
2. 粗體 500–700：`instancer wght=500:700`，子集＝實際以 500 以上字重顯示的字（用瀏覽器逐頁抓）＋ components/QuizClient.tsx 字串＋小卷單元名 → `public/fonts/noto-sans-tc-500-700.woff2`。
3. 標題襯線 400–700：`instancer wght=400:700`，子集＝實際用襯線顯示的字＋ QuizClient 字串 → `app/fonts/noto-serif-tc-head.woff2`。
4. 上下標、角括號：`public/fonts/kw-supsub.woff2`（Noto Sans）、`kw-angle.woff2`（Noto Sans Math）。

新增文案後若有新字，重跑對應子集，否則該字會落到系統字型。
