'use client';
import { useState, useEffect } from 'react';
import useSlideModal from '@/app/ui/hooks/useSlideModal';

type Slide = {
    id: number;
    image_url: string;
    title: string | null;
    text: string | null;
};

const AdminSlidesViewPage = () => {
    const [slides, setSlides] = useState<Slide[]>([]);
    const { isOpen, openModal, closeModal, selectedItem, maxHeight } = useSlideModal();
    const [isEditing, setIsEditing] = useState(false);
    const [editSlide, setEditSlide] = useState<Slide | null>(null);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const response = await fetch('/api/slides');
                if (!response.ok) throw new Error('Failed to fetch slides');
                const data = await response.json();
                setSlides(data);
            } catch (error) {
                console.error('Error fetching slides:', error);
            }
        };

        fetchSlides();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch('/api/slides', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (!response.ok) throw new Error('Failed to delete slide');
            setSlides(slides.filter(slide => slide.id !== id));
            closeModal();
        } catch (error) {
            console.error('Failed to delete slide:', error);
        }
    };

    const handleEdit = (slide: Slide) => {
        setIsEditing(true);
        setEditSlide(slide);
    };

    const handleEditSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!editSlide) return;

        const { id, image_url, title, text } = editSlide;

        if (!image_url) {
            alert('L\'URL de l\'image est requise');
            return;
        }

        try {
            const response = await fetch('/api/slides', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, image_url, title, text }),
            });

            if (!response.ok) throw new Error('Failed to update slide');

            setSlides(slides.map(slide => (slide.id === id ? editSlide : slide)));
            setIsEditing(false);
            closeModal();
        } catch (error) {
            console.error('Failed to update slide:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">View and Edit Slides</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {slides.map((slide) => (
                    <div
                        key={slide.id}
                        className="block p-4 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => openModal(slide)}
                    >
                        <img src={slide.image_url} alt={slide.title ?? 'Slide'} className="mb-4 w-full h-48 object-cover rounded-lg" />
                        <h2 className="text-xl font-bold mb-2">{slide.title ?? 'No Title'}</h2>
                        <p>{slide.text ? (slide.text.length > 150 ? slide.text.substring(0, 150) + '...' : slide.text) : ''}</p>
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
                        {isEditing ? (
                            <form onSubmit={handleEditSubmit}>
                                <h2 className="text-2xl font-bold mb-2">Edit Slide</h2>
                                <input
                                    type="text"
                                    value={editSlide?.image_url || ''}
                                    onChange={(e) => setEditSlide({ ...editSlide!, image_url: e.target.value })}
                                    className="w-full mb-4 p-2 border rounded-lg"
                                    placeholder="Image URL"
                                    required
                                />
                                <input
                                    type="text"
                                    value={editSlide?.title || ''}
                                    onChange={(e) => setEditSlide({ ...editSlide!, title: e.target.value })}
                                    className="w-full mb-4 p-2 border rounded-lg"
                                    placeholder="Title"
                                />
                                <textarea
                                    value={editSlide?.text || ''}
                                    onChange={(e) => setEditSlide({ ...editSlide!, text: e.target.value })}
                                    className="w-full mb-4 p-2 border rounded-lg"
                                    placeholder="Text"
                                    rows={6}
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </form>
                        ) : (
                            <>
                                <img src={selectedItem.image_url} alt={selectedItem.title ?? 'Slide'} className="mb-4 w-full h-64 object-cover rounded-lg" />
                                <h2 className="text-2xl font-bold mb-2">{selectedItem.title ?? 'No Title'}</h2>
                                <p className="text-lg space-y-4">{selectedItem.text}</p>
                                <button
                                    onClick={() => handleEdit(selectedItem)}
                                    className="mt-4 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedItem.id)}
                                    className="mt-4 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSlidesViewPage;
