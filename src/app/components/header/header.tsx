"use client";

import StepLogo from "@/app/assets/step.svg";
import { useAppWallet } from "@/app/components/customWalletContext";
import "@/app/styles/button.css";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import SettingsIcon from "../svg/settingsIcon";
import ConnectedMenu from "./connectedMenu";
import SettingsMenu from "./settingsMenu";

export default function Header() {
    const walletModal = useWalletModal();

    // shows the wallet connection modal
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const showModal = useCallback(() => walletModal.setVisible(true), []);

    const { connected, address, addressTrimmed, balance, disconnect } =
        useAppWallet();

    const [isMenuVisible, setMenuVisible] = useState(false);
    const [isSettingsMenuVisible, setSettingsMenuVisible] = useState(false);

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
                        disconnect={disconnect}
                    />
                ) : null}
            </>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [balance, address, isMenuVisible]
    );

    const settingsSection = useMemo(
        () => (
            <>
                <button
                    className="flex h-8 w-8 bg-box p-0 rounded-lg self-center text-white justify-center items-center"
                    onClick={() =>
                        setSettingsMenuVisible(!isSettingsMenuVisible)
                    }
                >
                    <SettingsIcon />
                </button>
                {isSettingsMenuVisible ? (
                    <SettingsMenu
                        isVisible={isSettingsMenuVisible}
                        hideMenu={() => setSettingsMenuVisible(false)}
                    />
                ) : null}
            </>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [balance, address, isSettingsMenuVisible]
    );

    useEffect(() => {
        setMenuVisible(false);
        setSettingsMenuVisible(false);
    }, [connected]);

    return (
        <div className="w-full fixed flex p-5 justify-between bg-black">
            <Image src={StepLogo} alt="Step logo" width={111} priority />
            <div className="flex gap-2">
                {settingsSection}
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
        </div>
    );
}
