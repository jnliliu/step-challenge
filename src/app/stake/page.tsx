"use client";
import StakeIcon from "@/app/assets/stake.svg";
import { calculateAPYPercentage } from "@/app/helpers/apyHelper";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { getXStepMarket } from "../api/stepApiClient";
import { IMarket } from "../api/types";
import { useAppWallet } from "../components/customWalletContext";
import { useNotifications } from "../components/notificationContext";
import StakeComponent from "./stakeComponent";
import StakeInfo from "./stakeInfoComponent";

export default function Stake() {
    const { showNotification } = useNotifications();
    const [xstep, setXstep] = useState<IMarket>();
    const { network } = useAppWallet();

    const apy = useMemo(
        () =>
            xstep?.apr
                ? calculateAPYPercentage(xstep.apr)
                : "Waiting for first funding...",
        [xstep]
    );

    useEffect(() => {
        getXStepMarket(network, "2021-10-14")
            .then(setXstep)
            .catch(() =>
                showNotification("Couldn't get the xSTEP staking APY", "error")
            );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [network]);

    return (
        <div className="flex flex-col items-stretch gap-5">
            <div className="flex justify-center mt-2 mb-3 text-3xl font-bold text-white box-border">
                <Image
                    src={StakeIcon}
                    width={32}
                    height={32}
                    alt=""
                    className="mr-5 box-border"
                />
                Stake STEP
            </div>

            <div className="text-info text-center">
                <span>Stake STEP to receive xSTEP</span>
            </div>

            <StakeInfo apy={apy} />

            <StakeComponent mode={"stake"} />
        </div>
    );
}
