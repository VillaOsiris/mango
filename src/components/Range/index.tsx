import React from "react";
import useRange from "./hooks/useRange";
import { formatCurrency, isAscending } from "@/utils/helperFunctions";
import "./Range.css";

type RangeProps =
  | {
      min: number;
      max: number;
      values?: never;
    }
  | {
      min?: never;
      max?: never;
      values: number[];
    };

const Range = ({ values, min, max }: RangeProps) => {
  const {
    minValue,
    maxValue,
    minThumbValue,
    maxThumbValue,
    sliderRef,
    minThumbRef,
    maxThumbRef,
    minInputRef,
    maxInputRef,
    handleMouseDown,
    handleMinValueChange,
    handleMaxValueChange,
  } = useRange(values ? { values } : { min, max });

  if (min !== undefined && max !== undefined && min > max) {
    return (
      <div className="centered">
        <h2>Invalid min and max values.</h2>
        <p>"Min value must be smaller than max value."</p>
      </div>
    );
  }

  if (values !== undefined && !isAscending(values)) {
    return (
      <div className="centered">
        <h2>Invalid values array.</h2>
        <p>"Array values must be in ascending order."</p>
      </div>
    );
  }

  return (
    <div data-testid="rangeSlider" className="container">
      {values ? (
        <span title="Maximum Value" data-testid="min-value">
          {formatCurrency(minThumbValue)}
        </span>
      ) : (
        <input
          title="Minimum Value Input"
          aria-label="Minimum Value Input"
          data-testid="min-input"
          className="value-input"
          type="text"
          ref={minInputRef}
          defaultValue={formatCurrency(minThumbValue)}
          onClick={(event) => (event.target as HTMLInputElement).select()}
          onKeyDown={handleMinValueChange}
        />
      )}
      <div data-testid="slider-track" className="slider" ref={sliderRef}>
        <div
          title="Minimum Thumb"
          aria-label="Minimum Thumb"
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
          title="Maximum Thumb"
          aria-label="Maximum Thumb"
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
        <span title="Maximum Value" data-testid="max-value">
          {formatCurrency(maxThumbValue)}
        </span>
      ) : (
        <input
          title="Maximum Value Input"
          aria-label="Maximum Value Input"
          data-testid="max-input"
          className="value-input"
          type="text"
          ref={maxInputRef}
          defaultValue={formatCurrency(maxThumbValue)}
          onClick={(event) => (event.target as HTMLInputElement).select()}
          onKeyDown={handleMaxValueChange}
        />
      )}
    </div>
  );
};

export default Range;
