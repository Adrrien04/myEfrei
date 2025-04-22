'use client';
import { useState } from 'react';

const AdminSlidesCreatePage = () => {
    const [imageUrl, setImageUrl] = useState('');
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!imageUrl) {
            alert('L\'URL de l\'image est requise');
            return;
        }

        try {
            const response = await fetch('/api/slides', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image_url: imageUrl, title: title || null, text: text || null }),
            });

            if (!response.ok) throw new Error('Failed to create slide');

            setImageUrl('');
            setTitle('');
            setText('');
            setSuccess(true);
            setError('');
        } catch (error) {
            console.error('Failed to create slide:', error);
            setError('Erreur lors de la création du slide.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create New Slide</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Image URL (obligatoire)"
                    required
                />
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Title (optionnel)"
                />
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Text (optionnel)"
                    rows={6}
                />
                <button
                    type="submit"
                    className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                    Create Slide
                </button>
            </form>

            {success && (
                <div className="mt-4 text-green-600 font-semibold">
                    Slide créé avec succès !
                </div>
            )}
            {error && (
                <div className="mt-4 text-red-600 font-semibold">
                    {error}
                </div>
            )}
        </div>
    );
};

export default AdminSlidesCreatePage;
