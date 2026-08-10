# SIMS-Blog-Manager Product 5.9.0 RC1

## 概要

SIMS Editorial Platform v1.0のControl Plane基盤を追加した後方互換Releaseです。既存の日次改善、Doctor診断、Writer結果登録、4週間効果測定は従来どおり利用できます。

## 追加内容

- Product Identity／Shared Version管理
- Platform Case／Treatment／Event／Errorの非表示シート
- Platform状態確認メニュー
- Shared 3.3.0のSBM scoped snapshot
- Platform Contract Major 1の受入基盤
- SIMS_FEEDBACK_V2互換Adapter基盤

## 更新方法

1. GitHub Repositoryへ上書きします。
2. Apps Scriptのコードを`distribution/Code.gs`で全置換します。
3. スプレッドシートを再読み込みします。
4. `SIMS-Blog-Manager → シートの作成・修復`を1回実行します。

既存スプレッドシートを継続使用できます。
