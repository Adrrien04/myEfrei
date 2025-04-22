import { useState } from "react";

type Slide = {
  id: number;
  image_url: string;
  title: string | null;
  text: string | null;
};

const useSlideModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Slide | null>(null);
  const [maxHeight, setMaxHeight] = useState<string>("80vh");

  const openModal = (item: Slide) => {
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

export default useSlideModal;
