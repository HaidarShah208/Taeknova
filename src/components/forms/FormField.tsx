import type { Path, FieldValues, UseFormRegister, FieldErrors } from 'react-hook-form';

import { Input, type inputVariants } from '@components/ui/Input';
import type { VariantProps } from 'class-variance-authority';

type InputVariantProps = VariantProps<typeof inputVariants>;

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  type?: string;
  placeholder?: string;
  description?: string;
  autoComplete?: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  size?: InputVariantProps['size'];
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function FormField<T extends FieldValues>({
  name,
  label,
  type = 'text',
  placeholder,
  description,
  autoComplete,
  register,
  errors,
  size,
  leftIcon,
  rightIcon,
}: FormFieldProps<T>) {
  const fieldError = errors[name];
  const errorMessage =
    typeof fieldError?.message === 'string' ? fieldError.message : undefined;

  return (
    <Input
      type={type}
      label={label}
      {...(placeholder !== undefined ? { placeholder } : {})}
      {...(description !== undefined ? { description } : {})}
      {...(autoComplete !== undefined ? { autoComplete } : {})}
      {...(errorMessage !== undefined ? { error: errorMessage } : {})}
      {...(size !== undefined ? { size } : {})}
      {...(leftIcon !== undefined ? { leftIcon } : {})}
      {...(rightIcon !== undefined ? { rightIcon } : {})}
      {...register(name)}
    />
  );
}
