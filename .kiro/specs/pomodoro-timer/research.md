# Research & Design Decisions

---
**Purpose**: ポモドーロタイマーWebアプリの技術設計を支える調査結果、アーキテクチャ検討、および設計判断の根拠を記録する。

**Usage**:
- ディスカバリーフェーズでの調査活動と成果を記録
- design.mdに含めるには詳細すぎる設計判断のトレードオフを文書化
- 将来の監査や再利用のための参照と証拠を提供
---

## Summary
- **Feature**: `pomodoro-timer`
- **Discovery Scope**: New Feature (新規フィーチャー)
- **Key Findings**:
  - React + TypeScript + Viteは2026年現在もポモドーロタイマーアプリの標準的なスタックとして広く採用されている
  - useStateベースのシンプルな状態管理がこの規模のアプリには最適（useReducerは過剰）
  - Web Notifications APIは主要ブラウザでサポートされているが、HTTPSとユーザージェスチャーが必須
  - localStorageの型安全な使用にはカスタムフックとTypeScriptジェネリクスが推奨される

## Research Log

### React + TypeScript + Vite スタック調査
- **Context**: 要件で指定された技術スタック（React + TypeScript）の2026年現在のベストプラクティスを確認する必要があった
- **Sources Consulted**:
  - [Pomodoro timer using Typescript, React, Vite, and CSS Modules - Frontend Mentor](https://www.frontendmentor.io/solutions/pomodoro-timer-using-typescript-react-vite-and-css-modules-MnH1VeKdCS)
  - [Building a pomodoro timer with Tauri using React and Vite - LogRocket](https://blog.logrocket.com/build-pomodoro-timer-tauri-using-react-and-vite/)
  - [GitHub - estevanmaito/pomodoro](https://github.com/estevanmaito/pomodoro)
  - [GitHub - MatheusPMello/pomodoro-timer](https://github.com/MatheusPMello/pomodoro-timer)
- **Findings**:
  - Viteは2026年現在もReactアプリケーションの高速セットアップとビルドに最適なツール
  - コミュニティに多数の実装例が存在し、アクティブに開発されている
  - タイマーロジックにおける入力検証の重要性（負の値によるクラッシュ防止）
  - タイマー実行中のフェーズ変更を防ぐ適切な状態管理の必要性
  - ドキュメントタイトルのリアルタイム更新によるUX向上（他タブでも残り時間確認可能）
- **Implications**:
  - Viteをビルドツールとして採用
  - 入力バリデーションをRequirement 3の実装に組み込む必要
  - タイマー状態の厳格な管理が必要

### React状態管理パターン調査
- **Context**: タイマー状態、モード、設定を効率的に管理する最適なパターンを決定する必要があった
- **Sources Consulted**:
  - [React State Hooks: useReducer, useState, useContext - Robin Wieruch](https://www.robinwieruch.de/react-state-usereducer-usestate-usecontext/)
  - [When to Use useState, useReducer, and useContext in React - DEV](https://dev.to/aneeqakhan/when-to-use-usestate-usereducer-and-usecontext-in-react-1mg1)
  - [Should I useState or useReducer? - Kent C. Dodds](https://kentcdodds.com/blog/should-i-usestate-or-usereducer)
  - [Scaling Up with Reducer and Context - React Docs](https://react.dev/learn/scaling-up-with-reducer-and-context)
- **Findings**:
  - **useState**: 小規模で独立した状態変数に最適（フォーム入力、トグル、カウンター）
  - **useReducer**: 複数のサブ値を持つ複雑な状態ロジックや、次の状態が前の状態に依存する場合に推奨
  - **useContext**: グローバルアクセスが必要な場合にuseReducerと組み合わせて使用
  - ポモドーロタイマーの状態は中程度の複雑さ（タイマー状態、モード、設定）
- **Implications**:
  - useStateでの実装から始め、必要に応じてuseReducerへ移行する段階的アプローチを採用
  - グローバル状態管理（Context API）は現時点では不要（コンポーネント階層が浅い）
  - カスタムフックで状態ロジックを分離してテスタビリティを向上

### Web Notifications API互換性調査
- **Context**: Requirement 4で指定されたブラウザ通知機能の実装可能性と制約を確認する必要があった
- **Sources Consulted**:
  - [Using the Notifications API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API)
  - [Notification - Web APIs - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Notification)
  - [Web Notifications - Can I use](https://caniuse.com/notifications)
  - [Push notifications are now supported cross-browser - web.dev](https://web.dev/blog/push-notifications-in-all-modern-browsers)
- **Findings**:
  - **ブラウザサポート**: Chrome, Firefox, Safari, Edge全てで広くサポート
  - **セキュリティ要件**: HTTPS必須（Chrome/Firefoxで強制）
  - **ユーザージェスチャー要件**: 通知許可リクエストはユーザーアクションに応じてのみ可能（Firefox 72+、Safari）
  - **Safari固有の注意点**:
    - macOS Safari 16+で標準プッシュ通知をサポート
    - iOS/iPadOS Safari 16.4+でホーム画面追加されたアプリのみサポート
  - **制限事項**: プライベートモード/シークレットモードでは動作しない
- **Implications**:
  - HTTPS環境での開発・デプロイが必須
  - 通知許可リクエストは初回アクセス時のユーザーアクション後に実施
  - 通知拒否時のフォールバック（音声通知のみ）が必要
  - iOSでの制限を文書化し、ユーザーに通知

### localStorage TypeScript統合のベストプラクティス
- **Context**: Requirement 6のデータ永続化を型安全かつ効率的に実装する方法を確認する必要があった
- **Sources Consulted**:
  - [useLocalStorage - usehooks-ts](https://usehooks-ts.com/react-hook/use-local-storage)
  - [Mastering State Persistence with Local Storage in React - Medium](https://medium.com/@roman_j/mastering-state-persistence-with-local-storage-in-react-a-complete-guide-1cf3f56ab15c)
  - [Local Storage in React - Robin Wieruch](https://www.robinwieruch.de/local-storage-react/)
  - [Simplifying Local Storage with TypeScript - Medium](https://medium.com/@mithileshparmar1/simplifying-local-storage-with-typescript-1ac866ed5f40)
- **Findings**:
  - **カスタムフック**: useLocalStorageフックでコンポーネント間での機能簡素化
  - **型安全性**: TypeScriptジェネリクス（<T>）で任意のデータ型に対応
  - **シリアライゼーション**: JSON.stringify/parseで自動的に値を変換
  - **SSR対応**: window未定義エラーを防ぐ環境チェックが必要
  - **エラーハンドリング**: try-catchブロックでlocalStorageアクセス失敗に対応
  - **ストレージイベント**: useEffectで他タブ/ウィンドウの変更を監視
  - **ユースケース**: ダークモード、To-Doリスト、フォーム入力の保存
  - **アンチパターン**: localStorageをデータベースとして使用しない（キャッシュクリアで消失）
- **Implications**:
  - useLocalStorageカスタムフックの実装が必要
  - TypeScriptジェネリクスで設定の型安全性を確保
  - 各設定項目を個別のキーで管理（要件通り）
  - エラーハンドリングとデフォルト値のフォールバック実装

### Material-UI (MUI) 採用決定
- **Context**: Tailwind CSSベースのUI実装後、ユーザーがUIデザインに不満を表明（「UIに納得いきません（なんなら崩れています）」）。よりリッチでプロフェッショナルなUIを実現するために、Material-UIへの移行を提案し承認された
- **Sources Consulted**:
  - [Material-UI Documentation](https://mui.com/)
  - [MUI Components Overview](https://mui.com/material-ui/getting-started/overview/)
  - [Emotion CSS-in-JS](https://emotion.sh/docs/introduction)
- **Findings**:
  - **Material Design準拠**: Googleのデザインガイドラインに基づいた一貫性のあるUI/UX
  - **豊富なコンポーネント**: Button, Card, TextField, Switch, ToggleButton等、すぐに使えるコンポーネント群
  - **テーマシステム**: createTheme()でカラーパレット、タイポグラフィ、形状を一元管理
  - **CSS-in-JS**: Emotionによるsx propsで動的スタイリングとTypeScript補完
  - **アイコンライブラリ**: @mui/icons-materialで1000+のMaterial Designアイコン
  - **レスポンシブ対応**: sx propsのブレークポイント対応（xs, md等）が標準機能
  - **アクセシビリティ**: ARIA属性とキーボードナビゲーションがデフォルトでサポート
- **Implementation Changes**:
  - **依存関係追加**:
    - @mui/material: コアコンポーネントライブラリ
    - @emotion/react, @emotion/styled: MUIの依存CSS-in-JSライブラリ
    - @mui/icons-material: Material Designアイコン
  - **コンポーネント書き換え**:
    - `App.tsx`: ThemeProvider導入、グラデーション背景、Paper/Containerレイアウト
    - `Timer.tsx`: Box, Button, Typography, Chip使用、モード別グラデーション
    - `ModeSelector.tsx`: ToggleButtonGroupでモード切り替え、Work/LocalCafeアイコン
    - `Settings.tsx`: Card, TextField, Switch使用、Dividerで区切り
  - **Tailwind CSS除去**: postcss.config.jsは残存（@tailwindcss/postcss設定）、実際のクラスは全て削除
- **Rationale**:
  - カスタムTailwind実装よりも統一されたデザインシステムが得られる
  - コンポーネントレベルでのスタイリングにより保守性向上
  - グラデーション、シャドウ、アニメーション等の視覚効果が容易に実装可能
  - TypeScriptとの統合により型安全なスタイリング
- **Trade-offs**:
  - **メリット**:
    - プロフェッショナルなUI/UX
    - 開発速度向上（既製コンポーネント利用）
    - 一貫性のあるデザイン
    - アクセシビリティとレスポンシブ対応が標準
  - **デメリット**:
    - バンドルサイズ増加（MUI + Emotion）
    - Tailwindよりも学習曲線がやや高い
    - カスタマイズにはテーマオーバーライドの理解が必要
- **Follow-up**:
  - design.mdのTechnology Stack更新完了
  - 実装時にテーマカラーとグラデーションの統一性を維持

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| useState中心のコンポーネント状態管理 | 各コンポーネントでuseStateを使用し、カスタムフックで状態ロジックを分離 | シンプルで理解しやすい、小規模アプリに最適、学習コスト低 | 状態が複雑化した場合のリファクタリングコスト | **選択**: アプリ規模と複雑さに最適 |
| useReducer + Context API | グローバル状態管理でアプリ全体の状態を一元管理 | スケーラブル、予測可能な状態遷移、大規模アプリ向け | 小規模アプリには過剰、ボイラープレートコード増加 | 現時点では不要、将来の拡張時に検討 |
| 外部状態管理ライブラリ（Zustand/Jotai） | サードパーティライブラリで状態管理 | 強力な機能、開発者体験向上 | 依存関係増加、学習コスト、オーバーエンジニアリング | ポモドーロタイマーには過剰 |

## Design Decisions

### Decision: Material-UI (MUI) をUIライブラリとして採用
- **Context**: Tailwind CSSで実装したUIに対してユーザーが不満を表明し、よりリッチなデザインを要求
- **Alternatives Considered**:
  1. **Tailwind CSSのカスタマイズ継続** — 独自グラデーション、カスタムコンポーネントで改善
  2. **Material-UI (MUI)** — Material Designベースの包括的コンポーネントライブラリ
  3. **Ant Design** — エンタープライズ向けUIライブラリ
  4. **Chakra UI** — シンプルでアクセシブルなコンポーネントライブラリ
- **Selected Approach**: Material-UI (MUI) 5+
  - ThemeProviderでグローバルテーマ設定（カラーパレット、タイポグラフィ、形状）
  - Emotionベースのsx propsでコンポーネント単位のスタイリング
  - @mui/icons-materialでMaterial Designアイコン使用
- **Rationale**:
  - Material Designは広く認知され、UX/UIのベストプラクティスが確立
  - 包括的なコンポーネントセット（Button, Card, TextField, Switch等）により実装速度向上
  - TypeScript統合が優れており、型安全なスタイリングが可能
  - レスポンシブデザインとアクセシビリティがデフォルトでサポート
  - Emotionによる動的スタイリングで柔軟性とパフォーマンスを両立
- **Trade-offs**:
  - **メリット**: プロフェッショナルなUI、開発速度向上、一貫性、アクセシビリティ
  - **デメリット**: バンドルサイズ増加（MUI + Emotion）、学習コスト、カスタマイズの複雑性
- **Follow-up**: グラデーション背景とモード別カラーリングで視覚的差別化を実現

### Decision: useState中心のシンプルな状態管理を採用
- **Context**: タイマー状態、モード、設定の管理方法を決定する必要があった
- **Alternatives Considered**:
  1. **useState + カスタムフック** — コンポーネント内で状態管理、ロジックをカスタムフックに分離
  2. **useReducer + Context API** — グローバル状態管理で一元化
  3. **外部ライブラリ（Zustand）** — サードパーティの状態管理
- **Selected Approach**: useState + カスタムフック
  - `useTimer`: タイマーロジック（開始/停止/リセット、カウントダウン）
  - `useSettings`: 設定管理とlocalStorage統合
  - `useNotifications`: 通知許可とトリガー
- **Rationale**:
  - アプリの状態は中程度の複雑さで、useStateで十分管理可能
  - コンポーネント階層が浅く、prop drillingの問題が発生しない
  - カスタムフックでロジックを分離することでテスタビリティと再利用性を確保
  - オーバーエンジニアリングを避け、シンプルさを維持
- **Trade-offs**:
  - **メリット**: 学習コスト低、コード量少、デバッグ容易、パフォーマンス良好
  - **デメリット**: 将来的に状態が複雑化した場合のリファクタリングコスト
- **Follow-up**: 実装中に状態管理の複雑さが増した場合、useReducerへの移行を検討

### Decision: コンポーネント分割戦略
- **Context**: UIの保守性とテスタビリティを確保するコンポーネント構造を決定する必要があった
- **Alternatives Considered**:
  1. **単一コンポーネント** — App.tsxにすべてのロジックとUIを集約
  2. **機能ベース分割** — Timer、Settings、Notificationsコンポーネント
  3. **Atomic Design** — Atoms/Molecules/Organismsの階層構造
- **Selected Approach**: 機能ベース分割（中程度の粒度）
  - `Timer`: タイマー表示と制御ボタン
  - `ModeSelector`: 作業/休憩モード切り替え
  - `Settings`: 時間設定UI
  - カスタムフック: useTimer, useSettings, useNotifications
- **Rationale**:
  - 機能ごとに責任が明確に分離
  - 各コンポーネントが独立してテスト可能
  - Atomic Designは小規模アプリには過剰
- **Trade-offs**:
  - **メリット**: 保守性高、テスト容易、責任明確
  - **デメリット**: 単一コンポーネントより構造が複雑
- **Follow-up**: コンポーネント間のデータフローを明確にする

### Decision: localStorage実装戦略
- **Context**: 要件で指定された「変更時に個別保存」を実装する方法を決定する必要があった
- **Alternatives Considered**:
  1. **個別キーで即座保存** — 各設定項目を個別のキーで変更時に保存
  2. **デバウンス付き一括保存** — 変更から500ms後に全設定を保存
  3. **明示的保存ボタン** — ユーザーが「保存」をクリック時に保存
- **Selected Approach**: 個別キーで即座保存
  - キー: `pomodoro_workDuration`, `pomodoro_breakDuration`, `pomodoro_soundEnabled`
  - useLocalStorageカスタムフックでTypeScriptジェネリクス使用
  - 変更時にsetterが自動的にlocalStorageを更新
- **Rationale**:
  - 要件（Requirement 6.1, 6.2）に最も適合
  - ユーザー体験がシームレス（保存アクション不要）
  - データ損失リスク最小（即座保存）
- **Trade-offs**:
  - **メリット**: UX良好、データ損失なし、要件準拠
  - **デメリット**: 高頻度変更時のパフォーマンスオーバーヘッド（軽微）
- **Follow-up**: パフォーマンステストで書き込み頻度の影響を検証

## Risks & Mitigations

- **リスク1: ブラウザ通知許可の拒否率が高い** — 提案: 音声通知をデフォルトで有効にし、ブラウザ通知はオプション機能として提示
- **リスク2: localStorage容量制限（5-10MB）** — 提案: 設定データは数KB程度なので現実的には問題なし。将来的に統計機能追加時は容量監視
- **リスク3: iOS Safariでの通知制限** — 提案: ホーム画面追加の手順をドキュメント化し、ユーザーガイドで案内
- **リスク4: タイマー精度の問題（setIntervalのドリフト）** — 提案: Date.now()ベースの経過時間計算で精度を確保
- **リスク5: 負の値やゼロ値の入力** — 提案: フォームバリデーションで1-60分（作業）、1-30分（休憩）の範囲を強制

## References

- [React State Hooks: useReducer, useState, useContext - Robin Wieruch](https://www.robinwieruch.de/react-state-usereducer-usestate-usecontext/)
- [Using the Notifications API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API)
- [useLocalStorage - usehooks-ts](https://usehooks-ts.com/react-hook/use-local-storage)
- [Building a pomodoro timer with Tauri using React and Vite - LogRocket](https://blog.logrocket.com/build-pomodoro-timer-tauri-using-react-and-vite/)
- [Should I useState or useReducer? - Kent C. Dodds](https://kentcdodds.com/blog/should-i-usestate-or-usereducer)
- [Web Notifications - Can I use](https://caniuse.com/notifications)
