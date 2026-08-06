# SIMS-Blog-Manager Product 5.9.8

## Doctor Workflow Integration

精密診断紹介状の作成からDoctor診断結果の登録、Writer紹介状の生成までを1つのダイアログで完結できるようにしました。

### 利用方法
1. 上段のDoctor依頼JSONをコピーしてDoctorへ渡します。
2. DoctorのSBM登録用診断結果JSONを下段へ貼り付けます。
3. 「診断結果を登録して次へ進む」を押します。
4. Writerが必要な場合、完全なWriter紹介状が直ちに表示されます。

現在のスプレッドシートは継続利用できます。Apps Scriptのコードを全置換し、管理メニューから「シートの作成・修復」を1回実行してください。
