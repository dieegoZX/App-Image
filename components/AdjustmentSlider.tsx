import React from 'react';

interface AdjustmentSliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}

const AdjustmentSlider: React.FC<AdjustmentSliderProps> = ({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
}) => {
  return (
    <div>
      <label htmlFor={label} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className="flex items-center space-x-4 mt-2">
        <input
          id={label}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm text-gray-400 w-10 text-center">{value}</span>
      </div>
    </div>
  );
};

export default AdjustmentSlider;
