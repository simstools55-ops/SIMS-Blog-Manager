# SIMS Blog Manager v5.14.6

## Merge吸収記事の301統合済み管理

- Merge完了登録時に、統合先記事のみをモニターへ移します。
- 吸収元記事は記事管理に履歴として残しつつ、次の状態へ自動変更します。
  - 作業状態: 🔗 301統合済み
  - 記事ステータス: 301リダイレクト済み
  - 管理フラグ: 管理対象外
  - 除外理由: Mergeで統合先へ301リダイレクト済み
- 吸収元記事はDoctor精密診断候補、通常改善候補、内部リンク候補、改善の推移の現役モニターから除外されます。
- 過去にMerge処置完了済みの案件用に「SIMS Doctor → Merge済み吸収記事を補正」を追加しました。
  - 実際の記事本文や301設定は変更しません。
  - Doctor_Casesに保存されたMerge完了情報を使ってSBM上の状態だけ補正します。

## Apps Script
Code.gs の差し替えで適用できます。

## 推奨コミットメッセージ
`fix(sbm): archive merged source articles after 301 and add retroactive repair (v5.14.6)`
