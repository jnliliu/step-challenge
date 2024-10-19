import xStepIcon from "@/app/assets/xstep.svg";
import Image from "next/image";

export default function StakeInfo({ apy }: { apy: string }) {
    const infoText = `xSTEP is a yield bearing asset. This means it is automatically worth more STEP over time. You don't need to claim any rewards, or do anything other than hold your xSTEP to benefit from this. Later, when you unstake your xSTEP you will receive more STEP than you initially deposited.`;

    return (
        <div className="flex flex-col justify-between m-auto mt-8 rounded-lg max-w-md p-8 font-bold text-sm text-white bg-box">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <Image
                        src={xStepIcon}
                        width={28}
                        height={28}
                        alt="Token icon"
                    />
                    <span className="font-bold ml-2">xSTEP staking APY</span>
                </div>
                <span className="font-bold">{apy}</span>
            </div>
            <div className="mt-8">
                <h1 className="mb-3 font-bold">
                    “Where is my staking reward?”
                </h1>
                <span className="text-info">{infoText}</span>
            </div>
        </div>
    );
}
