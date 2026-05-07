import { useCallback, useState } from 'react';

export interface UseDisclosureReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  set: (next: boolean) => void;
}

export function useDisclosure(initial = false): UseDisclosureReturn {
  const [isOpen, setOpen] = useState(initial);

  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((value) => !value), []);
  const set = useCallback((next: boolean) => setOpen(next), []);

  return { isOpen, open, close, toggle, set };
}
