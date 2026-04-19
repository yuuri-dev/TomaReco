# TomaReco — CLAUDE.md

## プロジェクト概要

**TomaReco（トマレコ）** は毎日の学習を記録・習慣化するための iOS アプリ。
シンプルさ最優先のUX。ユーザーはアプリに時間をかけたくない。

- **App Store**: https://apps.apple.com/jp/app/tomareco/id6760455427
- **テーマカラー**: `#ff6347`（トマト色）
- **現在のバージョン**: 1.1.0（審査中）

---

## 技術スタック

| 項目 | 内容 |
|------|------|
| フレームワーク | React Native + Expo SDK 54 |
| ルーティング | Expo Router（ファイルベース） |
| 言語 | TypeScript（strict） |
| 状態管理 | React Context API（`context/AppContext.tsx`） |
| ストレージ | AsyncStorage（全データ端末内保存） |
| ビルド | EAS Build（`eas build --platform ios --profile production`） |
| 配信 | EAS Submit（`eas submit --platform ios --latest`） |

---

## ディレクトリ構成

```
app/
  _layout.tsx          # ルートレイアウト（GestureHandlerRootView + AppProvider）
  index.tsx            # 初回オンボーディング判定 → /home or /onboarding
  onboarding.tsx       # 初回起動時のオンボーディング（4ページ）
  (tabs)/
    _layout.tsx        # タブナビ（ホーム・統計・設定）+ Header
    home.tsx           # ホーム画面（カレンダー・記録リスト・ストリーク）
    stats.tsx          # 統計画面（グラフ・シェア・広告）
    settings.tsx       # 設定画面（通知・ジャンル管理・データ削除）

components/
  Ads/BannerAd.tsx     # AdMobバナー（ネイティブ未登録環境では非表示）
  Calendar/            # カレンダー関連（Calendar, DayCell, MonthHeader）
  Genre/               # ジャンル関連（GenreSelector, AddGenreForm）
  Layout/Header.tsx    # アプリ上部ヘッダー
  Modal/               # モーダル（AddRecordModal, EditGenreModal）
  Record/RecordList.tsx
  Share/ShareCard.tsx  # SNSシェア用カード画像

context/AppContext.tsx  # グローバル状態（records, genres, 通知, etc.）
hooks/useShare.ts       # SNSシェアロジック
utils/notification.ts   # expo-notifications ラッパー
type/record.ts          # Record 型
type/genre.ts           # Genre 型
assets/images/
  icon.png / splash.png
  tomato.jpg           # 学習した日に表示
  naegi.jpg            # 今日まだ学習していない日に表示
```

---

## ブランチ運用

- `main` — リリース済みコード
- `develop` — 開発ブランチ（作業はここで行い PR で main へ）

**作業フロー:**
```
git checkout develop
# 実装・コミット
git push origin develop
# GitHub で develop → main PR を作成・マージ
eas build --platform ios --profile production
eas submit --platform ios --latest  # ターミナルで直接実行（認証が必要）
```

---

## 環境変数

`.env.local`（gitignore済み）に保存。EAS には secret として登録済み。

| 変数名 | 用途 |
|--------|------|
| `ADMOB_APP_ID` | Google AdMob アプリID |
| `ADMOB_BANNER_ID` | バナー広告ユニットID |

ローカル開発中は `__DEV__ = true` のためテスト広告が表示される。
`app.config.js` で env を読み込み（`app.json` は使用していない）。

---

## 主要な実装メモ

### データ
- 全記録は `AsyncStorage` キー `'tomato-data'` に JSON で保存
- 通知設定は `'tomato-notification'` に保存
- オンボーディング表示済みフラグは `'tomato-onboarding-seen'` に保存

### 通知
- `expo-notifications` で毎日指定時刻にリマインダー
- 許可フロー・時刻設定は設定画面から操作
- `utils/notification.ts` に権限取得・スケジュール・キャンセルをまとめている

### SNSシェア
- `react-native-view-shot` で ShareCard を画像キャプチャ
- iOS: `Share.share({ message, url: imageUri })` でテキスト＋画像を同時共有
- Android: テキストのみ（Share API の制約）
- ShareCard はオフスクリーン（`top: -9999`）に常時レンダリング

### 広告
- `react-native-google-mobile-ads` バナー広告（統計タブ下部）
- Expo Go / ネイティブ未登録環境では try-catch で非表示にしている
- EAS Build 必須（Expo Go 非対応）

### ジャンル
- デフォルト3件（プログラミング・読書・英語）
- 追加・編集・削除すべて対応
- 記録追加モーダルのチップで長押し削除、設定画面で編集・削除ボタン

---

## よくあるビルドエラー

| エラー | 原因 | 対処 |
|--------|------|------|
| `aps-environment entitlement` でビルド失敗 | Provisioning Profile に Push Notifications が未登録 | `eas credentials --platform ios --profile production` でプロファイルを更新 |
| `version is not accepted` で submit 失敗 | `app.config.js` のバージョンが古い | `version` を上げて再ビルド |
| クラッシュ（AdMob） | EAS に `ADMOB_APP_ID` が未登録 | `eas env:create` で登録後再ビルド |
| `RNGoogleMobileAdsModule could not be found` | Expo Go で実行している | EAS Build した実機バイナリで確認する |

---

## 広告デバッグ（未解決・2026-04-19 時点）

### 状況
- v1.5（build 19）をTestFlightにサブミット済みだが広告が表示されない
- AdMobダッシュボードはステータス「準備完了」

### これまでの修正内容
1. **`BannerAd.tsx`** — 広告ID取得を多段フォールバック化（`EXPO_PUBLIC_ADMOB_BANNER_ID` → `expoConfig.extra` → manifest系）
2. **`_layout.tsx`** — ATT許可取得 → AdMob初期化の順序修正（以前は逆順だった）
3. **EAS環境変数** — `EXPO_PUBLIC_ADMOB_BANNER_ID` を production に Plain text で登録済み

### 現在の仮説
- 新規アプリのためAdMobの広告フィル率が低い（数日〜数週間で改善することがある）
- `BannerAd.tsx` に `console.warn` デバッグログを追加済みだが、EAS無料プランのビルド上限（月次）に達して検証できていない

### 5月1日以降にやること
1. `eas build --platform ios --profile development` で開発ビルドを作成（端末登録済み）
2. Xcodeコンソールで `AdBanner` を検索してログを確認
3. ログ: `[AdBanner] NativeBannerAd: true/false, size: true/false, unitId: xxx`
   - どれかが false/空 → コードの問題
   - 全部 true → AdMobのフィル率の問題（しばらく待つ）
4. 確認後 `console.warn` デバッグログは削除する（`components/Ads/BannerAd.tsx:31`）
