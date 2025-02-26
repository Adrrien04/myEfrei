'use client';
import ArticleForm from '@/app/ui/Components/AdminPages/ArticleForm';

const AdminNewsWritePage = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Write News</h1>
            <ArticleForm />
        </div>
    );
};

export default AdminNewsWritePage;