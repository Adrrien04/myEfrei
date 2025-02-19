import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import Image from "next/image";

export default function AcmeLogo() {
    return (
        <div className="flex items-center gap-4">
            <Image src="/logomyEfrei.png" alt={'logo'} width={200} height={200}/>
        </div>
    );
}