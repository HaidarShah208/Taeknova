import { Search } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';

import { cn } from '@lib/cn';

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  onSearch: (value: string) => void;
  onChange?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  autoFocus?: boolean;
  className?: string;
}

const sizeClasses: Record<NonNullable<SearchBarProps['size']>, string> = {
  sm: 'h-9 text-sm',
  md: 'h-11 text-sm',
  lg: 'h-12 text-base',
};

export function SearchBar({
  defaultValue = '',
  placeholder = 'Search products, categories…',
  onSearch,
  onChange,
  size = 'md',
  autoFocus = false,
  className,
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(value.trim());
  };

  const handleChange = (next: string) => {
    setValue(next);
    onChange?.(next);
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn(
        'group relative flex w-full items-center rounded-full border border-input bg-background pl-11 pr-2 transition-all focus-within:border-primary focus-within:ring-0 focus-within:ring-ring/50',
        sizeClasses[size],
        className,
      )}
    >
      <Search
        className="pointer-events-none absolute left-4 h-4 w-4 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label="Search"
        className="w-full pe34 bg-transparent text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus-within:ring-0"
      />
     
    </form>
  );
}
