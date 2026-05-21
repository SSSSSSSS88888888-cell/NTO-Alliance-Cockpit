# Sojitz NTO Alliance Cockpit

ニオブ系次世代電池（東芝 SCiB™ NTO）× EU バッテリーパスポート（2027/2/18 義務化）の
**規制対応プラットフォーム** を可視化する、ピッチ用ダッシュボード MVP。

CBMM（上流ニオブ原料）→ 東芝（中流 NTO 電池製造）→ 日系商用EV・建機メーカー →
EU 市場という双日固有のサプライチェーンを一気通貫で扱う。

## 画面構成（4ビュー）

1. **サプライチェーン** — CBMM ブラジル → 東芝 日本 → EU 市場の流れをアニメーション地図で表示。提携メーカー数・搭載台数・適合率の KPI、一気通貫スキーム、カネの流れ。
2. **パスポート発行** — 車両情報を入力 → CFP（Scope 1/2/3, ISO 14067 準拠）算定、原産地証明、再生材比率を自動計算し、QR コード付きデジタルパスポートを発行。EU CFP 上限値との適合判定をゲージで表示。
3. **コンプライアンス** — 規制施行カウントダウン（CBAM / パスポート / CFP上限 / 再生材比率）、平均 CFP 推移、CBAM 証明書購入代行履歴、提携メーカー別の適合ステータス。
4. **収益管理** — 4 収益ライン（サブスク / パスポート発行 / 電池販売手数料 / カーボンクレジット）の月次構成、TTM 収益ミックス、ライン別 KPI。初年度 12.2 億円（Re-Feed 準拠）。

## 技術スタック

- **Next.js 16**（App Router）+ **TypeScript** + **Tailwind CSS v4**
- QR コード生成: `qrcode.react`
- チャート・地図: 依存ライブラリなしの自前 SVG コンポーネント（Mapbox トークン不要でオフライン動作）
- データはすべて `lib/data.ts` のモックと `lib/cfp.ts` の算定ロジックで自己完結

> 本番では Mapbox / Claude API（Scope 3 推定）/ Supabase 等への差し替えを想定。
> 数値はピッチ用のデモ値であり認証された CFP ではない。

## 開発

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # 本番ビルド（型チェック込み）
npm run start  # 本番サーバ
```

## 構成

```
app/                ルートレイアウト / ページ（タブ切替）
components/
  WorldMap.tsx      アニメーション・サプライチェーン地図
  charts.tsx        SVG チャート（積層エリア / 折れ線 / ドーナツ / ゲージ）
  ui.tsx            Card / Stat / Badge / ProgressBar
  views/            4 ビュー
lib/
  data.ts           モックデータ・整形ヘルパー
  cfp.ts            CFP 算定 & パスポート発行ロジック
  types.ts          型定義
```
