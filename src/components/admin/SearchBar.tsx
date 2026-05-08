import { Search } from 'lucide-react';
import type { ChangeEvent } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search...' }: SearchBarProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value);

  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-3 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-white/25"
      />
    </label>
  );
}
