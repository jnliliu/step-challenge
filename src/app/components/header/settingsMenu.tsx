import useClickOutsideHandler from "@/app/hooks/clickOutside";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useMemo } from "react";
import { useAppWallet } from "../customWalletContext";

export interface ISettingsMenuProps {
    isVisible: boolean;
    hideMenu: () => void;
}

export default function SettingsMenu({
    isVisible,
    hideMenu,
}: Readonly<ISettingsMenuProps>) {
    // handle click outside menu
    const { elementRef } = useClickOutsideHandler<HTMLDivElement>(hideMenu);
    const { network, setNetwork } = useAppWallet();

    // imutable options
    const networkOptions = useMemo(
        () =>
            Object.values(WalletAdapterNetwork).map((n) => (
                <option key={n} value={n}>
                    {n}
                </option>
            )),
        []
    );

    // network select based on current network
    const networkSelect = useMemo(
        () => (
            <select
                className="flex-1 bg-black rounded text-info p-1"
                value={network}
                onChange={(event) =>
                    setNetwork(event.target.value as WalletAdapterNetwork)
                }
            >
                {networkOptions}
            </select>
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return isVisible ? (
        <div
            ref={elementRef}
            className="absolute flex flex-col gap-4 p-5 min-w-32 mt-12 right-36 rounded-md"
            style={{
                backgroundColor: "rgb(20, 20, 20)",
            }}
        >
            <div className="flex flex-col">
                <span className="text-info">Network:</span>
                {networkSelect}
            </div>
            <div className="self-end">
                <span className="text-info">Ammount: .000001</span>
            </div>
        </div>
    ) : null;
}
