
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface GalleryItem {
  id: string;
  title?: string;
  image_url?: string;
  description?: string;
  created_at?: string;
}

export default function AdminGallery() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading gallery:", error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setGallery(data || []);
    setLoading(false);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const uploadGalleryImage = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please choose an image first.");
      return;
    }

    if (!title.trim()) {
      alert("Please enter an image title.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      // Create a unique file name
      const fileExtension =
        selectedFile.name.split(".").pop() || "jpg";

      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExtension}`;

      const filePath = `gallery/${fileName}`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(filePath, selectedFile, {
          upsert: false,
          contentType: selectedFile.type,
        });

      if (uploadError) {
        console.error("Image upload error:", uploadError);
        throw new Error(uploadError.message);
      }

      // Get public image URL
      const { data: publicUrlData } = supabase.storage
        .from("gallery")
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      // Save image information in gallery table
      const { error: databaseError } = await supabase
        .from("gallery")
        .insert([
          {
            title: title.trim(),
            description: description.trim(),
            image_url: imageUrl,
          },
        ]);

      if (databaseError) {
        console.error(
          "Gallery database error:",
          databaseError
        );

        // Remove uploaded image if database insert fails
        await supabase.storage
          .from("gallery")
          .remove([filePath]);

        throw new Error(databaseError.message);
      }

      alert("Gallery image uploaded successfully!");

      // Clear form
      setSelectedFile(null);
      setTitle("");
      setDescription("");

      const fileInput = document.getElementById(
        "gallery-image"
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      // Reload gallery
      await fetchGallery();
    } catch (error) {
      console.error("Upload failed:", error);

      if (error instanceof Error) {
        setError(error.message);
        alert(`Upload failed: ${error.message}`);
      } else {
        setError("Something went wrong while uploading.");
        alert("Upload failed.");
      }
    } finally {
      setUploading(false);
    }
  };

  const deleteGalleryItem = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this gallery item?"
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("gallery")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting gallery item:", error);
      alert(`Delete failed: ${error.message}`);
      return;
    }

    setGallery((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">

        {/* Page Header */}
        <div className="mb-8">
          <p className="font-semibold uppercase tracking-widest text-amber-600">
            Admin Panel
          </p>

          <h1 className="mt-2 text-3xl font-bold text-purple-950 md:text-4xl">
            Gallery
          </h1>

          <p className="mt-2 text-gray-600">
            Upload and manage images displayed in your event gallery.
          </p>
        </div>

        {/* Upload Form */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-md md:p-8">
          <h2 className="text-2xl font-bold text-purple-950">
            Add New Gallery Image
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            Choose an image and add the details below.
          </p>

          <form
            onSubmit={uploadGalleryImage}
            className="mt-6 space-y-5"
          >
            {/* Image */}
            <div>
              <label
                htmlFor="gallery-image"
                className="mb-2 block font-semibold text-gray-800"
              >
                Choose Image
              </label>

              <input
                id="gallery-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm"
              />

              {selectedFile && (
                <p className="mt-2 text-sm text-green-700">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <label
                htmlFor="gallery-title"
                className="mb-2 block font-semibold text-gray-800"
              >
                Image Title
              </label>

              <input
                id="gallery-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Example: Wedding Decoration"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-700"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="gallery-description"
                className="mb-2 block font-semibold text-gray-800"
              >
                Description
              </label>

              <textarea
                id="gallery-description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Optional description"
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-700"
              />
            </div>

            {/* Upload Button */}
            <button
              type="submit"
              disabled={uploading}
              className="rounded-lg bg-amber-500 px-6 py-3 font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading
                ? "Uploading..."
                : "Upload Gallery Image"}
            </button>
          </form>
        </div>

        {/* Error */}
        {!loading && error && (
          <div className="mb-8 rounded-2xl bg-red-50 p-6 shadow-md">
            <h2 className="font-bold text-red-800">
              Gallery Error
            </h2>

            <p className="mt-2 break-words text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchGallery}
              className="mt-4 rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-md">
            <p className="text-gray-600">
              Loading gallery...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && gallery.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <h2 className="text-xl font-bold text-purple-950">
              No gallery items found
            </h2>

            <p className="mt-2 text-gray-600">
              Upload your first gallery image above.
            </p>
          </div>
        )}

        {/* Gallery Grid */}
        {!loading && !error && gallery.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl bg-white shadow-md"
              >
                {/* Image */}
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title || "Gallery image"}
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center bg-gray-200 text-gray-500">
                    No Image
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  <h2 className="text-xl font-bold text-purple-950">
                    {item.title || "Untitled"}
                  </h2>

                  {item.description && (
                    <p className="mt-2 text-sm text-gray-600">
                      {item.description}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      deleteGalleryItem(item.id)
                    }
                    className="mt-5 w-full rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white transition hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refresh */}
        {!loading && (
          <div className="mt-8">
            <button
              type="button"
              onClick={fetchGallery}
              className="rounded-lg bg-purple-950 px-5 py-3 font-semibold text-white transition hover:bg-purple-900"
            >
              Refresh Gallery
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

