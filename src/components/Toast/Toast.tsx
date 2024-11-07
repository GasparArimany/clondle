import {
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useReducer,
} from 'react';
import CloseIcon from '../Icons/Close';
import classNames from 'classnames';
import { createPortal } from 'react-dom';
import { MAIN_CONTENT_ID } from '../../App';

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
  default: 'bg-slate-50',
};

const SHOW_TOAST_ACTION = 'SHOW_TOAST';
const HIDE_TOAST_ACTION = 'HIDE_TOAST';

// eslint-disable-next-line
// @ts-ignore
function reducer(state, action) {
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
}

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
    onDismiss();
  }, [onDismiss]);

  useEffect(() => {
    if (isOpen) {
      const timeoutId = setTimeout(() => {
        dispatch({ type: HIDE_TOAST_ACTION });
        handleClose();
      }, showDuration);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isOpen, handleClose, showDuration]);

  if (!isOpen) return null;

  return createPortal(
    <div id='toast' className={classNames('toast', variantStyles[variant])}>
      <span id='toastMessage' className=''>
        {message}
      </span>
      {dismissible && (
        <button onClick={handleClose}>
          <CloseIcon />
        </button>
      )}
    </div>,
    document.getElementById(MAIN_CONTENT_ID)!
  );
});
