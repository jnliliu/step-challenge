'use client';
import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useRef,
    useState,
} from 'react';

import './notifications.css';

export type INotificationType = 'success' | 'info' | 'warning' | 'error';

export interface INotification {
    id: number;
    text: string;
    type: INotificationType;
}

export interface INotificationContext {
    notifications: INotification[];
    showNotification: (
        text: string,
        type: INotificationType,
        hideAfterMs?: number
    ) => void;
}

export const NotificationContext = createContext<INotificationContext | null>(
    null
);

export function useNotifications() {
    const notifications = useContext(NotificationContext);

    if (!notifications)
        throw new Error(
            'Make sure you call this within a NotificationProvider.'
        );

    return notifications;
}

export default function NotificationProvider({
    children,
}: {
    children: ReactNode;
}) {
    const idTracker = useRef<number>(0);
    const timeoutRefs = useRef<{ [key: number]: NodeJS.Timeout }>({});

    const [notifications, setNotifications] = useState<INotification[]>([]);

    const showNotification = useCallback(
        (
            text: string,
            type: INotificationType = 'info',
            hideAfterMs?: number
        ) => {
            idTracker.current++;

            const newNotification = {
                id: idTracker.current,
                text,
                type,
            };

            setNotifications((prevNotifications) => [
                newNotification,
                ...prevNotifications,
            ]);

            timeoutRefs.current[newNotification.id] = setTimeout(
                () => deleteNotification(newNotification.id),
                hideAfterMs ?? 5000
            );
        },
        []
    );

    const deleteNotification = useCallback((id: number) => {
        setNotifications((prevNotifications) =>
            prevNotifications.filter((n) => n.id !== id)
        );

        // clear the timeout
        if (timeoutRefs.current[id]) {
            clearTimeout(timeoutRefs.current[id]);
            delete timeoutRefs.current[id];
        }
    }, []);

    const notificationItems = notifications.map((n) => (
        <div
            key={n.id}
            className={`notification ${n.type} px-6 py-4 border-0 rounded mb-4 w-96`}
        >
            <span className="inline-block align-middle mr-8 font-semibold">
                {n.text}
            </span>
            <button
                className="absolute text-2xl font-semibold leading-none right-4"
                onClick={() => deleteNotification(n.id)}
            >
                <span>×</span>
            </button>
        </div>
    ));

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                showNotification,
            }}
        >
            {children}

            {notifications.length ? (
                <div className="fixed bottom-4 left-5">{notificationItems}</div>
            ) : null}
        </NotificationContext.Provider>
    );
}
