import { useState } from 'react';

type ModalContent = {
    id: number;
    title: string;
    content: string;
    image_url: string | null;
};


const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ModalContent | null>(null);
    const [maxHeight, setMaxHeight] = useState<string>('80vh');

    const openModal = (item: ModalContent) => {
        setSelectedItem(item);
        setIsOpen(true);
    };

    const closeModal = () => {
        setSelectedItem(null);
        setIsOpen(false);
    };

    return {
        isOpen,
        openModal,
        closeModal,
        selectedItem,
        maxHeight,
    };
};

export default useModal;
