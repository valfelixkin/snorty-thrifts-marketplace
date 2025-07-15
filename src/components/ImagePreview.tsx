
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImagePreviewProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ images, setImages }) => {
  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((imageUrl, index) => (
        <div key={index} className="relative group">
          <img
            src={imageUrl}
            alt={`Preview ${index + 1}`}
            className="w-full h-32 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => removeImage(index)}
          >
            <X className="h-4 w-4" />
          </Button>
          {index === 0 && (
            <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
              Primary
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImagePreview;
