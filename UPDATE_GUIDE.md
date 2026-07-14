# Product 5.2.0 Home判定改善 適用手順

1. GitHub Desktopで `maintenance` ブランチへ切り替えます。
2. このZIPを解凍します。
3. ZIP内のファイルをローカルの `SIMS-Blog-Manager` へ上書きします。
4. GitHub Desktopで変更対象が以下に限られることを確認します。
   - `apps-script/Code.gs`
   - `distribution/コード.gs`
   - `CHANGELOG.md`
   - `tests/PRODUCT5_2_HOME_DASHBOARD_UAT.md`
   - `UPDATE_GUIDE.md`
   - `VERIFICATION.md`
5. コミット・Push後、Apps Scriptのコードを上書きします。
6. スプレッドシートを再読み込みし、「シートの作成・修復」を1回実行します。
7. Home表示と既存機能をUATに沿って確認します。

前回の5.2.0コミットは取り消さず、この修正を追加コミットとして重ねます。
