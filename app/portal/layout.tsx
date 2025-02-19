import Navbar from '@/app/ui/Components/Navbar';
import SubNavbar from '@/app/ui/Components/SubNavbar';

export default function Layout({ children, status }: { children: React.ReactNode, status: 'admin' | 'teacher' | 'student' }) {
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <SubNavbar status={status} />
            <div className="flex flex-grow md:flex-row md:overflow-hidden">
                <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
                    {children}
                </div>
            </div>
        </div>
    );
}