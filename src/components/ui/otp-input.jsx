"use client";
import React, { useRef, useEffect } from "react";

export function OtpInput({ length = 6, value = "", onChange, disabled = false }) {
  const inputRefs = useRef([]);

  useEffect(() => {
    // Auto-focus first empty input on mount
    const firstEmpty = value.length < length ? value.length : 0;
    inputRefs.current[firstEmpty]?.focus();
  }, []);

  const handleChange = (e, index) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    const valueArr = value.split("");
    valueArr[index] = char;
    const newValue = valueArr.join("").slice(0, length);
    onChange(newValue);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pasted) {
      onChange(pasted);
      const nextIndex = Math.min(pasted.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          disabled={disabled}
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="size-12 sm:size-14 text-center text-xl font-bold rounded-xl border border-input bg-card text-foreground transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none disabled:opacity-50 shadow-sm"
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
}
