/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import CopyIcon from "@/app/assets/copy.svg";
import DisconnectIcon from "@/app/assets/disconnect.svg";
import LinkIcon from "@/app/assets/link.svg";
import StepLogo from "@/app/assets/step.svg";
import useWalletHelper from "@/app/hooks/walletHelper";
import "@/app/styles/button.css";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNotifications } from "./notificationContext";

interface IConnectedMenuProps {
    isVisible: boolean;
    hideMenu: () => void;
    address?: string;
    addressTrimmed?: string;
    balance: number;
    disconnect: () => Promise<void>;
}

function ConnectedMenu({
    isVisible,
    hideMenu,
    address,
    addressTrimmed,
    balance,
    disconnect,
}: Readonly<IConnectedMenuProps>) {
    const componentRef = useRef<HTMLDivElement>(null);

    const { showNotification } = useNotifications();

    const copyAddress = () => {
        if (!address) return;

        navigator.clipboard.writeText(address);
        showNotification(`Address copied to clipboard: ${address}`, "info");
    };

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (!componentRef.current?.contains(event.target as Node)) {
                hideMenu();
            }
        };

        window.addEventListener("mousedown", handleOutsideClick);

        return () => {
            window.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [componentRef]);

    return isVisible ? (
        <div
            ref={componentRef}
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

export default function Header() {
    const walletModal = useWalletModal();
    const showModal = useCallback(() => walletModal.setVisible(true), []);

    const { connected, address, addressTrimmed, balance, disconnect } =
        useWalletHelper();

    const [isMenuVisible, setMenuVisible] = useState(false);

    const connectedSection = useMemo(
        () => (
            <>
                <button
                    className="btn btn-default connected rounded-lg btn-rounded btn-connected"
                    onClick={() => setMenuVisible(!isMenuVisible)}
                >
                    <span>{addressTrimmed}</span>
                </button>
                {isMenuVisible ? (
                    <ConnectedMenu
                        isVisible={isMenuVisible}
                        hideMenu={() => setMenuVisible(false)}
                        address={address}
                        addressTrimmed={addressTrimmed}
                        balance={balance}
                        disconnect={disconnect}
                    />
                ) : null}
            </>
        ),
        [balance, address, isMenuVisible]
    );

    return (
        <div className="w-full fixed flex p-5 justify-between">
            <Image src={StepLogo} alt="Step logo" width={111} priority />
            <div className="self-center">
                {connected ? (
                    connectedSection
                ) : (
                    <button
                        className="btn btn-default rounded-lg btn-rounded btn-connect"
                        onClick={showModal}
                    >
                        <span>Connect</span>
                    </button>
                )}
            </div>
        </div>
    );
}
