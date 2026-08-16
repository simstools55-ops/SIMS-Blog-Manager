# SIMS-Blog-Manager v5.10.12

## Apps Scriptへ反映するファイル

- `apps-script/Code.gs`：置換
- `distribution/Code.gs`：配布用。`apps-script/Code.gs` と同一内容
- その他：Apps Scriptへの追加・置換なし

Google Apps Scriptでは、現在の `Code.gs` 全文をこのv5.10.12版へ置換して保存してください。

## 今回の修正

Site Diagnosis処置ダイアログの「診断結果を登録」ボタンについて、クリック受付を明示的なDOMイベントへ統一しました。

- `type="button"` を明示
- `pointer-events:auto` と前面配置を明示
- `pointerdown` で「ボタン入力を検出しました。」を表示
- `click` を `addEventListener` で `submitDoctor()` に接続
- 既存のCreator連携対応（v5.10.10）を維持

この変更により、クリック自体が届かない問題と、Apps Script呼び出し後の問題を切り分けられます。


## v5.10.12
- Site Diagnosis treatment dialog: fixed an embedded JavaScript parse error caused by an insufficiently escaped newline in the Merge optional-artifact status message.
- This parse error prevented all dialog JavaScript from loading, so buttons such as “診断結果を登録” did not receive clicks.
- Creator routing from v5.10.10/11 is retained.
