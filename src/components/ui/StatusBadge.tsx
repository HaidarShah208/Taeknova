import { cn } from '@lib/cn';

type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const toneClasses: Record<StatusTone, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
};

interface StatusBadgeProps {
  label: string;
  tone?: StatusTone;
  className?: string;
}

export function StatusBadge({ label, tone = 'neutral', className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold',
        toneClasses[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
