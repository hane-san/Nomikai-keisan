# Nomikai-keisan

GitHub Pages 用のフラット構成です。

## 重要
GitHub Pages は `index.html` をトップページとして表示します。
zip をそのまま GitHub にアップロードすると展開されず、アプリは動きません。
zip を展開して、この中のファイルをリポジトリ直下へアップロードしてください。

## ファイル
- `index.html`：アプリ本体
- `site.webmanifest`：PWA 設定
- `sw.js`：オフライン用 Service Worker
- `icon-*.png` / `apple-touch-icon.png` / `favicon-*.png`：アイコン
- `gorilla-icon-source-1254.png`：元アイコン画像
- `regenerate_icons.py`：アイコン再生成用

## GitHub Pages
Settings → Pages → Branch を `main` / root に設定してください。
