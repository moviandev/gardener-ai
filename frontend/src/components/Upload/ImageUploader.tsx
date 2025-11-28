import { Image as ImageIcon, X } from 'lucide-react';
import { useRef } from 'react';

interface ImageUploaderProps {
  selectedImage: string | null;
  onImageSelect: (base64: string | null) => void;
}

export const ImageUploader = ({ selectedImage, onImageSelect }: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // The result is the Base64 string
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {selectedImage ? (
        <div className="relative group">
          <img
            src={selectedImage}
            alt="Preview"
            className="w-16 h-16 object-cover rounded-lg border border-white/20 shadow-md"
          />
          <button
            onClick={clearImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors"
            title="Remove image"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-3 text-white/70 hover:text-plant-green hover:bg-white/10 rounded-full transition-all"
          title="Upload a plant photo"
        >
          <ImageIcon size={24} />
        </button>
      )}
    </div>
  );
};