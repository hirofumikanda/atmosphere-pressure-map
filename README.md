# 大気圧マップ（Atmosphere Pressure Map）

NOAA Global Forecast System（GFS）の大気圧データを時系列で可視化するReact TypeScriptウェブアプリケーションです。MapLibre GLとPMTilesを使用して、24時間の海面気圧データをカラーマップと等圧線の両方で表示し、インタラクティブなタイムスライダーで時間的な変化を観察できます。

## 主な機能

- **24時間時系列可視化**: 2025年11月1日の00:00-23:00（UTC）の気圧データを1時間ごとに表示
- **デュアル可視化方式**: 
  - カラーレリーフマップ（980-1040 hPa の圧力範囲で線形変化）
  - ベクター等圧線（20 hPa間隔でメジャー等圧線を強調表示）
- **インタラクティブ操作**:
  - タイムスライダーによる時間制御
  - 等圧線クリックで詳細情報ポップアップ表示
  - レスポンシブデザイン（デスクトップ/タブレット/モバイル対応）
- **高性能データ配信**: PMTilesフォーマットによる効率的なタイル配信

## デモ

[Live Demo](https://hirofumikanda.github.io/atmosphere-pressure-map)

## データソース

- **NOAA Global Forecast System (GFS)**: アメリカ海洋大気庁の全球予報システム
- **データ期間**: 2025年11月1日 00:00-23:00 UTC
- **空間解像度**: グローバルカバレッジ
- **時間解像度**: 1時間間隔（24時間分）
- **データフォーマット**: PMTiles（terrainRGB + ベクター）

## インストールと起動

### セットアップ手順

```bash
# リポジトリをクローン
git clone https://github.com/hirofumikanda/atmosphere-pressure-map.git
cd atmosphere-pressure-map

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

開発サーバーが起動したら、ブラウザで `http://localhost:5173` にアクセスしてください。

## プロジェクト構造

```
src/
├── components/
│   ├── MapView.tsx          # メインマップコンポーネント
│   └── TimeSlider.tsx       # 時間制御スライダー
├── hooks/
│   └── useMap.ts           # 地図初期化・制御ロジック
├── styles/
│   ├── map.css             # 地図スタイル
│   ├── popup.css           # ポップアップスタイル
│   └── timeSlider.css      # タイムスライダースタイル
├── App.tsx                 # ルートコンポーネント
└── main.tsx               # エントリーポイント

public/
├── data/                   # PMTilesデータファイル
│   ├── prmsl_hpa_terrainrgb_20251101_XXX.pmtiles  # terrainRGB形式の気圧データ
│   └── prmsl_isobar_20251101_XXX.pmtiles          # 等圧線ベクターデータ
├── styles/
│   └── style.json          # MapLibreスタイル定義
└── font/                   # Webフォント
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 関連リンク

- [NOAA GFS Data](https://registry.opendata.aws/noaa-gfs-bdp-pds/)