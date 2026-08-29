# SIMS-Blog-Manager v5.18.4

## 修正内容

- Personal Knowledge Admission Gateの一時指標判定を修正。`CTR` / `クリック` という語があるだけでは拒否せず、現在値・具体的数値・直近値などの一時情報だけをREJECTします。
- Homeを開く操作からDoctor再照合・効果測定再計算を外し、保存済みデータから表示する軽量更新へ変更しました。
- 起動時はHome全体を再集計せず、日次処理の状態セルだけを更新します。前日完了の表示が翌日まで残る問題を解消します。
- 日次処理の日付比較はSIMS標準タイムゾーン `Asia/Tokyo` を明示使用します。

## 互換性

既存のシート、契約、Article Doctor / Site Doctor連携、Personal Knowledge保存形式は変更しません。
