import React, { useState, useEffect, useRef } from "react";
import "./Range.css";

const Range = ({ min, max, step }) => {
  // State variables to hold min and max values
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);

  // Refs for DOM elements
  const sliderRef = useRef(null);
  const minThumbRef = useRef(null);
  const maxThumbRef = useRef(null);

  // Refs for dragging status
  const isDraggingMinRef = useRef(false);
  const isDraggingMaxRef = useRef(false);

  // Function to update values and handle constraints
  const updateValue = () => {
    if (minValue >= maxValue - step) {
      setMinValue(maxValue - step);
      isDraggingMinRef.current = false;
    }
    if (maxValue <= minValue + step) {
      setMaxValue(minValue + step);
      isDraggingMaxRef.current = false;
    }
    console.log(minValue);
    console.log(maxValue);
  };

  // Handle mouse move event
  const handleMouseMove = (event) => {
    const sliderRect = sliderRef.current.getBoundingClientRect();
    const offsetX = event.clientX - sliderRect.left;
    const percentage = (offsetX / sliderRect.width) * 100;
    const value = Math.round((max - min) * (percentage / 100)) + min;

    if (isDraggingMinRef.current && value < maxValue - step && value >= min) {
      setMinValue(value);
    } else if (
      isDraggingMaxRef.current &&
      value > minValue + step &&
      value <= max
    ) {
      setMaxValue(value);
    }
  };

  // Update the position of thumbs
  const updateThumbPosition = () => {
    const trackWidth = sliderRef.current.offsetWidth;
    const minThumbWidth = minThumbRef.current.offsetWidth;
    const maxThumbWidth = maxThumbRef.current.offsetWidth;
    const minThumbPosition =
      ((minValue - min) / (max - min)) * (trackWidth - minThumbWidth);
    const maxThumbPosition =
      ((maxValue - min) / (max - min)) * (trackWidth - maxThumbWidth);
    minThumbRef.current.style.left = `${minThumbPosition}px`;
    maxThumbRef.current.style.left = `${maxThumbPosition}px`;
  };

  // Handle mouse up event
  const handleMouseUp = () => {
    isDraggingMinRef.current = false;
    isDraggingMaxRef.current = false;
  };

  // Handle mouse down event
  const handleMouseDown = (isMinThumb) => {
    if (isMinThumb) {
      isDraggingMinRef.current = true;
    } else {
      isDraggingMaxRef.current = true;
    }
  };

  // Handle input change event
  const handleMinValueChange = (event) => {
    const newValue = Number(event.target.value);
    if (newValue <= maxValue - step) {
      setMinValue(newValue);
    } else {
      event.target.value = minValue;
    }
  };

  const handleMaxValueChange = (event) => {
    const newValue = Number(event.target.value);
    if (newValue >= minValue + step) {
      setMaxValue(newValue);
    } else {
      event.target.value = maxValue;
    }
  };

  // Attach event listeners and clean up
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Update thumb positions and values when min/max values change
  useEffect(() => {
    updateThumbPosition();
    updateValue();
  }, [minValue, maxValue]);

  return (
    <div className="container">
      <input
        className="value-input"
        type="number"
        value={minValue}
        onClick={(event) => event.target.select()}
        onChange={handleMinValueChange}
      />
      <div className="slider" ref={sliderRef}>
        <div className="slider-track" />
        <div
          className="slider-thumb"
          ref={minThumbRef}
          onMouseDown={() => handleMouseDown(true)}
        />
        <div
          className="slider-thumb"
          ref={maxThumbRef}
          onMouseDown={() => handleMouseDown(false)}
        />
      </div>
      <input
        className="value-input"
        type="number"
        value={maxValue}
        onClick={(event) => event.target.select()}
        onChange={handleMaxValueChange}
      />
    </div>
  );
};

export default Range;
