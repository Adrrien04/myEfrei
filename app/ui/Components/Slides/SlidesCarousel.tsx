"use client";

import { useEffect, useState } from "react";
import { getSlides, Slide } from "../Slides/getSlides";

const SlidesCarousel = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalSlide, setModalSlide] = useState<Slide | null>(null);

  useEffect(() => {
    const fetchSlides = async () => {
      const data = await getSlides();
      setSlides(data);
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const openModal = (slide: Slide) => {
    if (slide.title || slide.text) {
      setModalSlide(slide);
    }
  };

  const closeModal = () => setModalSlide(null);

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (slides.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">Chargement...</div>
    );
  }

  return (
    <div className="relative">
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="flex-shrink-0 w-full"
              onClick={() => openModal(slide)}
            >
              <img
                src={slide.image_url}
                alt={slide.title ?? "Slide"}
                className="w-full object-cover h-[400px] rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 p-4">
        <button
          onClick={goToPrev}
          className="text-white text-3xl font-bold bg-black rounded-full p-2 hover:bg-gray-600"
        >
          ‹
        </button>
      </div>
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 p-4">
        <button
          onClick={goToNext}
          className="text-white text-3xl font-bold bg-black rounded-full p-2 hover:bg-gray-600"
        >
          ›
        </button>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-3 h-3 rounded-full ${currentSlide === idx ? "bg-white" : "bg-gray-400"}`}
          />
        ))}
      </div>

      {modalSlide && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-2xl font-bold text-gray-600 hover:text-black"
            >
              ×
            </button>
            <img
              src={modalSlide.image_url}
              alt={modalSlide.title ?? "Slide"}
              className="mb-4 w-full rounded-lg"
            />
            {modalSlide.title && (
              <h2 className="text-xl font-bold mb-2">{modalSlide.title}</h2>
            )}
            {modalSlide.text && (
              <div className="space-y-4">
                {modalSlide.text.split("\n").map((line, index) => (
                  <p key={index} className="text-gray-700">
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SlidesCarousel;
