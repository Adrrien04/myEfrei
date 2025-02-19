import Link from 'next/link';

interface SubNavbarProps {
    status: 'admin' | 'teacher' | 'student';
}

export default function SubNavbar({ status }: SubNavbarProps) {
    return (
        <div className="bg-gray-200 p-4">
            <div className="container mx-auto flex justify-between items-center">
                {status === 'admin' && (
                    <>
                        <Link href="/admin/dashboard">
                            <a className="text-black">Admin Dashboard</a>
                        </Link>
                        <Link href="/admin/settings">
                            <a className="text-black">Settings</a>
                        </Link>
                    </>
                )}
                {status === 'teacher' && (
                    <>
                        <Link href="/teacher/courses">
                            <a className="text-black">My Courses</a>
                        </Link>
                        <Link href="/teacher/students">
                            <a className="text-black">My Students</a>
                        </Link>
                    </>
                )}
                {status === 'student' && (
                    <>
                        <Link href="/student/courses">
                            <a className="text-black">My Courses</a>
                        </Link>
                        <Link href="/student/grades">
                            <a className="text-black">My Grades</a>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}