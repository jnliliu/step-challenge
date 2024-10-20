import CopyIcon from "@/app/assets/copy.svg";
import DisconnectIcon from "@/app/assets/disconnect.svg";
import LinkIcon from "@/app/assets/link.svg";
import useClickOutsideHandler from "@/app/hooks/clickOutside";
import Image from "next/image";
import { useNotifications } from "../notificationContext";

export interface IConnectedMenuProps {
    isVisible: boolean;
    hideMenu: () => void;
    address?: string;
    addressTrimmed?: string;
    balance: number;
    disconnect: () => Promise<void>;
}

export default function ConnectedMenu({
    isVisible,
    hideMenu,
    address,
    addressTrimmed,
    balance,
    disconnect,
}: Readonly<IConnectedMenuProps>) {
    const { showNotification } = useNotifications();

    // handle click outside menu
    const { elementRef } = useClickOutsideHandler<HTMLDivElement>(hideMenu);

    // copies the current address to the clipboard
    const copyAddress = () => {
        if (!address) return;

        navigator.clipboard.writeText(address);
        showNotification(`Address copied to clipboard: ${address}`, "info");
    };

    return isVisible ? (
        <div
            ref={elementRef}
            className="absolute flex flex-col gap-4 mt-3 p-5 min-w-32 right-5 rounded-md"
            style={{
                backgroundColor: "rgb(20, 20, 20)",
            }}
        >
            <div className="flex gap-8">
                <span className="mr-8">{addressTrimmed}</span>
                <a
                    className="ml-6 content-center"
                    href={`https://solscan.io/address/${address}`}
                    target="_blank"
                    title="Solscan"
                >
                    <Image alt="external link" src={LinkIcon} />
                </a>

                <button onClick={copyAddress}>
                    <Image alt="copy" src={CopyIcon} />
                </button>

                <button onClick={disconnect}>
                    <Image alt="disconnect" src={DisconnectIcon} />
                </button>
            </div>
            <div className="self-end">
                <span>Balance: {balance} SOL</span>
            </div>
        </div>
    ) : null;
}
