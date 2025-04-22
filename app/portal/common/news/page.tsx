'use client';

import { useEffect, useState } from 'react';
import useModal from '@/app/ui/hooks/useModal';
import { Article, getNews } from '@/app/ui/Components/News/getNews';

const NewsPage = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const { isOpen, openModal, closeModal, selectedItem } = useModal();

    useEffect(() => {
        getNews()
            .then(setArticles)
            .catch((error) => console.error(error));
    }, []);

    const formatContent = (content: string) => {
        return content.split("\n").map((line, index) => <p key={index}>{line}</p>);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Articles</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {articles.map((article) => (
                    <div
                        key={article.id}
                        className="block p-4 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => openModal(article)}
                    >
                        <h2 className="text-xl font-bold mb-2">{article.title}</h2>
                        {article.image_url && (
                            <img src={article.image_url} alt={article.title} className="mb-4 w-full h-48 object-cover rounded-lg" />
                        )}
                        <p>{article.content.length > 150 ? article.content.substring(0, 150) + '...' : article.content}</p>
                    </div>
                ))}
            </div>

            {isOpen && selectedItem && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto relative">
                        <button
                            className="absolute top-2 right-2 text-black text-3xl font-bold hover:text-gray-600"
                            onClick={closeModal}
                            style={{ zIndex: 1000 }}
                        >
                            ×
                        </button>
                        <h2 className="text-2xl font-bold mb-2">{selectedItem.title}</h2>
                        {selectedItem.image_url && (
                            <img
                                src={selectedItem.image_url}
                                alt={selectedItem.title}
                                className="mb-4 w-full h-64 object-cover rounded-lg"
                            />
                        )}
                        <div className="text-lg space-y-4">
                            {formatContent(selectedItem.content)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsPage;
