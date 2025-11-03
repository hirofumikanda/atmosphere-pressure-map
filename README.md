# 大気圧・風速マップ（Atmosphere Pressure & Wind Map）

NOAA Global Forecast System（GFS）の大気圧・風速データを時系列で可視化するReact TypeScriptウェブアプリケーションです。MapLibre GLとPMTilesを使用して、24時間の海面気圧データをカラーマップと等圧線で表示し、WeatherLayers.glによる風速パーティクルアニメーションと組み合わせることで、大気の動きを包括的に可視化します。

## 主な機能

- **24時間時系列可視化**: 2025年11月1日の00:00-23:00（UTC）の気圧・風速データを1時間ごとに表示
- **大気圧可視化**: 
  - カラーレリーフマップ（980-1040 hPa の圧力範囲で線形変化）
  - ベクター等圧線（20 hPa間隔でメジャー等圧線を強調表示）
- **風速可視化**:
  - リアルタイムパーティクルアニメーション（5000パーティクル）
  - WeatherLayers.glによる高性能レンダリング
  - 時刻連動による風向・風速の時系列変化表示
- **インタラクティブ操作**:
  - タイムスライダーによる気圧・風速データの同期制御
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
- **データフォーマット**: 
  - 気圧データ: PMTiles（terrainRGB + ベクター）
  - 風速データ: PNG画像（U/V成分合成、-40〜40 m/s範囲）

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
│   └── useMap.ts           # 地図初期化・制御ロジック（風速レイヤー管理含む）
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
├── img/                    # 風速データファイル
│   └── wind_20251101_XXX.png                      # 時間別風速U/V成分画像
├── styles/
│   └── style.json          # MapLibreスタイル定義
└── font/                   # Webフォント
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 関連リンク

- [NOAA GFS Data](https://registry.opendata.aws/noaa-gfs-bdp-pds/)