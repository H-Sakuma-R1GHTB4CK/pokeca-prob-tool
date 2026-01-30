# ポケカ 確率計算＆プロット

ポケカ向けの「確率計算＆プロット」Webアプリです。超幾何分布で「ちょうど」「それ以上」の確率を計算し、Rechartsで可視化します。バックエンドは不要で、計算ロジックは `src/lib` に分離しています。

## 前提
- Node.js がインストールされていること（npm が使えること）

## 最初の手順（このディレクトリで作業）
以下のコマンドを **そのまま貼り付けて** 進めてください。

```bash
mkdir pokeca-prob-tool && cd pokeca-prob-tool
git init
npm create vite@latest . -- --template react-ts
Get-Content .gitignore
npm install
npm run dev
git add .
git commit -m "Initial commit"
```

> すでにこのフォルダにプロジェクトがある場合は、`npm install` から実行してください。

## 開発サーバ起動
```bash
npm run dev
```

## ビルド
```bash
npm run build
```

## 生成物
- `dist/` に出力されます。

## 実装の説明
### 主要ファイル
- `src/App.tsx` : 画面全体の状態管理（ドロー枚数、ターゲット枚数、表示モード）
- `src/components/Controls.tsx` : 入力UI（スライダー、ラジオ、セグメントボタン）
- `src/components/ProbabilityChart.tsx` : Rechartsの描画（実線=ちょうど、破線=それ以上）
- `src/lib/hypergeom.ts` : 超幾何分布の計算（組合せは BigInt）
- `src/lib/format.ts` : パーセント表示の補助

### 計算式
- 超幾何分布（ちょうど）
  - `P(X=k) = C(t, k) * C(a - t, d - k) / C(a, d)`
- それ以上
  - `P(X>=m) = Σ_{k=m..min(t,d)} P(X=k)`

### 表示ロジック
- 横軸は `a = d..60` を固定で描画
- **実線 = ちょうど**, **破線 = それ以上**
- データラベルは `a` が5の倍数の点のみ（整数%）
- Tooltipには小数%も表示

### 拡張ポイント
- ターゲット枚数 t は 1〜4 を選択可能（将来 0〜 などに拡張しやすい構成）
- 計算は `src/lib/hypergeom.ts` に分離しているため、将来Pythonバックエンドへ移行しやすい構成
- アニメーション速度は `src/components/ProbabilityChart.tsx` の `ANIMATION_MS` で調整

## 依存関係
- Vite + React + TypeScript
- Recharts

---

必要であれば、次は以下を実行してください。
- `npm install`（未実行の場合）
- `npm run dev`
