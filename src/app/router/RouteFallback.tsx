import { Loader } from '@components/ui/Loader';

export function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center" role="status" aria-live="polite">
      <Loader size="lg" />
    </div>
  );
}
