import { cn } from '@lib/cn';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

const sizeMap: Record<NonNullable<LoaderProps['size']>, number> = {
  sm: 24,
  md: 36,
  lg: 48,
  xl: 72,
};

export function Loader({ size = 'md', className, label = 'Loading' }: LoaderProps) {
  const px = sizeMap[size];
  const stroke = px * 0.06;
  const r = px / 2 - stroke * 2;
  const cx = px / 2;
  const cy = px / 2;

  return (
    <>
      <style>{`
        @keyframes tk-orbit {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes tk-orbit-reverse {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes tk-pulse-kick {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.82); }
        }
        @keyframes tk-stripe-slide {
          0%   { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -40; }
        }
        .tk-orbit       { animation: tk-orbit 1.1s linear infinite; transform-origin: center; }
        .tk-orbit-rev   { animation: tk-orbit-reverse 1.6s linear infinite; transform-origin: center; }
        .tk-center      { animation: tk-pulse-kick 1.1s ease-in-out infinite; transform-origin: center; }
        .tk-stripe      { animation: tk-stripe-slide 0.5s linear infinite; }
      `}</style>

      <span
        role="status"
        aria-label={label}
        className={cn('inline-flex items-center justify-center', className)}
        style={{ width: px, height: px }}
      >
        <svg
          width={px}
          height={px}
          viewBox={`0 0 ${px} ${px}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* ── Outer orbit ring (belt-stripe dashes) ── */}
          <g className="tk-orbit">
            <circle
              cx={cx}
              cy={cy}
              r={r}
              stroke="currentColor"
              strokeWidth={stroke}
              strokeOpacity="0.15"
              strokeDasharray={`${r * 0.35} ${r * 0.12}`}
              strokeLinecap="round"
            />
            <circle
              cx={cx}
              cy={cy}
              r={r}
              stroke="currentColor"
              strokeWidth={stroke * 1.6}
              strokeOpacity="1"
              strokeDasharray={`${r * 0.55} ${r * 3}`}
              strokeLinecap="round"
              className="tk-stripe"
            />
          </g>

          {/* ── Inner orbit ring (counter-rotating) ── */}
          <g className="tk-orbit-rev">
            <circle
              cx={cx}
              cy={cy}
              r={r * 0.62}
              stroke="currentColor"
              strokeWidth={stroke * 0.8}
              strokeOpacity="0.25"
              strokeDasharray={`${r * 0.2} ${r * 0.18}`}
              strokeLinecap="round"
            />
            {/* Sparring sparks — two bright dashes 180° apart */}
            <circle
              cx={cx}
              cy={cy}
              r={r * 0.62}
              stroke="currentColor"
              strokeWidth={stroke * 1.8}
              strokeOpacity="0.9"
              strokeDasharray={`${r * 0.22} ${r * 4}`}
              strokeLinecap="round"
            />
            <circle
              cx={cx}
              cy={cy}
              r={r * 0.62}
              stroke="currentColor"
              strokeWidth={stroke * 1.8}
              strokeOpacity="0.45"
              strokeDasharray={`${r * 0.12} ${r * 4}`}
              strokeDashoffset={`-${r * 1.95}`}
              strokeLinecap="round"
            />
          </g>

          {/* ── Center — taekwondo taegeuk-inspired yin-yang split ── */}
          <g className="tk-center">
            {/* Background circle */}
            <circle cx={cx} cy={cy} r={r * 0.3} fill="currentColor" fillOpacity="0.12" />

            {/* Top half (solid) */}
            <path
              d={`
                M ${cx} ${cy}
                m 0 ${-r * 0.3}
                a ${r * 0.3} ${r * 0.3} 0 0 1 0 ${r * 0.6}
                a ${r * 0.15} ${r * 0.15} 0 0 0 0 ${-r * 0.3}
                a ${r * 0.15} ${r * 0.15} 0 0 1 0 ${-r * 0.3}
              `}
              fill="currentColor"
              fillOpacity="0.9"
            />

            {/* Bottom half (hollow ring) */}
            <path
              d={`
                M ${cx} ${cy}
                m 0 ${r * 0.3}
                a ${r * 0.3} ${r * 0.3} 0 0 1 0 ${-r * 0.6}
                a ${r * 0.15} ${r * 0.15} 0 0 0 0 ${r * 0.3}
                a ${r * 0.15} ${r * 0.15} 0 0 1 0 ${r * 0.3}
              `}
              fill="currentColor"
              fillOpacity="0.3"
            />
          </g>
        </svg>

        <span className="sr-only">{label}</span>
      </span>
    </>
  );
}