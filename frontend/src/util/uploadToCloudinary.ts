export const uploadToCloudinary = async (file: File) => {
  const CLOUDINARY_UPLOAD_PRESET = "ecommerce_site";   // change if needed
  const CLOUD_NAME = "dtwyuwgea";                  // replace
  const FOLDER = "ecommerce-products";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", FOLDER);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();

  if (!data.secure_url) {
    throw new Error("Cloudinary upload failed");
  }

  return data.secure_url;
};
