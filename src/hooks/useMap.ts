import { useEffect, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";
import { Protocol } from "pmtiles";

export const useMap = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  // レイヤーの可視性を制御する関数
  const setTimeLayerVisibility = useCallback((timeIndex: number) => {
    const map = mapRef.current;
    if (!map) return;

    // 全ての時刻レイヤーを非表示にする
    for (let i = 0; i <= 23; i++) {
      const timeStr = i.toString().padStart(3, '0');
      const pressureLayerId = `pressure-relief_${timeStr}`;
      const isobarLayerId = `isobar_${timeStr}`;
      const labelLayerId = `isobar-label_${timeStr}`;

      // レイヤーが存在する場合のみ可視性を設定
      if (map.getLayer(pressureLayerId)) {
        map.setLayoutProperty(pressureLayerId, 'visibility', 'none');
      }
      if (map.getLayer(isobarLayerId)) {
        map.setLayoutProperty(isobarLayerId, 'visibility', 'none');
      }
      if (map.getLayer(labelLayerId)) {
        map.setLayoutProperty(labelLayerId, 'visibility', 'none');
      }
    }

    // 選択された時刻のレイヤーを表示する
    const selectedTimeStr = timeIndex.toString().padStart(3, '0');
    const selectedPressureLayerId = `pressure-relief_${selectedTimeStr}`;
    const selectedIsobarLayerId = `isobar_${selectedTimeStr}`;
    const selectedLabelLayerId = `isobar-label_${selectedTimeStr}`;

    if (map.getLayer(selectedPressureLayerId)) {
      map.setLayoutProperty(selectedPressureLayerId, 'visibility', 'visible');
    }
    if (map.getLayer(selectedIsobarLayerId)) {
      map.setLayoutProperty(selectedIsobarLayerId, 'visibility', 'visible');
    }
    if (map.getLayer(selectedLabelLayerId)) {
      map.setLayoutProperty(selectedLabelLayerId, 'visibility', 'visible');
    }
  }, []);

  // 地図の初期化（一度だけ実行）
  useEffect(() => {
    const protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);

    const map = new maplibregl.Map({
      container: mapContainerRef.current!,
      style: "styles/style.json",
      center: [139.8, 35.9],
      zoom: 2,
      minZoom: 0,
      pitch: 0,
      hash: true,
    });

    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    // isobarsレイヤーがロードされた後にイベントリスナーを追加
    map.on('load', () => {
      // 全ての等圧線レイヤーにマウスイベントを追加
      for (let i = 0; i <= 23; i++) {
        const timeStr = i.toString().padStart(3, '0');
        const isobarLayerId = `isobar_${timeStr}`;
        
        if (map.getLayer(isobarLayerId)) {
          // マウスカーソルの変更
          map.on('mouseenter', isobarLayerId, () => {
            map.getCanvas().style.cursor = 'pointer';
          });

          map.on('mouseleave', isobarLayerId, () => {
            map.getCanvas().style.cursor = '';
          });

          // クリックイベント
          map.on('click', isobarLayerId, (e) => {
            if (e.features && e.features.length > 0) {
              const feature = e.features[0];
              const pressure = feature.properties?.prmsl;
              
              if (pressure) {
                new maplibregl.Popup()
                  .setLngLat(e.lngLat)
                  .setHTML(`
                    <div class="pressure-popup">
                      <strong>気圧</strong><br>
                      <div class="pressure-value">${pressure} hPa</div>
                      <div class="time-info">時刻: ${i.toString().padStart(2, '0')}:00</div>
                    </div>
                  `)
                  .addTo(map);
              }
            }
          });
        }
      }
    });

    return () => {
      map.remove();
    };
  }, []); // 依存関係を空にして一度だけ実行

  return { 
    mapContainerRef, 
    mapRef,
    setTimeLayerVisibility
  };
};
