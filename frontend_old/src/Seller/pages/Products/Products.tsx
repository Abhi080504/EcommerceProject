import { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { apiAuth } from "../../../config/axiosAuth";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  title: string;
  images: string[];
  sellingPrice: number;
  mrpPrice: number;
  discountPercent: number;
  quantity: number;
  createdAt: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // === DEBUG: Decode JWT to see what ID is embedded ===
      const jwt = localStorage.getItem("jwt");
      if (jwt) {
        try {
          const payload = JSON.parse(atob(jwt.split(".")[1]));
          console.log("🔍 [Products] JWT payload:", payload);
          console.log("🔍 [Products] JWT id:", payload.id, "| email:", payload.email, "| authorities:", payload.authorities);
        } catch (e) {
          console.error("🔍 [Products] JWT decode failed:", e);
        }
      } else {
        console.error("🔍 [Products] NO JWT in localStorage!");
      }

      console.log("🔍 [Products] Calling GET /sellers/products...");
      const res = await apiAuth.get("/sellers/products");
      console.log("🔍 [Products] Full response status:", res.status);
      console.log("🔍 [Products] Full response data:", JSON.stringify(res.data, null, 2));

      // Backend returns ApiResponse<Page<Product>>
      // res.data = ApiResponse
      // res.data.data = Page
      // res.data.data.content = List of Products
      const productList = res.data?.data?.content || [];
      console.log("🔍 [Products] Extracted productList length:", productList.length);
      setProducts(productList);
    } catch (err: any) {
      console.error("❌ [Products] FETCH PRODUCTS FAILED:", err);
      console.error("❌ [Products] Response status:", err?.response?.status);
      console.error("❌ [Products] Response data:", JSON.stringify(err?.response?.data, null, 2));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      setDeleting(id);
      await apiAuth.delete(`/sellers/products/${id}`);

      // remove item locally
      setProducts((prev) => prev.filter((p) => p.id !== id));

      alert("Product deleted");
    } catch (err) {
      console.error("DELETE FAILED =", err);
      alert("Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (id: number) => {
    // navigate to edit page (we can implement next)
    navigate(`/seller/update-product/${id}`);
  };

  if (loading) {
    return (
      <Box className="flex justify-center p-10">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="p-4">
      <Typography variant="h5" gutterBottom>
        My Products
      </Typography>

      {products.length === 0 ? (
        <Typography>No products added yet.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.images?.[0]}
                      alt=""
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 6,
                        objectFit: "cover",
                      }}
                    />
                  </TableCell>

                  <TableCell>{product.title}</TableCell>

                  <TableCell>
                    ₹{product.sellingPrice}{" "}
                    <span style={{ color: "gray" }}>
                      (MRP ₹{product.mrpPrice})
                    </span>
                  </TableCell>

                  <TableCell>{product.quantity}</TableCell>

                  <TableCell>{product.discountPercent}%</TableCell>

                  <TableCell>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(product.id)}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDelete(product.id)}
                      disabled={deleting === product.id}
                    >
                      {deleting === product.id ? (
                        <CircularProgress size={22} />
                      ) : (
                        <DeleteIcon />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Products;
