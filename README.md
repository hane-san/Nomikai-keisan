# Gorilla PWA Icon Pack

この zip は、PWA アプリ用のアイコン差し替えに使える最小セットです。

## 入っているもの
- `gorilla-icon-source-1254.png`  … 元画像（あとで修正しやすい保存用）
- `icon-512.png` / `icon-192.png` … PWA 用基本アイコン
- `icon-maskable-512.png` / `icon-maskable-192.png` … Android 系で便利な maskable 用
- `apple-touch-icon.png` … iPhone / iPad 用
- `favicon-32.png` / `favicon-16.png` … ブラウザ用
- `site.webmanifest` … そのまま使える manifest
- `pwa-head-snippet.html` … `<head>` に追加するタグ見本
- `regenerate_icons.py` … 元画像を差し替えたあと再生成するための簡単スクリプト

## なるべく改装しないで使うなら
今の HTML と同じ階層に、この zip の中身を置いて、`<head>` に `pwa-head-snippet.html` の内容を追加すれば OK です。

## あとでデザイン修正するとき
1. `gorilla-icon-source-1254.png` を新しい画像で置き換える
2. `regenerate_icons.py` を実行する
3. 各サイズのアイコンを再生成する
