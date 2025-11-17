import React from 'react';

interface SliderProps {
  value: number | number[];
  onChange?: (value: number | number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  marks?: boolean;
  valueLabelDisplay?: 'auto' | 'on' | 'off';
}

const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className = '',
  marks: _marks = false,
  valueLabelDisplay = 'off'
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      const newValue = parseFloat(e.target.value);
      onChange(newValue);
    }
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (Array.isArray(value) && onChange) {
      const newValue = [...value];
      newValue[index] = parseFloat(e.target.value);
      onChange(newValue);
    }
  };

  const getPercentage = (val: number) => {
    return ((val - min) / (max - min)) * 100;
  };

  if (Array.isArray(value)) {
    // Range slider
    return (
      <div className={`relative ${className}`}>
        <div className="relative h-2 bg-gray-200 rounded-full">
          <div
            className="absolute h-2 bg-primary-600 rounded-full"
            style={{
              left: `${getPercentage(value[0])}%`,
              width: `${getPercentage(value[1]) - getPercentage(value[0])}%`
            }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={(e) => handleRangeChange(e, 0)}
          disabled={disabled}
          className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={(e) => handleRangeChange(e, 1)}
          disabled={disabled}
          className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer"
        />
        {valueLabelDisplay === 'auto' && (
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>{value[0]}</span>
            <span>{value[1]}</span>
          </div>
        )}
      </div>
    );
  }

  // Single value slider
  return (
    <div className={`relative ${className}`}>
      <div className="relative h-2 bg-gray-200 rounded-full">
        <div
          className="absolute h-2 bg-primary-600 rounded-full"
          style={{ width: `${getPercentage(value)}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer"
      />
      {valueLabelDisplay === 'auto' && (
        <div className="text-center mt-2 text-sm text-gray-600">
          {value}
        </div>
      )}
    </div>
  );
};

export default Slider;
