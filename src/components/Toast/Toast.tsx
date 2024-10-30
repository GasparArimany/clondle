import { useCallback, useEffect, useState } from 'react';
import CloseIcon from '../Icons/Close';

interface ToastProps {
  isOpen: boolean;
  message: string;
  showDuration?: number;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const TOAST_SHOW_DURATION_MS = 3000;

export function Toast({
  isOpen,
  message,
  showDuration = TOAST_SHOW_DURATION_MS,
  onDismiss = () => {},
  dismissible = true,
}: ToastProps) {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setOpen(false);
      onDismiss();
    }, showDuration);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [onDismiss, showDuration]);

  const handleClose = useCallback(() => {
    setOpen(false);
    onDismiss();
  }, [onDismiss]);

  if (!open) return null;

  return (
    <div id='toast' className='toast'>
      <span id='toastMessage'>{message}</span>
      {dismissible && (
        <button onClick={handleClose}>
          <CloseIcon />
        </button>
      )}
    </div>
  );
}
