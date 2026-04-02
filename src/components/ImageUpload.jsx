import { useEffect, useRef, useState } from "react";

function ImageUpload({ onImageUpload, currentImage, label }) {
  const [preview, setPreview] = useState(currentImage || null);
  const inputRef = useRef(null);
  const MAX_FILE_SIZE_MB = 15;
  const MIN_WIDTH = 400;
  const MIN_HEIGHT = 400;

  const getImageDimensions = (file) =>
    new Promise((resolve, reject) => {
      const imageObjectUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          imageObjectUrl,
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(imageObjectUrl);
        reject(new Error("Could not read image dimensions"));
      };

      img.src = imageObjectUrl;
    });

  useEffect(() => {
    setPreview(currentImage || null);
  }, [currentImage]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Validate file size (15MB)
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`Image must be less than ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    try {
      const { width, height, imageObjectUrl } = await getImageDimensions(file);

      if (width < MIN_WIDTH || height < MIN_HEIGHT) {
        URL.revokeObjectURL(imageObjectUrl);
        alert(
          `Please upload at least ${MIN_WIDTH}x${MIN_HEIGHT}px for better quality`,
        );
        return;
      }

      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }

      setPreview(imageObjectUrl);
      onImageUpload(file);
    } catch (error) {
      alert(error.message || "Unable to process image");
      return;
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div>
      {label ? (
        <label className="block font-josefin text-sm font-bold text-hdark mb-2">
          {label}
        </label>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        id="image-upload"
      />

      <label
        htmlFor="image-upload"
        className="group flex w-fit cursor-pointer items-center gap-4"
      >
        <div className="relative h-20 w-20 overflow-hidden rounded-full bg-hpurple ring-4 ring-white shadow-sm transition group-hover:scale-105">
          {preview ? (
            <img
              src={preview}
              alt="Profile preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-josefin text-3xl font-bold text-white">
              {label?.charAt(0)?.toUpperCase() || "U"}
            </span>
          )}

          <div className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/20 group-hover:opacity-100">
            <span className="rounded-full bg-black/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider">
              Change
            </span>
          </div>
        </div>

        <span className="font-lato text-sm text-gray-500">
          Click the picture to update it (minimum 400x400)
        </span>
      </label>
    </div>
  );
}

export default ImageUpload;
