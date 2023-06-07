import React, { useState, useEffect, useRef } from "react";
import { formatCurrency } from "@utils/helperFunctions.jsx";
import "./Range.css";

const Range = ({ values, min, max }) => {
  const [minValue] = useState(values ? values[0] : min);
  const [maxValue] = useState(values ? values[values.length - 1] : max);
  const [minThumbValue, setMinThumbValue] = useState(minValue);
  const [maxThumbValue, setMaxThumbValue] = useState(maxValue);

  const sliderRef = useRef(null);
  const minThumbRef = useRef(null);
  const maxThumbRef = useRef(null);
  const minInputRef = useRef(null);
  const maxInputRef = useRef(null);

  const isDraggingMinRef = useRef(false);
  const isDraggingMaxRef = useRef(false);

  // needed to update input defaultValue
  const updateValue = () => {
    if (!values) {
      minInputRef.current.value = formatCurrency(minThumbValue);
      maxInputRef.current.value = formatCurrency(maxThumbValue);
    }
  };

  const handleMouseMove = (event) => {
    // Get slidebar and mouse related position in percentage
    const sliderRect = sliderRef.current.getBoundingClientRect();
    const offsetX = event.clientX - sliderRect.left;
    const percentage = (offsetX / sliderRect.width) * 100;

    //Calculates values[index] based on thumb position
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
    // add arrow key to inc/dec the values on focus thumb
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (document.activeElement === minThumbRef.current) {
        setMinThumbValue((prev) => {
          if (values) {
            const index = values.findIndex((value) => value === prev);
            return values[index - 1] >= minValue ? values[index - 1] : prev;
          } else {
            return prev > minValue ? prev - 1 : prev;
          }
        });
      }

      if (document.activeElement === maxThumbRef.current) {
        setMaxThumbValue((prev) => {
          if (values) {
            const index = values.findIndex((value) => value === prev);
            return values[index - 1] >= minThumbValue
              ? values[index - 1]
              : prev;
          } else {
            return prev > minThumbValue ? prev - 1 : prev;
          }
        });
      }
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      if (document.activeElement === minThumbRef.current) {
        setMinThumbValue((prev) => {
          if (values) {
            const index = values.findIndex((value) => value === prev);
            return values[index + 1] <= maxThumbValue
              ? values[index + 1]
              : prev;
          } else {
            return prev < maxThumbValue ? prev + 1 : prev;
          }
        });
      }
      if (document.activeElement === maxThumbRef.current) {
        setMaxThumbValue((prev) => {
          if (values) {
            const index = values.findIndex((value) => value === prev);
            return values[index + 1] <= maxValue ? values[index + 1] : prev;
          } else {
            return prev < maxValue ? prev + 1 : prev;
          }
        });
      }
      // edit focus input on backspace press
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
          ref={minInputRef}
          defaultValue={formatCurrency(minThumbValue)}
          onClick={(event) => event.target.select()}
          onKeyDown={handleMinValueChange}
        />
      )}
      <div data-testid="slider-track" className="slider" ref={sliderRef}>
        <div
          data-testid="min-thumb"
          className="slider-thumb"
          ref={minThumbRef}
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
          ref={maxThumbRef}
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
          ref={maxInputRef}
          defaultValue={formatCurrency(maxThumbValue)}
          onClick={(event) => event.target.select()}
          onKeyDown={handleMaxValueChange}
        />
      )}
    </div>
  );
};

export default Range;
