import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Chip,
  Button,
  tableCellClasses,
  styled,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import UpdateIcon from '@mui/icons-material/Update';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../State/Store';
import { fetchSellerOrders } from '../../../State/Seller/sellerOrderSlice';

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
  },
  '&:last-child td, &:last-child th': { border: 0 },
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}));

export default function OrderTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading } = useSelector((state: RootState) => state.sellerOrder);

  useEffect(() => {
    dispatch(fetchSellerOrders());
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'success';
      case 'SHIPPED': return 'primary';
      case 'PLACED': return 'info';
      case 'PENDING': return 'warning';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
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
            <ShoppingCartIcon sx={{ color: '#00927c' }} /> Order Management
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
            Track, manage and fulfill your customer orders
          </Typography>
        </Box>
      </Paper>

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
              <StyledTableCell>Order ID</StyledTableCell>
              <StyledTableCell>Product Information</StyledTableCell>
              <StyledTableCell>Shipping Destination</StyledTableCell>
              <StyledTableCell>Total Amount</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Update</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell sx={{ fontWeight: 700, color: '#0f172a' }}>
                  #{row.id}
                </StyledTableCell>
                <StyledTableCell sx={{ fontWeight: 600 }}>
                  {row.orderItems?.length > 0 ? row.orderItems[0].product?.title : 'N/A'} {row.orderItems?.length > 1 ? `(+${row.orderItems.length - 1} more)` : ''}
                </StyledTableCell>
                <StyledTableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                    <Typography variant="body2">{row.shippingAddress?.city || ''}, {row.shippingAddress?.state || ''}</Typography>
                  </Box>
                </StyledTableCell>
                <StyledTableCell sx={{ fontWeight: 700, color: '#00927c' }}>
                  ₹{row.totalSellingPrice}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Chip
                    label={row.orderStatus}
                    color={getStatusColor(row.orderStatus)}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: 11,
                      letterSpacing: '0.5px',
                      borderRadius: 1.5,
                      minWidth: 90
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Button
                    size="small"
                    startIcon={<UpdateIcon />}
                    variant="text"
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      color: '#475569',
                      '&:hover': { color: '#00927c', bgcolor: '#f0fdf4' }
                    }}
                  >
                    Details
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
