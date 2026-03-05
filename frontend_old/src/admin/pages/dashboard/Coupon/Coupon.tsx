import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../State/hooks';
import { fetchCoupons, deleteCoupon } from '../../../../State/Coupon/couponSlice';
import AddNewCouponForm from './AddNewCouponForm';
import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled, tableCellClasses } from '@mui/material';
import { Delete, Add } from '@mui/icons-material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#1e293b',
    color: theme.palette.common.white,
    fontWeight: 'bold',
    fontSize: 14,
    borderBottom: 'none',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderBottom: '1px solid #f1f5f9',
    color: '#475569',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#f8fafc',
  },
  '&:hover': {
    backgroundColor: '#e2e8f0',
    transition: 'background-color 0.2s ease',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
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
    <div className="p-2">
      {!showForm && (
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Coupons</h1>
          <Button
            variant="contained"
            onClick={() => setShowForm(true)}
            startIcon={<Add />}
            sx={{
              borderRadius: '8px',
              backgroundColor: '#0f172a',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#334155' }
            }}
          >
            Create Coupon
          </Button>
        </div>
      )}

      {showForm ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Create New Coupon</h2>
            <Button variant="text" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
          <AddNewCouponForm />
        </div>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #e2e8f0"
        }}>
          <Table sx={{ minWidth: 650 }} aria-label="coupon table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Code</StyledTableCell>
                <StyledTableCell align="center">Discount</StyledTableCell>
                <StyledTableCell align="center">Start Date</StyledTableCell>
                <StyledTableCell align="center">End Date</StyledTableCell>
                <StyledTableCell align="center">Min Order</StyledTableCell>
                <StyledTableCell align="center">Delete</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coupons.map((row: any) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {row.code}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.discountPercentage}%</StyledTableCell>
                  <StyledTableCell align="center">{row.validityStartDate}</StyledTableCell>
                  <StyledTableCell align="center">{row.validityEndDate}</StyledTableCell>
                  <StyledTableCell align="center">{row.minimumOrderValue}</StyledTableCell>
                  <StyledTableCell align="center">
                    <IconButton onClick={() => handleDelete(row.id)}>
                      <Delete sx={{ color: "#ef4444" }} />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Coupon;