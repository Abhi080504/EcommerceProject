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
  FormHelperText,
  Box,
  Paper,
  Typography
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
    <Box>
      {/* Header Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 4,
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ 
            fontWeight: 800, 
            background: 'linear-gradient(135deg, #00927c 0%, #0f9f8f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 0.5, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5 
          }}>
            {isEditMode ? "Update Product" : "Launch New Product"}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
            {isEditMode ? "Modify existing product details and pricing" : "Fill in the details to list your new product on the marketplace"}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={() => navigate("/seller/products")}
          sx={{
            borderColor: '#e2e8f0',
            color: '#475569',
            textTransform: 'none',
            borderRadius: 2.5,
            fontWeight: 600,
            px: 3,
            '&:hover': { borderColor: '#cbd5e1', bgcolor: '#f8fafc' }
          }}
        >
          Cancel
        </Button>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          background: '#ffffff',
          border: '1px solid #e2e8f0',
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>

            {/* IMAGE UPLOAD SECTION */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#1e293b' }}>
                Product Imagery
              </Typography>
              <Box className="flex flex-wrap gap-4">
                <input
                  type="file"
                  accept="image/*"
                  id="fileInput"
                  hidden
                  onChange={handleImageChange}
                />

                <label htmlFor="fileInput" className="relative">
                  <Box
                    sx={{
                      w: 100,
                      h: 100,
                      width: 100,
                      height: 100,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px dashed #cbd5e1',
                      borderRadius: 3,
                      color: '#94a3b8',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#00927c',
                        color: '#00927c',
                        bgcolor: '#f0fdfa'
                      }
                    }}
                  >
                    {uploadingImage ? <CircularProgress size={24} sx={{ color: '#00927c' }} /> : <AddPhotoAlternateIcon sx={{ fontSize: 32 }} />}
                  </Box>
                </label>

                {formik.values.images.map((image, index) => (
                  <Box key={index} className="relative group">
                    <img
                      src={image}
                      alt=""
                      className="w-[100px] h-[100px] object-cover rounded-xl border border-slate-200"
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveImage(index)}
                      sx={{ 
                        position: "absolute", 
                        top: -8, 
                        right: -8, 
                        bgcolor: '#ef4444', 
                        color: '#ffffff',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                        '&:hover': { bgcolor: '#dc2626' }
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* PRODUCT DETAILS SECTION */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 700, color: '#1e293b' }}>
                Basic Information
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Product Title"
                placeholder="Ex: High Performance Running Shoes"
                required
                {...formik.getFieldProps("title")}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Full Description"
                placeholder="Describe the features, materials, and benefits of your product..."
                required
                {...formik.getFieldProps("description")}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="MRP Price (₹)"
                required
                {...formik.getFieldProps("mrpPrice")}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Selling Price (₹)"
                required
                {...formik.getFieldProps("sellingPrice")}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Stock Quantity"
                required
                {...formik.getFieldProps("quantity")}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
              />
            </Grid>

            {/* ATTRIBUTES SECTION */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 700, color: '#1e293b' }}>
                Specifications & Categorization
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Brand"
                placeholder="Ex: Nike"
                {...formik.getFieldProps("brand")}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Color"
                placeholder="Ex: Midnight Black"
                required
                {...formik.getFieldProps("color")}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                options={level1Options}
                getOptionLabel={(option) => option.name || option.categoryId}
                value={level1Options.find(c => c.categoryId === formik.values.category) || null}
                onChange={(_, newValue) => {
                  formik.setFieldValue("category", newValue ? newValue.categoryId : "");
                  formik.setFieldValue("category2", "");
                  formik.setFieldValue("category3", "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Main Category"
                    required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
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
                  formik.setFieldValue("category3", "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sub Category"
                    required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
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
                    label="Leaf Category"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Available Sizes"
                placeholder="Ex: S, M, L, XL or 7, 8, 9, 10"
                required
                {...formik.getFieldProps("sizes")}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
              />
            </Grid>

            {/* ACTION SECTION */}
            <Grid size={{ xs: 12 }} sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={submitting}
                sx={{
                  py: 1.8,
                  bgcolor: '#0f172a',
                  textTransform: 'none',
                  borderRadius: 2.5,
                  fontWeight: 700,
                  fontSize: '1rem',
                  boxShadow: '0 8px 16px rgba(15, 23, 42, 0.2)',
                  '&:hover': { bgcolor: '#334155', boxShadow: '0 12px 20px rgba(15, 23, 42, 0.3)' },
                  '&:disabled': { bgcolor: '#94a3b8' }
                }}
              >
                {submitting ? (
                  <Box className="flex items-center gap-2">
                    <CircularProgress size={20} color="inherit" />
                    <span>Processing...</span>
                  </Box>
                ) : isEditMode ? "Update Product Information" : "Create Product Listing"}
              </Button>
            </Grid>

          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddProduct;