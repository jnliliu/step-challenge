import StepLogo from '@/app/assets/step.svg';
import Image from 'next/image';
import './styles/button.css';

export default function Header() {
    return (
        <div className="w-full fixed flex p-5 justify-between">
            <Image src={StepLogo} alt="Step logo" width={111} priority />
            <div className="self-center">
                <button className="btn btn-default rounded-lg btn-rounded">
                    <span>Connect</span>
                </button>
            </div>
        </div>
    );
}
