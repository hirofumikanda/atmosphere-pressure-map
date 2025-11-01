import React, { useState, useEffect } from "react";
import "../styles/timeSlider.css";

interface TimeSliderProps {
  currentTime: number;
  onTimeChange: (time: number) => void;
}

const TimeSlider: React.FC<TimeSliderProps> = ({ currentTime, onTimeChange }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onTimeChange(parseInt(event.target.value));
  };

  const formatTime = (time: number): string => {
    return time.toString().padStart(2, '0') + ':00';
  };

  const formatLabel = (time: number): string => {
    // if (isMobile) {
    //   return formatTime(time);
    // }
    return `UTC時刻: 2025/11/01 ${formatTime(time)}`;
  };

  return (
    <div className={`time-slider-container ${isMobile ? 'mobile' : ''}`}>
      <div className="time-slider-header">
        <span className="time-label">{formatLabel(currentTime)}</span>
      </div>
      <div className="time-slider-wrapper">
        <span className="time-min">00:00</span>
        <input
          type="range"
          min="0"
          max="23"
          value={currentTime}
          onChange={handleSliderChange}
          className="time-slider"
          aria-label="時刻選択スライダー"
        />
        <span className="time-max">23:00</span>
      </div>
      <div className="time-markers">
        {Array.from({ length: 24 }, (_, i) => (
          <div 
            key={i} 
            className={`time-marker ${i === currentTime ? 'active' : ''}`}
            style={{ left: `${(i / 23) * 100}%` }}
          >
            {(isMobile ? i % 12 === 0 : i % 6 === 0) ? i.toString().padStart(2, '0') : ''}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeSlider;