import Link from 'next/link';
import EfreiLogo from "@/app/ui/efrei-logo";

export default function Navbar() {
    return (
        <nav className="bg-blue-500 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" legacyBehavior>
                    <div className="w-32 text-white md:w-40">
                        <EfreiLogo/>
                    </div>
                </Link>
                <div className="flex space-x-4">
                    <Link href="/dashboard" legacyBehavior>
                        <a className="text-white">Dashboard</a>
                    </Link>
                </div>
            </div>
        </nav>
    );
}