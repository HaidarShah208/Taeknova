import { cn } from '@lib/cn';

type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const toneClasses: Record<StatusTone, string> = {
  success: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
  warning: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
  danger: 'bg-red-500/15 text-red-300 border-red-400/30',
  info: 'bg-blue-500/15 text-blue-300 border-blue-400/30',
  neutral: 'bg-slate-500/15 text-slate-300 border-slate-400/30',
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
