# Pomodoro Timer

ポモドーロテクニック実践用のWebアプリケーション

## デモ

**本番環境**: https://pomodoro-timer-orcin-ten.vercel.app/

## 概要

React + TypeScript + Viteで構築されたポモドーロタイマーアプリケーションです。作業時間と休憩時間を管理し、通知機能により効率的な時間管理をサポートします。

cc-sddをお試して触るために作ったアプリケーションです。

## 主な機能

- **カスタマイズ可能なタイマー**
  - 作業時間: 1〜60分で設定可能
  - 休憩時間: 1〜30分で設定可能
  - モード切り替え（作業/休憩）

- **通知機能**
  - 音声通知（600Hz ビープ音、ON/OFF切り替え可能）
  - ブラウザ通知（デスクトップ通知）

- **使いやすいUI**
  - Material-UI によるモダンなデザイン
  - レスポンシブ対応（モバイル/デスクトップ）
  - モード別グラデーション表示

- **永続化**
  - localStorage による設定の自動保存
  - ブラウザ再起動後も設定を保持

## 技術スタック

- **フロントエンド**: React 19.2.0
- **言語**: TypeScript 5.9.3
- **ビルドツール**: Vite 7.2.4
- **UIフレームワーク**: Material-UI 7.3.6
- **スタイリング**: Tailwind CSS 4.1.18 + Emotion
- **デプロイ**: Vercel

## プロジェクト構成

```
cc-sdd_test/
├── pomodoro-timer/      # Pomodoro Timer アプリケーション
│   ├── src/
│   │   ├── components/  # UIコンポーネント
│   │   ├── hooks/       # カスタムフック
│   │   ├── types/       # 型定義
│   │   └── utils/       # ユーティリティ関数
│   └── ...
└── .kiro/               # 仕様書・設計ドキュメント
    ├── specs/
    │   └── pomodoro-timer/
    │       ├── requirements.md  # 要件定義
    │       ├── design.md        # 設計書
    │       └── tasks.md         # タスクリスト
    └── steering/        # プロジェクト全体のガイドライン
```

## セットアップ

### 必要要件

- Node.js 20.x 以上

### インストール

```bash
# プロジェクトディレクトリに移動
cd pomodoro-timer

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# 本番ビルド
npm run build

# Lintチェック
npm run lint
```

開発サーバーは `http://localhost:5173` で起動します。

## デプロイ

本プロジェクトは Vercel にデプロイされています。

- **本番環境**: https://pomodoro-timer-orcin-ten.vercel.app/

### Vercel CLI を使用したデプロイ

#### 1. Vercel CLI のインストール

```bash
npm install -g vercel
```

#### 2. プロジェクトディレクトリでログイン

```bash
cd pomodoro-timer
vercel login
```

#### 3. プロジェクトの初期設定

初回デプロイ時は、対話形式で設定を行います。

```bash
vercel
```

以下の質問に答えます:

- `Set up and deploy "~/cc-sdd_test/pomodoro-timer"?` → **Y**
- `Which scope do you want to deploy to?` → 自分のアカウントを選択
- `Link to existing project?` → **N**
- `What's your project's name?` → **pomodoro-timer** (または任意の名前)
- `In which directory is your code located?` → **./** (Enter)
- `Want to override the settings?` → **N** (Vite設定を自動検出)

#### 4. 本番環境へのデプロイ

```bash
vercel --prod
```

デプロイが成功すると、本番URLが表示されます。

#### プレビュー環境へのデプロイ (オプション)

テスト用のプレビュー環境にデプロイする場合:

```bash
vercel
```

