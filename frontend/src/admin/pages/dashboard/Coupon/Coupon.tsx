import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../State/hooks';
import { fetchCoupons, deleteCoupon } from '../../../../State/Coupon/couponSlice';
import AddNewCouponForm from './AddNewCouponForm';
import { 
  Button, 
  IconButton, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  styled, 
  tableCellClasses,
  Box,
  Typography,
  Chip
} from '@mui/material';
import { Delete, Add, LocalOffer, ArrowBack } from '@mui/icons-material';

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
    padding: '20px 16px',
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

const Coupon = () => {
  const [showForm, setShowForm] = useState(false);
  const dispatch = useAppDispatch();
  const { coupons } = useAppSelector((state: any) => state.coupon);

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this coupon?")) {
      dispatch(deleteCoupon(id));
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      {!showForm ? (
        <>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 3,
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            }}
          >
             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700, 
                    background: 'linear-gradient(135deg, #00927c 0%, #0f9f8f 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 0.5, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1 
                  }}>
                    <LocalOffer sx={{ color: '#00927c' }} /> Coupons
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Manage discount coupons and offers
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  onClick={() => setShowForm(true)}
                  startIcon={<Add />}
                  disableElevation
                  sx={{
                    borderRadius: 2,
                    backgroundColor: '#0f172a',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    '&:hover': { 
                      backgroundColor: '#334155',
                      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.3)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  Create Coupon
                </Button>
              </Box>
          </Paper>

          <TableContainer 
            component={Paper} 
            elevation={0} 
            sx={{
              boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
              borderRadius: 3,
              overflow: "hidden",
              border: "1px solid #e2e8f0"
            }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="coupon table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Code</StyledTableCell>
                  <StyledTableCell align="center">Discount</StyledTableCell>
                  <StyledTableCell align="center">Start Date</StyledTableCell>
                  <StyledTableCell align="center">End Date</StyledTableCell>
                  <StyledTableCell align="center">Min Order</StyledTableCell>
                  <StyledTableCell align="center">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coupons.map((row: any) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                       <Chip 
                        label={row.code} 
                        sx={{ 
                          fontWeight: 700, 
                          color: '#0f172a', 
                          bgcolor: '#f1f5f9',
                          letterSpacing: '0.5px',
                          borderRadius: 1
                        }} 
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography sx={{ fontWeight: 600, color: '#10B981' }}>
                        {row.discountPercentage}%
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell align="center">{row.validityStartDate}</StyledTableCell>
                    <StyledTableCell align="center">{row.validityEndDate}</StyledTableCell>
                    <StyledTableCell align="center">₹{row.minimumOrderValue}</StyledTableCell>
                    <StyledTableCell align="center">
                      <IconButton 
                        onClick={() => handleDelete(row.id)}
                        sx={{ 
                          color: "#ef4444",
                          '&:hover': {
                            bgcolor: 'rgba(239, 68, 68, 0.1)',
                          }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Button 
            onClick={() => setShowForm(false)}
            startIcon={<ArrowBack />}
            disableRipple
            sx={{ 
              mb: 3, 
              color: '#64748b', 
              textTransform: 'none', 
              fontWeight: 600,
              fontSize: 15,
              borderRadius: 2,
              px: 2,
              py: 1,
              '&:hover': { 
                color: '#1e293b',
                bgcolor: '#f1f5f9',
                transform: 'translateX(-4px)'
              },
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              width: 'fit-content'
            }}
          >
            Back to Coupons
          </Button>
          <AddNewCouponForm />
        </Box>
      )}
    </Box>
  );
};

export default Coupon;