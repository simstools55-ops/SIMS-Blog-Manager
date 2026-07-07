# はじめに

SIMS-Blog-Managerは、ブログ運営者が「今日はどの記事を直せばよいか」で迷わないための改善管理システムです。

## できること

- Search Consoleからクエリ・URL・クリック・表示回数・CTR・順位を取得します。
- 上位記事を中心に改善候補を抽出します。
- 今日の改善候補を最大5件表示します。
- 詳細を見ると、ClaudeやChatGPTへ貼れる改善ブリーフを確認できます。
- 改善後はログに記録し、14日・30日後に効果測定します。

## 必要なもの

- Googleアカウント
- Google Search Consoleに登録済みのブログ
- Googleスプレッドシート
- Apps Scriptの初回承認
- Search Console APIの有効化

## 最初の流れ

1. スプレッドシートをコピーまたはテンプレートから作成します。
2. Apps Scriptに `Code.js` を貼り付けます。
3. 初回認証を行います。
4. STEP1でブログ名・ブログURL・Search Console Propertyを入力します。
5. STEP2でGoogle CloudとSearch Console APIを確認します。
6. STEP3で接続テストを行います。
7. STEP4で初回データ取得を行います。
