
import React from 'react';
import { Upload, X, Image, Video } from 'lucide-react';

interface MediaUploadSectionProps {
  mediaFiles: File[];
  setMediaFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const MediaUploadSection = ({ mediaFiles, setMediaFiles }: MediaUploadSectionProps) => {
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (mediaFiles.length + files.length > 5) {
      alert('You can upload a maximum of 5 files');
      return;
    }
    setMediaFiles(prev => [...prev, ...files]);
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Supporting Media (Images/Videos)
      </label>
      <p className="text-xs text-gray-500 mb-3">
        Upload up to 5 images or videos to support your return request
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {mediaFiles.map((file, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              {file.type.startsWith('image/') ? (
                <>
                  <Image className="w-8 h-8 text-gray-400" />
                  <span className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-1 rounded">
                    IMG
                  </span>
                </>
              ) : (
                <>
                  <Video className="w-8 h-8 text-gray-400" />
                  <span className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-1 rounded">
                    VID
                  </span>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeMedia(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
            <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
          </div>
        ))}
        
        {mediaFiles.length < 5 && (
          <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-brand-red-400 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Add Media</span>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleMediaUpload}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default MediaUploadSection;
