"use client";
import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useRef,
    useState,
} from "react";

import "@/app/styles/notifications.css";

export type INotificationType = "success" | "info" | "warning" | "error";

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
            "Make sure you call this within a NotificationProvider."
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
            type: INotificationType = "info",
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            className={`notification ${n.type} flex justify-between pl-4 py-4 border-0 rounded mb-4 max-w-full`}
        >
            <span className="inline-block align-middle font-semibold flex-1 break-all">
                {n.text}
            </span>
            <button
                className="text-2xl font-semibold leading-none mx-3"
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
                <div className="fixed bottom-0 w-full md:w-96 p-4">
                    {notificationItems}
                </div>
            ) : null}
        </NotificationContext.Provider>
    );
}
