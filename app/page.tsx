import EfreiLogo from '@/app/ui/efrei-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

export default function Page() {
    return (
        <main className="flex min-h-screen">
            <div className="relative w-2/3 min-h-screen">
                <Image
                    src="/myefrei-background.3030cf25.jpg"
                    alt={'logo'}
                    layout="fill"
                    objectFit="cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <EfreiLogo width={650}/>
                </div>
            </div>

            <div className="relative w-1/3 flex items-center justify-center p-10 bg-gray-50 overflow-hidden">
                <div className="flex flex-col justify-center gap-6 rounded-lg px-6 py-10 md:w-3/4 md:px-20">
                    <p className="text-xl text-gray-800 md:text-3xl md:leading-normal">
                        <strong>BIENVENUE</strong> SUR LA PLATEFORME WEB DE L'EFREI
                        <br />
                        Retrouvez l'ensemble de vos <strong>services sur myEfrei</strong>.
                    </p>
                    <Link
                        href="/login"
                        className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
                    >
                        <span>SE CONNECTER</span> <ArrowRightIcon className="w-5 md:w-6"/>
                    </Link>
                </div>
                <Image
                    src="/logo-pantheon.svg"
                    alt="Pantheon logo"
                    width={900}
                    height={900}
                    className="absolute right-[-450px] top-[800px] transform -translate-y-1/2 opacity-5 max-w-none max-h-none pointer-events-none"

                />
            </div>
        </main>
    );
}
