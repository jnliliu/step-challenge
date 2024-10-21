import DisconnectedLogo from "@/app/assets/step-disconnected-logo.svg";
import Image from "next/image";

export default function DisconnectedSection() {
    return (
        <div className="fixed top-0 left-0 h-screen w-screen flex flex-col gap-10 items-center justify-center">
            <Image src={DisconnectedLogo} width={160} alt="Step graphic" />

            <div className="text-center px-10">
                <span className="font-normal text-xl">
                    Connect your wallet or watch an address to begin
                </span>
            </div>
        </div>
    );
}
