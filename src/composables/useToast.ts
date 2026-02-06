import { ref } from 'vue';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

const toasts = ref<Toast[]>([]);

export function useToast() {
    function addToast(message: string, type: ToastType = 'info', duration: number = 3000) {
        const id = crypto.randomUUID();
        const toast: Toast = { id, message, type, duration };
        toasts.value.push(toast);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
        return id;
    }

    function removeToast(id: string) {
        toasts.value = toasts.value.filter(t => t.id !== id);
    }

    return {
        toasts,
        addToast,
        removeToast
    };
}
