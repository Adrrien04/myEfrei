'use client';
import { useState } from 'react';

const ArticleForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await fetch('/api/articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, imageUrl }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.error || 'Une erreur est survenue.');
                return;
            }

            setSuccessMessage('Article publié avec succès.');
            setTitle('');
            setContent('');
            setImageUrl('');
        } catch (error) {
            setErrorMessage('Erreur de connexion au serveur.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                name="title"
                placeholder="Titre de l'article"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
            />
            <textarea
                name="content"
                placeholder="Contenu de l'article"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
            />
            <input
                type="text"
                name="imageUrl"
                placeholder="URL de l'image"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {errorMessage && (
                <p className="text-red-600 text-sm">{errorMessage}</p>
            )}
            {successMessage && (
                <p className="text-green-600 text-sm">{successMessage}</p>
            )}
            <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
                Publier
            </button>
        </form>
    );
};

export default ArticleForm;