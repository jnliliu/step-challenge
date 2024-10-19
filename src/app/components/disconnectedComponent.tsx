import DisconnectedLogo from "@/app/assets/step-disconnected-logo.svg";
import Image from "next/image";

export default function DisconnectedSection() {
    return (
        <div className="flex flex-col gap-10 items-center">
            <Image src={DisconnectedLogo} width={160} alt="Step graphic" />

            <div className="text-center">
                <span className="font-normal text-xl">
                    Connect your wallet or watch an address to begin
                </span>
            </div>
        </div>
    );
}
