import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@redux';
import { Drawer } from '@components/ui/Drawer';
import { SearchBar } from '@components/shared/SearchBar';
import { ROUTES } from '@constants/routes';
import { selectSearchOpen, setSearchOpen } from '@redux/ui';

const SUGGESTIONS = ['Soccer kits', 'Basketball jersey', 'Custom team uniforms', 'Training shorts'];

export function SearchOverlay() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isOpen = useAppSelector(selectSearchOpen);

  const close = () => dispatch(setSearchOpen(false));

  const handleSearch = (value: string) => {
    if (!value) return;
    navigate(`${ROUTES.products}?search=${encodeURIComponent(value)}`);
    close();
  };

  return (
    <Drawer isOpen={isOpen} onClose={close} side="top" size="md" title="Search Tikwando">
      <div className="flex flex-col gap-6">
        <SearchBar
          autoFocus
          size="lg"
          onSearch={handleSearch}
          placeholder="Search for soccer, basketball, training kits…"
        />
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Popular searches
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSearch(suggestion)}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
