import { Pagination as BasePagination } from '@components/ui/Pagination';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  return <BasePagination page={page} totalPages={totalPages} onChange={onChange} />;
}
