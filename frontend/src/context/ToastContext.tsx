import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface ToastOptions {
    message: string;
    severity?: AlertColor;
    duration?: number;
}

interface ToastContextType {
    showToast: (message: string, severity?: AlertColor, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

// Custom event for triggering toasts from outside React tree (e.g., Axios interceptors)
export const showToast = (message: string, severity: AlertColor = 'info', duration: number = 3000) => {
    const event = new CustomEvent('toast-message', {
        detail: { message, severity, duration },
    });
    window.dispatchEvent(event);
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<AlertColor>('info');
    const [duration, setDuration] = useState(3000);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const triggerToast = useCallback((msg: string, sev: AlertColor = 'info', dur: number = 3000) => {
        setMessage(msg);
        setSeverity(sev);
        setDuration(dur);
        setOpen(true);
    }, []);

    useEffect(() => {
        const handleToastEvent = (event: Event) => {
            const customEvent = event as CustomEvent<ToastOptions>;
            const { message, severity, duration } = customEvent.detail;
            triggerToast(message, severity || 'info', duration || 3000);
        };

        window.addEventListener('toast-message', handleToastEvent);

        return () => {
            window.removeEventListener('toast-message', handleToastEvent);
        };
    }, [triggerToast]);

    return (
        <ToastContext.Provider value={{ showToast: triggerToast }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={duration}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
};
