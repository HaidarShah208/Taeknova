import { Loader } from '@components/ui/Loader';

/** Shown inside a layout while a lazy route chunk loads — keeps chrome (nav, footer) mounted. */
export function RouteContentFallback() {
  return (
    <div className="flex w-full items-center min-h-screen justify-center py-16" role="status" aria-live="polite">
      <Loader size="xl" />
    </div>
  );
}
