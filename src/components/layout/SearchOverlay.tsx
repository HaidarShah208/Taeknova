import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@redux';
import { Drawer } from '@components/ui/Drawer';
import { SearchBar } from '@components/shared/SearchBar';
import { ROUTES } from '@constants/routes';
import { selectSearchOpen, setSearchOpen } from '@redux/ui';


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
    <Drawer isOpen={isOpen} onClose={close} side="top" size="md" title="Search Tiknova">
      <div className="flex flex-col gap-6">
        <SearchBar
          autoFocus
          size="lg"
          onSearch={handleSearch}
          placeholder="Search for soccer, basketball, training kits…"
        />
    
      </div>
    </Drawer>
  );
}
