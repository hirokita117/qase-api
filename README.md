# Qase API クライアント

Qase REST API v1 を呼び出す CLI ツール（TypeScript / Node.js）

## セットアップ

```bash
npm install
```

`.env` ファイルに Qase API トークンを設定:

```
QASE_API_TOKEN=your_token_here
```

## 使い方

```bash
npx tsx src/index.ts <command> <project-code> [options]
```

### テストスイート一覧取得

```bash
npx tsx src/index.ts get-suites PROJ
```

### テストケース一覧取得

```bash
npx tsx src/index.ts get-cases PROJ
```

### テストケース詳細取得

```bash
npx tsx src/index.ts get-case PROJ 42
```

### テストラン作成

```bash
npx tsx src/index.ts create-run PROJ --title "Run #1"
npx tsx src/index.ts create-run PROJ --title "Run #1" --cases 1,2,3
```

### テスト結果登録

```bash
npx tsx src/index.ts add-result PROJ 456 --case-id 42 --status passed
```

`--status` には `passed`, `failed`, `blocked`, `skipped` などを指定できます。

### テストスイート作成

```bash
npx tsx src/index.ts create-suite PROJ --title "通知管理機能"
npx tsx src/index.ts create-suite PROJ --title "子スイート" --parent-id 10
npx tsx src/index.ts create-suite PROJ --title "説明付き" --description "スイートの説明"
```

### テストケース作成

```bash
npx tsx src/index.ts create-case PROJ --title "通知表示"
npx tsx src/index.ts create-case PROJ --title "通知表示" --suite-id 10
npx tsx src/index.ts create-case PROJ --title "ケース" --suite-id 10 --description "ケースの説明"
```

### Gherkin 一括インポート

`.feature` ファイルを読み込み、Feature をテストスイート、Scenario / Scenario Outline をテストケースとして Qase に一括登録します。

```bash
npx tsx src/index.ts import-gherkin PROJ --file path/to/notification.feature
```

- `Feature:` → テストスイート
- `Scenario:` → テストケース
- `Scenario Outline:` + `Examples:` → Examples の各行ごとに変数を置換したテストケースを作成
- `Given` / `When` / `Then` / `And` / `But` → テストケースのステップ

## API リファレンス

| コマンド | エンドポイント | 説明 |
|---------|---------------|------|
| `get-suites` | `GET /v1/suite/{code}` | テストスイート一覧取得 |
| `get-cases` | `GET /v1/case/{code}` | テストケース一覧取得 |
| `get-case` | `GET /v1/case/{code}/{id}` | テストケース詳細取得 |
| `create-run` | `POST /v1/run/{code}` | テストラン作成 |
| `add-result` | `POST /v1/result/{code}/{runId}` | テスト結果登録 |
| `create-suite` | `POST /v1/suite/{code}` | テストスイート作成 |
| `create-case` | `POST /v1/case/{code}` | テストケース作成 |
| `import-gherkin` | — | Gherkin ファイル一括インポート |

詳細: https://developers.qase.io/reference
