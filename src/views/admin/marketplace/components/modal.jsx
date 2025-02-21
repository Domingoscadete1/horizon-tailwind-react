import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import Card from 'components/card';

const ImageModal = ({ imageUrl, additionalImages = [], onClose }) => {
  const [currentImage, setCurrentImage] = useState(imageUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0B] bg-opacity-70">
      <Card extra="w-full max-w-3xl h-[80vh] flex flex-col items-center justify-center relative p-0">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
        >
          <FaTimes className="w-6 h-6" />
        </button>
        <div className="bg-white rounded-lg overflow-hidden flex flex-col items-center p-4">
          {/* Imagem principal */}
          <img src={currentImage} alt="NFT" className="w-full h-[60vh] object-contain rounded-lg" />

          {/* Miniaturas das imagens adicionais */}
          {additionalImages.length > 0 && (
            <div className="mt-4 flex gap-2">
              {[imageUrl, ...additionalImages].slice(0, 5).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Extra ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-md cursor-pointer transition-opacity duration-200 ${
                    currentImage === img ? "opacity-50" : "hover:opacity-80"
                  }`}
                  onClick={() => setCurrentImage(img)}
                />
              ))}
            </div>
          )}
        </div>

      </Card>
    </div>
  );
};

export default ImageModal;
