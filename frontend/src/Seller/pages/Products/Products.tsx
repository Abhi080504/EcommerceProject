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
  tableCellClasses,
  styled,
  Chip,
  Tooltip,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import InventoryIcon from "@mui/icons-material/Inventory";
import AddIcon from "@mui/icons-material/Add";

import { apiAuth } from "../../../config/axiosAuth";
import { useNavigate } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#1e293b',
    color: theme.palette.common.white,
    fontWeight: 700,
    fontSize: 13,
    borderBottom: 'none',
    padding: '18px 16px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderBottom: '1px solid #f1f5f9',
    color: '#475569',
    padding: '16px',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': { backgroundColor: '#f8fafc' },
  '&:hover': { 
    backgroundColor: '#e2e8f0', 
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'scale(1.001)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
  },
  '&:last-child td, &:last-child th': { border: 0 },
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}));

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
      const res = await apiAuth.get("/sellers/products");
      const productList = res.data?.data?.content || [];
      setProducts(productList);
    } catch (err) {
      console.error("FETCH PRODUCTS FAILED =", err);
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
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("DELETE FAILED =", err);
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/seller/update-product/${id}`);
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-[400px]">
        <CircularProgress sx={{ color: '#00927c' }} />
      </Box>
    );
  }

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
            <InventoryIcon sx={{ color: '#00927c' }} /> Inventory Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
            Management of products and stock levels
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/seller/add-product")}
          sx={{
            bgcolor: '#0f172a',
            textTransform: 'none',
            borderRadius: 2.5,
            fontWeight: 600,
            px: 3,
            '&:hover': { bgcolor: '#334155' }
          }}
        >
          Add Product
        </Button>
      </Paper>

      {/* Table Section */}
      <TableContainer 
        component={Paper} 
        elevation={0} 
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          background: '#ffffff'
        }}
      >
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Product Details</StyledTableCell>
              <StyledTableCell>Pricing Information</StyledTableCell>
              <StyledTableCell align="center">Stock Level</StyledTableCell>
              <StyledTableCell align="center">Discount</StyledTableCell>
              <StyledTableCell>Listing Date</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <StyledTableCell colSpan={6} align="center" sx={{ py: 10 }}>
                   <Box sx={{ opacity: 0.5 }}>
                      <InventoryIcon sx={{ fontSize: 48, mb: 1 }} />
                      <Typography variant="h6">No products found</Typography>
                      <Typography variant="body2">Start adding products to your inventory</Typography>
                   </Box>
                </StyledTableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <StyledTableRow key={product.id}>
                  <StyledTableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <img
                        src={product.images?.[0]}
                        alt=""
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 10,
                          objectFit: "cover",
                          border: '1px solid #e2e8f0'
                        }}
                      />
                      <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {product.title}
                      </Typography>
                    </Box>
                  </StyledTableCell>

                  <StyledTableCell>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#00927c', fontSize: '1.1rem' }}>
                        ₹{product.sellingPrice}
                      </Typography>
                      <Typography sx={{ color: '#94a3b8', textDecoration: 'line-through', fontSize: '0.85rem' }}>
                        MRP ₹{product.mrpPrice}
                      </Typography>
                    </Box>
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    <Chip 
                      label={product.quantity}
                      size="small"
                      sx={{ 
                        fontWeight: 700,
                        bgcolor: product.quantity < 10 ? '#fee2e2' : '#f0fdf4',
                        color: product.quantity < 10 ? '#991b1b' : '#166534',
                        borderRadius: 1.5,
                        minWidth: 45
                      }}
                    />
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    <Typography sx={{ fontWeight: 600, color: '#F59E0B' }}>
                      {product.discountPercent}% OFF
                    </Typography>
                  </StyledTableCell>

                  <StyledTableCell>
                    <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>
                      {new Date(product.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Typography>
                  </StyledTableCell>

                  <StyledTableCell align="center">
                     <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="Edit Product">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(product.id)}
                            sx={{ color: '#1e293b', bgcolor: '#f1f5f9', '&:hover': { bgcolor: '#e2e8f0' } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Product">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(product.id)}
                            disabled={deleting === product.id}
                            sx={{ color: '#ef4444', bgcolor: '#fef2f2', '&:hover': { bgcolor: '#fee2e2' } }}
                          >
                            {deleting === product.id ? (
                              <CircularProgress size={20} />
                            ) : (
                              <DeleteIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                     </Box>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Products;
