import type { ChangeEvent } from 'react';

interface FilterOption {
  label: string;
  value: string;
}

interface FiltersProps {
  label?: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

export function Filters({ label = 'Filter', value, options, onChange }: FiltersProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => onChange(event.target.value);

  return (
    <label className="inline-flex items-center gap-2 text-sm text-slate-700">
      <span className="text-slate-600">{label}</span>
      <select
        value={value}
        onChange={handleChange}
        className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition-colors focus:border-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-white text-slate-800">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
