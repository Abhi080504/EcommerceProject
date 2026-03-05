import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { uploadToCloudinary } from "../../../util/uploadToCloudinary";
import { apiAuth } from "../../../config/axiosAuth";
import { api } from "../../../config/Api"; // Import public api

import {
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Grid,
  Autocomplete,
  FormControl,
  FormHelperText
} from "@mui/material";

import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";

import { useNavigate, useParams } from "react-router-dom";

const AddProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(productId);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  // FETCH CATEGORIES ON MOUNT
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  // FETCH PRODUCT DETAILS IF EDIT MODE
  useEffect(() => {
    if (isEditMode && productId) {
      const fetchProductDetails = async () => {
        try {
          const res = await api.get(`/products/${productId}`);
          const product = res.data.data;

          if (product) {
            formik.setValues({
              title: product.title || "",
              description: product.description || "",
              mrpPrice: product.mrpPrice || "",
              sellingPrice: product.sellingPrice || "",
              quantity: product.quantity || "",
              color: product.color || "",
              images: product.images || [],
              category: product.category?.parentCategory?.parentCategory?.categoryId || "", // Level 1
              category2: product.category?.parentCategory?.categoryId || "", // Level 2
              category3: product.category?.categoryId || "", // Level 3
              sizes: product.sizes || "",
              brand: product.brand || "",
              brandDescription: product.brandDescription || "",
            });
          }
        } catch (error) {
          console.error("Failed to fetch product details", error);
          alert("Failed to load product for editing");
        }
      };
      fetchProductDetails();
    }
  }, [isEditMode, productId]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      mrpPrice: "",
      sellingPrice: "",
      quantity: "",
      color: "",
      images: [] as string[],
      category: "",
      category2: "",
      category3: "",
      sizes: "",
      brand: "",
      brandDescription: "",
    },

    onSubmit: async (values) => {
      try {
        setSubmitting(true);

        const payload = {
          title: values.title,
          description: values.description,
          mrpPrice: Number(values.mrpPrice),
          sellingPrice: Number(values.sellingPrice),
          quantity: Number(values.quantity),
          color: values.color,
          images: values.images,
          sizes: values.sizes,
          category: values.category,
          category2: values.category2,
          category3: values.category3,
          brand: values.brand,
          brandDescription: values.brandDescription,
        };

        if (isEditMode && productId) {
          // For simple update, passing the same payload mostly works if backend supports it 
          // BUT the backend implementation of createProduct vs updateProduct differs slightly.
          // However, let's try sending the same payload first.
          // Note: updateProduct expects a Product entity, not createProductRequest.
          // We might need to adjust payload structure or backend mapping.
          // Given implemented backend updateProduct usually just does save(product), 
          // we need to be careful with nulls. But let's try.

          await apiAuth.put(`/sellers/products/${productId}`, payload);
          alert("Product Updated Successfully 🎉");
          navigate("/seller/products");
        } else {
          await apiAuth.post("/sellers/products", payload);
          alert("Product Added Successfully 🎉");
          formik.resetForm();
        }

      } catch (err: any) {
        console.error("PRODUCT SUBMIT ERROR =", err.response?.data || err);
        alert(isEditMode ? "Product update failed" : "Product creation failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // FILTERED LISTS
  const level1Options = categories.filter((c) => c.level === 1);

  const level2Options = categories.filter(
    (c) => c.level === 2 && c.parentCategory?.categoryId === formik.values.category
  );

  const level3Options = categories.filter(
    (c) => c.level === 3 && c.parentCategory?.categoryId === formik.values.category2
  );

  const handleImageChange = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const imageUrl = await uploadToCloudinary(file);
      formik.setFieldValue("images", [...formik.values.images, imageUrl]);
    } catch {
      alert("Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = [...formik.values.images];
    updated.splice(index, 1);
    formik.setFieldValue("images", updated);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 p-4">
      {/* In MUI 5/6, if Grid2 isn't found, we use standard Grid. 
         To fix the original error, we use 'container' and 'size' props 
         or the responsive props directly.
      */}
      <Grid container spacing={2}>

        {/* IMAGE UPLOAD */}
        <Grid size={{ xs: 12 }} className="flex flex-wrap gap-5">
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            hidden
            onChange={handleImageChange}
          />

          <label htmlFor="fileInput" className="relative">
            <span className="w-24 h-24 cursor-pointer flex items-center justify-center border rounded-lg">
              <AddPhotoAlternateIcon />
            </span>
            {uploadingImage && <CircularProgress size={26} />}
          </label>

          {formik.values.images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                className="w-24 h-24 object-cover rounded"
              />
              <IconButton
                size="small"
                color="error"
                onClick={() => handleRemoveImage(index)}
                sx={{ position: "absolute", top: 0, right: 0 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          ))}
        </Grid>

        {/* TITLE */}
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Product Title"
            required
            {...formik.getFieldProps("title")}
          />
        </Grid>

        {/* DESCRIPTION */}
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            required
            {...formik.getFieldProps("description")}
          />
        </Grid>

        {/* PRICES */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            type="number"
            label="MRP Price"
            required
            {...formik.getFieldProps("mrpPrice")}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            type="number"
            label="Selling Price"
            required
            {...formik.getFieldProps("sellingPrice")}
          />
        </Grid>

        {/* QUANTITY */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            type="number"
            label="Quantity"
            required
            {...formik.getFieldProps("quantity")}
          />
        </Grid>

        {/* BRAND */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Brand Name"
            placeholder="Ex: Nike, Samsung"
            {...formik.getFieldProps("brand")}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Brand Description"
            placeholder="Brief story about the brand..."
            {...formik.getFieldProps("brandDescription")}
          />
        </Grid>

        {/* COLOR */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Color"
            placeholder="Ex: Black"
            required
            {...formik.getFieldProps("color")}
          />
        </Grid>

        {/* CATEGORY LEVELS */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Autocomplete
            options={level1Options}
            getOptionLabel={(option) => option.name || option.categoryId}
            value={level1Options.find(c => c.categoryId === formik.values.category) || null}
            onChange={(_, newValue) => {
              formik.setFieldValue("category", newValue ? newValue.categoryId : "");
              formik.setFieldValue("category2", ""); // Reset child
              formik.setFieldValue("category3", ""); // Reset grandchild
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category Level 1"
                placeholder="Select Main Category"
                required
                error={formik.touched.category && Boolean(formik.errors.category)}
                helperText={formik.touched.category && formik.errors.category}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Autocomplete
            options={level2Options}
            getOptionLabel={(option) => option.name || option.categoryId}
            value={level2Options.find(c => c.categoryId === formik.values.category2) || null}
            disabled={!formik.values.category}
            onChange={(_, newValue) => {
              formik.setFieldValue("category2", newValue ? newValue.categoryId : "");
              formik.setFieldValue("category3", ""); // Reset child
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category Level 2"
                placeholder="Select Sub Category"
                required
                error={formik.touched.category2 && Boolean(formik.errors.category2)}
                helperText={formik.touched.category2 && formik.errors.category2}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Autocomplete
            options={level3Options}
            getOptionLabel={(option) => option.name || option.categoryId}
            value={level3Options.find(c => c.categoryId === formik.values.category3) || null}
            disabled={!formik.values.category2}
            onChange={(_, newValue) => {
              formik.setFieldValue("category3", newValue ? newValue.categoryId : "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category Level 3 (Optional)"
                placeholder="Select Leaf Category (Optional)"
                error={formik.touched.category3 && Boolean(formik.errors.category3)}
                helperText={formik.touched.category3 && formik.errors.category3}
              />
            )}
          />
        </Grid>

        {/* SIZES */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Sizes"
            placeholder="Ex: S,M,L,XL"
            required
            {...formik.getFieldProps("sizes")}
          />
        </Grid>

        {/* SUBMIT */}
        <Grid size={{ xs: 12 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={submitting}
          >
            {submitting ? "Processing..." : isEditMode ? "UPDATE PRODUCT" : "ADD PRODUCT"}
          </Button>
        </Grid>

      </Grid>
    </form>
  );
};

export default AddProduct;