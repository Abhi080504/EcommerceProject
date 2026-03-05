import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  tableCellClasses,
  Typography,
  Box,
  styled
} from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../State/Store';
import { fetchSellerTransactions } from '../../../State/Seller/transactionSlice';

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

const Transaction = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, loading } = useSelector((state: RootState) => state.transaction);

  useEffect(() => {
    dispatch(fetchSellerTransactions());
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'FAILED': return 'error';
      default: return 'default';
    }
  };

  return (
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
      <Table sx={{ minWidth: 700 }}>
        <TableHead>
          <TableRow>
            <StyledTableCell>Transaction ID</StyledTableCell>
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell>Type</StyledTableCell>
            <StyledTableCell>Amount</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((txn) => {
            const dateStr = new Date(txn.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
            const type = 'SALE'; // Currently backend Transaction is just order purchases
            const amount = txn.order?.totalSellingPrice || 0;
            const status = txn.order?.paymentStatus || 'PENDING';

            return (
              <StyledTableRow key={txn.id}>
                <StyledTableCell sx={{ fontWeight: 700, color: '#1e293b' }}>
                  {txn.id}
                </StyledTableCell>
                <StyledTableCell sx={{ color: '#64748b' }}>
                  {dateStr}
                </StyledTableCell>
                <StyledTableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#00927c' }}>
                    {type}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell sx={{
                  fontWeight: 700,
                  color: '#00927c'
                }}>
                  ₹{amount}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Chip
                    label={status}
                    color={getStatusColor(status)}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: 10,
                      letterSpacing: '0.5px',
                      borderRadius: 1.5,
                      minWidth: 90
                    }}
                  />
                </StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export { Transaction };
export default Transaction;
