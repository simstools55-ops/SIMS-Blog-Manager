# SIMS-Blog-Manager v5.14.0

## 新機能：改善モニタリングサイクル管理

「改善の推移」の旧サイクルが消えない問題を、表示フィルタではなくライフサイクル管理へ変更して根本解決します。

改善履歴に新しい内部列 `モニター状態` を追加し、各改善サイクルを次の4状態で管理します。

- `ACTIVE`：現在測定中
- `REVIEW_REQUIRED`：所定期間終了、Doctor再診・次処置待ち
- `SUPERSEDED`：再診・再改善・追加経過観察によって新サイクルへ引継ぎ済み
- `COMPLETED`：改善成功で終了

## 状態遷移

改善実施
→ ACTIVE
→ 4回測定終了
  → 改善成功：COMPLETED
  → 見直し必要：REVIEW_REQUIRED

REVIEW_REQUIRED
→ Doctor再診・Writer再改善・Doctor WAIT/MONITORで新サイクル開始
→ 旧サイクルをSUPERSEDED
→ 新サイクルをACTIVE

## 改善の推移に表示するもの

- ACTIVE
- REVIEW_REQUIRED

## 非表示にするもの

- SUPERSEDED
- COMPLETED

履歴データそのものは削除しません。

## 既存データの自動移行

初回更新時に既存の改善履歴から状態を推定します。

- `改善完了` → COMPLETED
- `再改善必要` で新しいACTIVEサイクルがある → SUPERSEDED
- `再改善必要` で次サイクル未開始 → REVIEW_REQUIRED
- `経過観察中` → ACTIVE

同一記事の識別はArticleID・URL・正規化タイトルを併用します。

## 今回の期待結果

- Something went wrong...
  - 旧サイクル → SUPERSEDED / 改善の推移から非表示
  - 8/23新サイクル → ACTIVE / 表示

- Windows 11 25H2 ダウンロード完全ガイド
  - 旧サイクル → SUPERSEDED / 非表示
  - 8/23新サイクル → ACTIVE / 表示

- YouTube自動再生オフ
  - 改善完了 → COMPLETED / 非表示

- Wi-Fiルーター電気代
  - 再改善必要・未処置 → REVIEW_REQUIRED / 表示継続

## Apps Scriptで変更するファイル

- `Code.gs`：置換
- `appsscript.json`：変更なし

## 推奨コミットメッセージ

`feat(sbm): add monitoring cycle lifecycle in v5.14.0`
