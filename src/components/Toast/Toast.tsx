import {
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useReducer,
  Reducer,
} from 'react';
import CloseIcon from '../Icons/Close';
import classNames from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  showDuration?: number;
  dismissible?: boolean;
  onDismiss?: () => void;
  variant?: Variant;
}

const TOAST_SHOW_DURATION_MS = 3000;

type Variant = 'error' | 'success' | 'warning' | 'info' | 'default';

const variantStyles: Record<Variant, string> = {
  error: '',
  info: '',
  success: 'bg-green-600',
  warning: '',
  default: 'bg-slate-50 text-slate-900',
};

const SHOW_TOAST_ACTION = 'SHOW_TOAST';
const HIDE_TOAST_ACTION = 'HIDE_TOAST';

type ToastActions =
  | { type: typeof SHOW_TOAST_ACTION; payload: string }
  | { type: typeof HIDE_TOAST_ACTION };

type ToastState = { isOpen: boolean; message: string };

export type ToastRef = { show: (text: string) => void };

const reducer: Reducer<ToastState, ToastActions> = (state, action) => {
  switch (action.type) {
    case SHOW_TOAST_ACTION:
      return {
        isOpen: true,
        message: action.payload,
      };
    case HIDE_TOAST_ACTION:
      return {
        isOpen: false,
        message: '',
      };
    default:
      return state;
  }
};

export const Toast = forwardRef(function (
  {
    showDuration = TOAST_SHOW_DURATION_MS,
    onDismiss = () => {},
    dismissible = true,
    variant = 'default',
  }: ToastProps,
  ref
) {
  const [{ isOpen, message }, dispatch] = useReducer(reducer, {
    isOpen: false,
    message: '',
  });

  const show = useCallback((message: string) => {
    dispatch({ type: SHOW_TOAST_ACTION, payload: message });
  }, []);

  useImperativeHandle(ref, () => ({ show }));

  const handleClose = useCallback(() => {
    dispatch({ type: HIDE_TOAST_ACTION });
    onDismiss();
  }, [onDismiss]);

  useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => {
        handleClose();
      }, showDuration);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isOpen, handleClose, showDuration]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id='toast'
          className={classNames('toast', variantStyles[variant])}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key='toast'
        >
          <span id='toastMessage' className=''>
            {message}
          </span>
          {dismissible && (
            <button className='absolute top-1 right-1' onClick={handleClose}>
              <CloseIcon />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
});
