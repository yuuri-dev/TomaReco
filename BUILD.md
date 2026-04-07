# TomaReco ビルド・開発手順

---

## ローカル開発

### 初回セットアップ

```bash
npm install
```

`.env.local` を用意（gitignore済み）：

```
ADMOB_APP_ID=ca-app-pub-xxxxxxxxxx~xxxxxxxxxx
ADMOB_BANNER_ID=ca-app-pub-xxxxxxxxxx/xxxxxxxxxx
```

### シミュレーターで起動

```bash
npx expo prebuild --clean   # ios/ フォルダを再生成（初回 or 依存変更時）
npx expo run:ios            # ビルド & シミュレーター起動
```

> **注意:** `npx expo prebuild --clean` は AsyncStorage を含むネイティブデータをリセットするため、記録が消える。開発中は `--clean` なしで起動できるが、ネイティブモジュール（AdMob等）を変更した場合は再実行が必要。

### Metro のみ再起動（コード変更だけの場合）

```bash
npx expo start --clear   # キャッシュクリアして Metro 起動
```

---

## プロダクションビルド（App Store 提出用）

### 1. バージョンを上げる

`app.config.js` の `version` を更新する：

```js
version: '1.x',
```

設定画面の表示（`app/(tabs)/settings.tsx`）も合わせて更新する：

```tsx
<ActionRow label="バージョン" value="1.x" />
```

### 2. develop → main に PR を出してマージ

```bash
git push origin develop
# GitHub で develop → main の PR を作成・マージ
```

### 3. EAS ビルド

```bash
eas build --platform ios --profile production
```

- クラウドでビルドされる（10〜20分程度）
- `autoIncrement: true` により `buildNumber` は自動でインクリメントされる

### 4. App Store に提出

```bash
eas submit --platform ios --latest
```

- ターミナルで直接実行（EAS の認証が必要）
- App Store Connect にアップロード後、審査へ提出

---

## よくあるエラー

| エラー | 原因 | 対処 |
|--------|------|------|
| `GADInvalidInitializationException` | `ADMOB_APP_ID` が未設定 | `.env.local` を確認 or `npx expo prebuild --clean` で再生成 |
| `Unknown arguments: --clean` | `expo run:ios` に `--clean` は使えない | `expo prebuild --clean` を先に実行する |
| `No development build installed` | シミュレーターにバイナリが未インストール | `npx expo run:ios` で再インストール |
| `version is not accepted` | `app.config.js` のバージョンが古い | バージョンを上げて再ビルド |
| `aps-environment entitlement` | Provisioning Profile に Push Notifications 未登録 | `eas credentials --platform ios --profile production` でプロファイル更新 |

---

## ブランチ運用

```
main      ← リリース済みコード（App Store 提出はここから）
develop   ← 開発ブランチ（作業はここで行い PR で main へ）
```
