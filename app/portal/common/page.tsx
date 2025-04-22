'use client';

import { useEffect, useState } from 'react';
import { getNews, Article } from '@/app/ui/Components/News/getNews';
import SlidesCarousel from "@/app/ui/Components/Slides/SlidesCarousel";

export default function HomePage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    useEffect(() => {
        getNews()
            .then(setArticles)
            .catch((error) => console.error('Erreur lors du chargement des articles', error));
    }, []);

    const openArticle = (article: Article) => {
        setSelectedArticle(article);
    };

    const closeModal = () => {
        setSelectedArticle(null);
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-500">Bienvenue sur myEfrei</h1>

            <SlidesCarousel/>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl text-blue-500 mb-6 text-center">Actualités</h2>
                    <div className="grid gap-6">
                        {articles.map((article) => (
                            <div
                                key={article.id}
                                className="flex flex-col items-center cursor-pointer transition-all hover:scale-105 hover:shadow-xl"
                                onClick={() => openArticle(article)}
                            >
                                {article.image_url && (
                                    <img
                                        src={article.image_url}
                                        alt={article.title}
                                        className="w-full h-48 object-cover rounded-lg mb-4 transition-all hover:opacity-80"
                                    />
                                )}
                                <h2 className="text-xl font-semibold text-center text-gray-800">{article.title}</h2>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center items-center bg-white rounded-lg shadow-lg p-8">
                    <p className="text-xl font-semibold text-gray-500">Contenu à venir</p>
                </div>
            </div>


            {selectedArticle && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto relative">
                        <button
                            className="absolute top-2 right-2 text-black text-3xl font-bold hover:text-gray-600"
                            onClick={closeModal}
                        >
                            ×
                        </button>
                        <h2 className="text-2xl font-bold mb-2">{selectedArticle.title}</h2>
                        {selectedArticle.image_url && (
                            <img
                                src={selectedArticle.image_url}
                                alt={selectedArticle.title}
                                className="mb-4 w-full h-64 object-cover rounded-lg"
                            />
                        )}
                        <div className="text-lg space-y-4">
                            {selectedArticle.content.split("\n").map((line, index) => (
                                <p key={index}>{line}</p>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
