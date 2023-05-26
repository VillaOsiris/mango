import React, { useState } from "react";
import "./Range.css";

const Range = ({ min, max, step, value, onChange }) => {
  const [sliderValue, setSliderValue] = useState(value);

  const handleChange = (event) => {
    const newValue = Number(event.target.value);
    setSliderValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="container">
      <p>{min}€</p>
      <div className="range-slider">
        <div className="slider-track">
          <div
            className="slider-thumb"
            style={{
              left: `${((sliderValue - min) / (max - min)) * 100}%`,
            }}
          />
        </div>
      </div>
      <p>{max}€</p>
    </div>
  );
};

export default Range;
