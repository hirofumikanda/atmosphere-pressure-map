import React, { useState, useCallback } from "react";
import { useMap } from "../hooks/useMap";
import TimeSlider from "./TimeSlider";
import "../styles/map.css";
import "../styles/popup.css";

const MapView: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const { 
    mapContainerRef,
    setTimeLayerVisibility
  } = useMap();

  const handleTimeChange = useCallback((time: number) => {
    setCurrentTime(time);
    setTimeLayerVisibility(time);
  }, [setTimeLayerVisibility]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div 
        ref={mapContainerRef} 
        style={{ width: "100%", height: "100%" }} 
      />
      <TimeSlider 
        currentTime={currentTime}
        onTimeChange={handleTimeChange}
      />
    </div>
  );
};

export default MapView;
