import type { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';

import { Textarea } from '@components/ui/Textarea';

interface FormTextareaProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  rows?: number;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export function FormTextarea<T extends FieldValues>({
  name,
  label,
  placeholder,
  description,
  rows = 5,
  register,
  errors,
}: FormTextareaProps<T>) {
  const fieldError = errors[name];
  const errorMessage =
    typeof fieldError?.message === 'string' ? fieldError.message : undefined;

  return (
    <Textarea
      label={label}
      {...(placeholder !== undefined ? { placeholder } : {})}
      {...(description !== undefined ? { description } : {})}
      {...(errorMessage !== undefined ? { error: errorMessage } : {})}
      rows={rows}
      {...register(name)}
    />
  );
}
