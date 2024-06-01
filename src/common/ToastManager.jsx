import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { Toast } from 'primereact/toast';

const ToastManager = forwardRef((props, ref) => {
  const toast = useRef(null);

  useImperativeHandle(ref, () => ({
    show: (message) => {
      toast.current.show(message);
    }
  }));

  return <Toast ref={toast} />;
});

export default ToastManager;
