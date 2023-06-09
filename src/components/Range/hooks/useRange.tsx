import { useState, useEffect, useRef } from "react";
import { formatCurrency } from "@/utils/helperFunctions";

type RangeProps =
  | {
      values: number[];
      min?: never;
      max?: never;
    }
  | {
      values?: never;
      min: number;
      max: number;
    };

const useRange = ({ values, min, max }: RangeProps) => {
  const [minValue] = useState<number>(() => (values ? values[0] : min));
  const [maxValue] = useState<number>(() =>
    values ? values[values.length - 1] : max
  );
  const [minThumbValue, setMinThumbValue] = useState<number>(minValue);
  const [maxThumbValue, setMaxThumbValue] = useState<number>(maxValue);

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const minThumbRef = useRef<HTMLDivElement | null>(null);
  const maxThumbRef = useRef<HTMLDivElement | null>(null);
  const minInputRef = useRef<HTMLInputElement | null>(null);
  const maxInputRef = useRef<HTMLInputElement | null>(null);

  const isDraggingMinRef = useRef<boolean>(false);
  const isDraggingMaxRef = useRef<boolean>(false);

  const handleMouseMove = (event: MouseEvent) => {
    // Get slidebar and mouse related position in percentage
    const sliderRect = sliderRef.current!.getBoundingClientRect();
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
        value >= minThumbValue &&
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
  const handleMouseDown = (isMinThumb: boolean) => {
    if (isMinThumb) {
      isDraggingMinRef.current = true;
    } else {
      isDraggingMaxRef.current = true;
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    // add arrow key to inc/dec the values on focus thumb
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (document.activeElement === minThumbRef.current) {
        setMinThumbValue((prev) => {
          if (values) {
            const index = values.findIndex((value: number) => value === prev);
            return values[index - 1] >= minValue ? values[index - 1] : prev;
          } else {
            return prev > minValue ? prev - 1 : prev;
          }
        });
      }

      if (document.activeElement === maxThumbRef.current) {
        setMaxThumbValue((prev) => {
          if (values) {
            const index = values.findIndex((value: number) => value === prev);
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
            const index = values.findIndex((value: number) => value === prev);
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
            const index = values.findIndex((value: number) => value === prev);
            return values[index + 1] <= maxValue ? values[index + 1] : prev;
          } else {
            return prev < maxValue ? prev + 1 : prev;
          }
        });
      }
      // edit focus input on backspace press
    } else if (event.key === "Backspace") {
      if (document.activeElement?.tagName === "INPUT") {
        event.preventDefault();
        (document.activeElement as HTMLInputElement).select();
      }
    }
  };

  // input change events

  const handleMinValueChange = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const isNumberKey = /^\d$/.test(event.key); //we dont want letter here
    if (!isNumberKey) {
      event.preventDefault();
    }
    if (event.key === "Enter") {
      const newValue = Number(
        (event.target as HTMLInputElement).value.replace(/[^0-9.-]+/g, "")
      );
      if (newValue <= maxThumbValue && newValue >= minValue) {
        setMinThumbValue(newValue);
        (event.target as HTMLInputElement).value = formatCurrency(newValue);
        (event.target as HTMLInputElement).select();
      } else {
        (event.target as HTMLInputElement).value =
          formatCurrency(minThumbValue);
        (event.target as HTMLInputElement).select();
      }
    }
  };

  const handleMaxValueChange = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const isNumberKey = /^\d$/.test(event.key); //we dont want letter here
    if (!isNumberKey) {
      event.preventDefault();
    }
    if (event.key === "Enter") {
      const newValue = Number(
        (event.target as HTMLInputElement).value.replace(/[^0-9.-]+/g, "")
      );
      if (newValue >= minThumbValue && newValue <= maxValue) {
        setMaxThumbValue(newValue);
        (event.target as HTMLInputElement).value = formatCurrency(newValue);
        (event.target as HTMLInputElement).select();
      } else {
        (event.target as HTMLInputElement).value =
          formatCurrency(maxThumbValue);
        (event.target as HTMLInputElement).select();
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
    if (!values) {
      (minInputRef.current as HTMLInputElement).value =
        formatCurrency(minThumbValue);
      (maxInputRef.current as HTMLInputElement).value =
        formatCurrency(maxThumbValue);
    }
  }, [minThumbValue, maxThumbValue]);

  return {
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
  };
};

export default useRange;
