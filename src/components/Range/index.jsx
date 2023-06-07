import React, { useState, useEffect, useRef } from "react";
import { formatCurrency } from "@utils/helperFunctions.jsx";
import "./Range.css";

const Range = ({ values, min, max }) => {
  const [minValue] = useState(values ? values[0] : min);
  const [maxValue] = useState(values ? values[values.length - 1] : max);
  const [minThumbValue, setMinThumbValue] = useState(minValue);
  const [maxThumbValue, setMaxThumbValue] = useState(maxValue);

  console.log(minValue, minThumbValue, maxThumbValue, maxValue);

  const sliderRef = useRef(null);
  const minThumb = useRef(null);
  const maxThumb = useRef(null);

  const isDraggingMinRef = useRef(false);
  const isDraggingMaxRef = useRef(false);

  // update values and handle constraints
  const updateValue = () => {
    if (minThumbValue >= maxThumbValue && minThumbValue >= min) {
    } else {
      return;
    }
    if (maxThumbValue <= minThumbValue && maxThumbValue <= maxValue) {
      setMaxThumbValue(minThumbValue);
    }
  };

  const handleMouseMove = (event) => {
    const sliderRect = sliderRef.current.getBoundingClientRect();
    const offsetX = event.clientX - sliderRect.left;
    const percentage = (offsetX / sliderRect.width) * 100;

    //Calculates values array index based on thumb position (important)
    const value = values
      ? values[Math.round((values.length - 1) * (percentage / 100))]
      : Math.round((max - min) * (percentage / 100)) + min;

    if (values) {
      if (isDraggingMinRef.current && value < maxValue && value >= values[0]) {
        setMinThumbValue(value);
      } else if (
        isDraggingMaxRef.current &&
        value > minValue &&
        value <= values[values.length - 1]
      ) {
        setMaxThumbValue(value);
      }
    } else {
      if (isDraggingMinRef.current && value <= maxThumbValue && value >= min) {
        setMinThumbValue(value);
      } else if (
        isDraggingMaxRef.current &&
        value >= minThumbValue &&
        value <= max
      ) {
        setMaxThumbValue(value);
      }
    }
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

  const handleKeyDown = (event) => {
    console.log(maxThumbValue);
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (document.activeElement === minThumb.current) {
        setMinThumbValue((prev) => (prev > minValue ? prev - 1 : prev));
      }

      if (document.activeElement === maxThumb.current) {
        setMaxThumbValue((prev) => (prev > minThumbValue ? prev - 1 : prev));
      }
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      if (document.activeElement === minThumb.current) {
        setMinThumbValue((prev) => (prev >= maxThumbValue ? prev : prev + 1));
      }
      if (document.activeElement === maxThumb.current) {
        setMaxThumbValue((prev) => (prev < maxValue ? prev + 1 : prev));
      }
    } else if (event.key === "Backspace") {
      if (document.activeElement.tagName === "INPUT") {
        event.preventDefault();
        document.activeElement.select();
      }
    }
  };

  // input change events
  const handleMinValueChange = (event) => {
    if (event.key === "Enter") {
      const newValue = Number(event.target.value.replace(/[^0-9.-]+/g, ""));
      if (newValue <= maxThumbValue && newValue >= minValue) {
        setMinThumbValue(newValue);
        event.target.value = formatCurrency(newValue);
      } else {
        event.target.value = formatCurrency(minThumbValue);
      }
    }
  };

  const handleMaxValueChange = (event) => {
    if (event.key === "Enter") {
      const newValue = Number(event.target.value.replace(/[^0-9.-]+/g, ""));
      if (newValue >= minThumbValue && newValue <= maxValue) {
        setMaxThumbValue(newValue);
        event.target.value = formatCurrency(newValue);
      } else {
        event.target.value = formatCurrency(maxThumbValue);
      }
    }
  };

  // event listeners and clean up
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [minThumbValue, maxThumbValue]);

  // to Update values when min/max values change
  useEffect(() => {
    updateValue();
  }, [minThumbValue, maxThumbValue]);

  return (
    <div data-testid="rangeSlider" className="container">
      {values ? (
        <span data-testid="min-value">{formatCurrency(minThumbValue)}</span>
      ) : (
        <input
          data-testid="min-input"
          className="value-input"
          type="text"
          defaultValue={formatCurrency(minThumbValue)}
          onClick={(event) => event.target.select()}
          onKeyDown={handleMinValueChange}
        />
      )}
      <div data-testid="slider-track" className="slider" ref={sliderRef}>
        <div
          data-testid="min-thumb"
          className="slider-thumb"
          ref={minThumb}
          tabIndex={0}
          style={{
            left: `${
              ((minThumbValue - minValue) / (maxValue - minValue)) * 100
            }%`,
          }}
          onMouseDown={() => handleMouseDown(true)}
        />
        <div
          data-testid="max-thumb"
          className="slider-thumb"
          ref={maxThumb}
          tabIndex={0}
          style={{
            left: `${
              ((maxThumbValue - minValue) / (maxValue - minValue)) * 100
            }%`,
          }}
          onMouseDown={() => handleMouseDown(false)}
        />
      </div>
      {values ? (
        <span data-testid="max-value">{formatCurrency(maxThumbValue)}</span>
      ) : (
        <input
          data-testid="max-input"
          className="value-input"
          type="text"
          defaultValue={formatCurrency(maxThumbValue)}
          onClick={(event) => event.target.select()}
          onKeyDown={handleMaxValueChange}
        />
      )}
    </div>
  );
};

export default Range;
