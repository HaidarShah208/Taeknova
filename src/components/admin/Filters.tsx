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
    <label className="inline-flex items-center gap-2 text-sm text-slate-300">
      <span className="text-slate-400">{label}</span>
      <select
        value={value}
        onChange={handleChange}
        className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-slate-100 outline-none focus:border-white/25"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-[#12151c] text-slate-100">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
