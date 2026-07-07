import { toast } from 'sonner';

export function getApiErrorMessage(error, fallback = 'Terjadi kesalahan') {
  const data = error?.response?.data;

  if (!data) {
    return error?.message || fallback;
  }

  if (typeof data === 'string') {
    return data;
  }

  return data.error || data.message || fallback;
}

export function getApiSuccessMessage(response, fallback = 'Berhasil') {
  const message = response?.data?.message;

  if (typeof message === 'string' && message.trim()) {
    return message;
  }

  return fallback;
}

export function showApiError(error, fallback) {
  toast.error(getApiErrorMessage(error, fallback));
}

export function showApiSuccess(response, fallback) {
  toast.success(getApiSuccessMessage(response, fallback));
}

export function getDefaultSuccessMessage(method) {
  switch (method) {
    case 'post':
      return 'Data berhasil ditambahkan';
    case 'put':
    case 'patch':
      return 'Data berhasil diperbarui';
    case 'delete':
      return 'Data berhasil dihapus';
    default:
      return 'Berhasil';
  }
}
