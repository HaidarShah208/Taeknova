import { Button } from '@components/ui/Button';
import { Modal } from '@components/ui/Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  /** Shows spinner on confirm and blocks dismissing the modal while true. */
  isConfirmLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  onConfirm,
  onClose,
  isConfirmLoading = false,
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      closeOnOverlay={!isConfirmLoading}
      closeOnEscape={!isConfirmLoading}
      disableCloseButton={isConfirmLoading}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isConfirmLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} isLoading={isConfirmLoading} disabled={isConfirmLoading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground">This action can affect live admin data views.</p>
    </Modal>
  );
}
