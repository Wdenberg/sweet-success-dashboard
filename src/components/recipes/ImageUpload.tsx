import { useCallback } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  imagePreview: string | null;
  onImageChange: (file: File | null, preview: string | null) => void;
}

export function ImageUpload({ imagePreview, onImageChange }: ImageUploadProps) {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageChange]);

  const handleRemove = useCallback(() => {
    onImageChange(null, null);
  }, [onImageChange]);

  return (
    <div className="relative">
      {imagePreview ? (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden group">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleRemove}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-primary hover:bg-primary-soft/30 transition-all duration-200">
          <div className="flex flex-col items-center justify-center py-6">
            <div className="h-16 w-16 rounded-2xl bg-primary-soft flex items-center justify-center mb-4">
              <Camera className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">Adicionar foto do bolo</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG até 5MB</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  );
}
