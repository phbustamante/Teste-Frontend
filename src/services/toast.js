let toastRef = null;

export const setToastRef = (ref) => {
  toastRef = ref;
};

const defaultToastOptions = {
  position: 'top-right',
  life: 3000,
  className: 'custom-toast'
};

export const toast = {
  show: (options) => {
    if (toastRef) {
      toastRef.show({
        ...defaultToastOptions,
        ...options
      });
    }
  },
  success: (detail) => {
    if (toastRef) {
      toastRef.show({
        ...defaultToastOptions,
        severity: 'success',
        summary: 'Sucesso',
        detail
      });
    }
  },
  error: (detail) => {
    if (toastRef) {
      toastRef.show({
        ...defaultToastOptions,
        severity: 'error',
        summary: 'Erro',
        detail
      });
    }
  }
};