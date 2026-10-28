
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { supabase } from "../lib/supabase";

interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  category: string | null;
  description: string | null;
  is_published: boolean;
  created_at: string;
}

interface GalleryFormData {
  title: string;
  image_url: string;
  category: string;
  description: string;
  is_published: boolean;
}

const emptyForm: GalleryFormData = {
  title: "",
  image_url: "",
  category: "",
  description: "",
  is_published: true,
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function AdminGallery() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [formData, setFormData] =
    useState<GalleryFormData>(emptyForm);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    void fetchGallery();
  }, []);

  // ---------------------------------------
  // FETCH GALLERY ITEMS
  // ---------------------------------------

  const fetchGallery = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GALLERY FETCH ERROR:", error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setGallery((data ?? []) as GalleryItem[]);
    setLoading(false);
  };

  // ---------------------------------------
  // FORM INPUT HANDLER
  // ---------------------------------------

  const handleInputChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePublishChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((previous) => ({
      ...previous,
      is_published: e.target.checked,
    }));
  };

  // ---------------------------------------
  // FILE SELECTION AND VALIDATION
  // ---------------------------------------

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");
    setSuccess("");

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");

      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must be 5 MB or less.");

      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ---------------------------------------
  // CLEAN UP TEMPORARY IMAGE PREVIEW
  // ---------------------------------------

  const clearSelectedFile = () => {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedFile(null);
    setImagePreview("");

    const fileInput = document.getElementById(
      "gallery-file"
    ) as HTMLInputElement | null;

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // ---------------------------------------
  // UPLOAD IMAGE TO SUPABASE STORAGE
  // ---------------------------------------

  const uploadGalleryImage = async (
    file: File
  ): Promise<string> => {
    const safeName = file.name.replace(
      /[^a-zA-Z0-9._-]/g,
      "-"
    );

    const filePath = `${crypto.randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery-images")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("gallery-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // ---------------------------------------
  // RESET FORM
  // ---------------------------------------

  const resetForm = () => {
    clearSelectedFile();
    setEditingId(null);
    setFormData(emptyForm);
  };

  // ---------------------------------------
  // EDIT GALLERY ITEM
  // ---------------------------------------

  const handleEdit = (item: GalleryItem) => {
    clearSelectedFile();

    setEditingId(item.id);

    setFormData({
      title: item.title,
      image_url: item.image_url,
      category: item.category ?? "",
      description: item.description ?? "",
      is_published: item.is_published,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ---------------------------------------
  // CANCEL EDIT
  // ---------------------------------------

  const handleCancel = () => {
    resetForm();
    setError("");
    setSuccess("");
  };

  // ---------------------------------------
  // ADD OR UPDATE GALLERY ITEM
  // ---------------------------------------

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      setError("Please enter an image title.");
      return;
    }

    if (!selectedFile && !formData.image_url.trim()) {
      setError("Please choose an image.");
      return;
    }

    setSaving(true);

    let uploadedImageUrl: string | null = null;

    try {
      let finalImageUrl = formData.image_url.trim();

      // Upload a new file if the admin selected one.
      if (selectedFile) {
        setUploading(true);

        finalImageUrl = await uploadGalleryImage(selectedFile);
        uploadedImageUrl = finalImageUrl;
      }

      const galleryData = {
        title: formData.title.trim(),
        image_url: finalImageUrl,
        category: formData.category.trim() || null,
        description: formData.description.trim() || null,
        is_published: formData.is_published,
      };

      // UPDATE EXISTING ITEM
      if (editingId) {
        const { data, error } = await supabase
          .from("gallery")
          .update(galleryData)
          .eq("id", editingId)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setGallery((previous) =>
          previous.map((item) =>
            item.id === editingId
              ? (data as GalleryItem)
              : item
          )
        );

        setSuccess("Gallery item updated successfully.");
      } else {
        // INSERT NEW ITEM
        const { data, error } = await supabase
          .from("gallery")
          .insert([galleryData])
          .select()
          .single();

        if (error) {
          throw error;
        }

        setGallery((previous) => [
          data as GalleryItem,
          ...previous,
        ]);

        setSuccess("Gallery item added successfully.");
      }

      resetForm();
    } catch (err) {
      console.error("GALLERY SAVE ERROR:", err);

      // Avoid leaving an unused upload if saving its
      // database record fails.
      if (uploadedImageUrl) {
        try {
          const marker = "/gallery-images/";
          const position = uploadedImageUrl.indexOf(marker);

          if (position !== -1) {
            const filePath = decodeURIComponent(
              uploadedImageUrl
                .slice(position + marker.length)
                .split("?")[0]
            );

            const { error: cleanupError } = await supabase.storage
              .from("gallery-images")
              .remove([filePath]);

            if (cleanupError) {
              console.error(
                "UNUSED IMAGE CLEANUP ERROR:",
                cleanupError
              );
            }
          }
        } catch (cleanupError) {
          console.error(
            "UNUSED IMAGE CLEANUP ERROR:",
            cleanupError
          );
        }
      }

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save the gallery item."
      );
    } finally {
      setUploading(false);
      setSaving(false);
    }
  };

  // ---------------------------------------
  // DELETE GALLERY ITEM
  // ---------------------------------------

  const handleDelete = async (item: GalleryItem) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.title}"?`
    );

    if (!confirmed) return;

    setDeletingId(item.id);
    setError("");
    setSuccess("");

    try {
      const { error } = await supabase
        .from("gallery")
        .delete()
        .eq("id", item.id);

      if (error) {
        throw error;
      }

      setGallery((previous) =>
        previous.filter(
          (galleryItem) => galleryItem.id !== item.id
        )
      );

      if (editingId === item.id) {
        resetForm();
      }

      setSuccess("Gallery item deleted successfully.");
    } catch (err) {
      console.error("GALLERY DELETE ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete the gallery item."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ---------------------------------------
  // PUBLISH OR HIDE GALLERY ITEM
  // ---------------------------------------

  const handleTogglePublish = async (
    item: GalleryItem
  ) => {
    setPublishingId(item.id);
    setError("");
    setSuccess("");

    const newValue = !item.is_published;

    try {
      const { error } = await supabase
        .from("gallery")
        .update({
          is_published: newValue,
        })
        .eq("id", item.id);

      if (error) {
        throw error;
      }

      setGallery((previous) =>
        previous.map((galleryItem) =>
          galleryItem.id === item.id
            ? {
                ...galleryItem,
                is_published: newValue,
              }
            : galleryItem
        )
      );

      setSuccess(
        newValue
          ? "Gallery item published successfully."
          : "Gallery item hidden successfully."
      );
    } catch (err) {
      console.error("GALLERY PUBLISH ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to change publication status."
      );
    } finally {
      setPublishingId(null);
    }
  };

  // ---------------------------------------
  // FORMAT DATE
  // ---------------------------------------

  const formatDate = (date: string) => {
    if (!date) return "Unknown";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ---------------------------------------
  // PAGE UI
  // ---------------------------------------

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          Admin
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Gallery Management
        </h1>

        <p className="mt-2 text-gray-600">
          Upload, edit, publish, hide, and delete gallery images.
        </p>
      </div>

      {/* SUCCESS MESSAGE */}
      {success && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-green-700"
        >
          {success}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700"
        >
          {error}
        </div>
      )}

      {/* ADD / EDIT FORM */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {editingId ? "Edit Gallery Item" : "Add Gallery Item"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Choose an image from your computer and enter its details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6">
          {/* TITLE */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Image Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Example: Wedding Decoration"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* IMAGE FILE PICKER */}
          <div>
            <label
              htmlFor="gallery-file"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Choose Gallery Image
            </label>

            <input
              id="gallery-file"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="w-full rounded-xl border border-gray-300 p-3"
            />

            <p className="mt-2 text-xs text-gray-500">
              JPG, PNG, or WebP. Maximum file size: 5 MB.
              When editing, leave this empty to keep the current image.
            </p>

            {/* IMAGE PREVIEW */}
            {(imagePreview || formData.image_url) && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-semibold text-gray-700">
                  Image Preview
                </p>

                <img
                  src={imagePreview || formData.image_url}
                  alt="Gallery preview"
                  className="h-56 w-full max-w-md rounded-xl object-cover"
                />
              </div>
            )}
          </div>

          {/* CATEGORY */}
          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Category
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Select Category</option>
              <option value="Wedding">Wedding</option>
              <option value="Corporate">Corporate</option>
              <option value="Music">Music</option>
              <option value="Birthday">Birthday</option>
              <option value="Decoration">Decoration</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Write a short description..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* PUBLISHED CHECKBOX */}
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={handlePublishChange}
              className="h-5 w-5"
            />

            <span className="text-sm font-semibold text-gray-700">
              Publish this image
            </span>
          </label>

          {/* FORM BUTTONS */}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading
                ? "Uploading image..."
                : saving
                ? "Saving..."
                : editingId
                ? "Update Gallery Item"
                : "Add Gallery Item"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* GALLERY LIST */}
      <div>
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900">
            Gallery Images
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {gallery.length} gallery item
            {gallery.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-600">Loading gallery...</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && gallery.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-5xl">🖼️</div>

            <h3 className="mt-4 text-xl font-bold text-gray-900">
              No gallery images yet
            </h3>

            <p className="mt-2 text-gray-500">
              Add your first gallery image using the form above.
            </p>
          </div>
        )}

        {/* GALLERY GRID */}
        {!loading && gallery.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {gallery.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg"
              >
                {/* IMAGE */}
                <div className="relative">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    loading="lazy"
                    className="h-60 w-full object-cover"
                  />

                  <div className="absolute right-3 top-3">
                    {item.is_published ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Published
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700">
                        Hidden
                      </span>
                    )}
                  </div>
                </div>

                {/* ITEM DETAILS */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900">
                    {item.title}
                  </h3>

                  {item.category && (
                    <p className="mt-1 text-sm font-semibold text-blue-600">
                      {item.category}
                    </p>
                  )}

                  {item.description && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                      {item.description}
                    </p>
                  )}

                  <p className="mt-3 text-xs text-gray-400">
                    Added: {formatDate(item.created_at)}
                  </p>

                  {/* ACTION BUTTONS */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      disabled={saving || deletingId !== null || publishingId !== null}
                      className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleTogglePublish(item)}
                      disabled={
                        publishingId !== null ||
                        saving ||
                        deletingId !== null
                      }
                      className="rounded-lg bg-yellow-50 px-4 py-2 text-sm font-semibold text-yellow-700 transition hover:bg-yellow-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {publishingId === item.id
                        ? "Updating..."
                        : item.is_published
                        ? "Hide"
                        : "Publish"}
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleDelete(item)}
                      disabled={
                        deletingId !== null ||
                        saving ||
                        publishingId !== null
                      }
                      className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === item.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminGallery;

