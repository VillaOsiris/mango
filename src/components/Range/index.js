import React, { useState, useEffect, useRef } from "react";
import { formatCurrency } from "../../utils/helperFunctions.jsx";
import "./Range.css";

const Range = ({ values, min, max }) => {
  const [minValue, setMinValue] = useState(values ? values[0] : min);
  const [maxValue, setMaxValue] = useState(
    values ? values[values.length - 1] : max
  );

  const sliderRef = useRef(null);
  const minThumbRef = useRef(null);
  const maxThumbRef = useRef(null);

  const isDraggingMinRef = useRef(false);
  const isDraggingMaxRef = useRef(false);

  // update values and handle constraints
  const updateValue = () => {
    if (values) {
      if (minValue >= maxValue) {
        setMinValue(maxValue);
        isDraggingMinRef.current = false;
      }
      if (maxValue <= minValue) {
        setMaxValue(minValue);
        isDraggingMaxRef.current = false;
      }
    } else {
      if (minValue >= maxValue - 1) {
        setMinValue(maxValue - 1);
        isDraggingMinRef.current = false;
      }
      if (maxValue <= minValue + 1) {
        setMaxValue(minValue + 1);
        isDraggingMaxRef.current = false;
      }
    }
  };

  const handleMouseMove = (event) => {
    const sliderRect = sliderRef.current.getBoundingClientRect();
    const offsetX = event.clientX - sliderRect.left;
    const percentage = (offsetX / sliderRect.width) * 100;

    const value = values
      ? values[Math.round((values.length - 1) * (percentage / 100))]
      : Math.round((max - min) * (percentage / 100)) + min;
    if (values) {
      if (isDraggingMinRef.current && value < maxValue && value >= values[0]) {
        setMinValue(value);
      } else if (
        isDraggingMaxRef.current &&
        value > minValue &&
        value <= values[values.length - 1]
      ) {
        setMaxValue(value);
      }
    } else {
      if (isDraggingMinRef.current && value < maxValue - 1 && value >= min) {
        setMinValue(value);
      } else if (
        isDraggingMaxRef.current &&
        value > minValue + 1 &&
        value <= max
      ) {
        setMaxValue(value);
      }
    }
  };

  const updateThumbPosition = () => {
    const trackWidth = sliderRef.current.offsetWidth;
    const minThumbPosition =
      ((minValue - (values ? values[0] : min)) /
        ((values ? values[values.length - 1] : max) -
          (values ? values[0] : min))) *
      trackWidth;
    const maxThumbPosition =
      ((maxValue - (values ? values[0] : min)) /
        ((values ? values[values.length - 1] : max) -
          (values ? values[0] : min))) *
      trackWidth;
    minThumbRef.current.style.left = `${minThumbPosition}px`;
    maxThumbRef.current.style.left = `${maxThumbPosition}px`;
  };

  // sets dragging off when mouse up
  const handleMouseUp = () => {
    isDraggingMinRef.current = false;
    isDraggingMaxRef.current = false;
  };

  // ativetes dragging on mouse down
  const handleMouseDown = (isMinThumb) => {
    if (isMinThumb) {
      isDraggingMinRef.current = true;
    } else {
      isDraggingMaxRef.current = true;
    }
  };

  // input change events
  const handleMinValueChange = (event) => {
    const newValue = Number(event.target.value.replace(/[^0-9.-]+/g, ""));
    if (newValue <= maxValue - 1) {
      setMinValue(newValue);
    } else {
      event.target.value = formatCurrency(minValue);
    }
  };

  const handleMaxValueChange = (event) => {
    const newValue = Number(event.target.value.replace(/[^0-9.-]+/g, ""));
    if (newValue >= minValue + 1) {
      setMaxValue(newValue);
    } else {
      event.target.value = formatCurrency(maxValue);
    }
  };

  // event listeners for mouse actions and clean up
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // to Update thumb positions and values when min/max values change
  useEffect(() => {
    updateThumbPosition();
    updateValue();
  }, [minValue, maxValue]);

  return (
    <div data-testid="rangeSlider" className="container">
      {values ? (
        <span data-testid="min-value">{formatCurrency(minValue)}</span>
      ) : (
        <input
          data-testid="min-input"
          className="value-input"
          type="text"
          value={formatCurrency(minValue)}
          onClick={(event) => event.target.select()}
          onChange={handleMinValueChange}
        />
      )}
      <div data-testid="slider-track" className="slider" ref={sliderRef}>
        <div
          data-testid="min-thumb"
          className="slider-thumb"
          ref={minThumbRef}
          onMouseDown={() => handleMouseDown(true)}
        />
        <div
          data-testid="max-thumb"
          className="slider-thumb"
          ref={maxThumbRef}
          onMouseDown={() => handleMouseDown(false)}
        />
      </div>
      {values ? (
        <span data-testid="max-value">{formatCurrency(maxValue)}</span>
      ) : (
        <input
          data-testid="max-input"
          className="value-input"
          type="text"
          value={formatCurrency(maxValue)}
          onClick={(event) => event.target.select()}
          onChange={handleMaxValueChange}
        />
      )}
    </div>
  );
};

export default Range;
