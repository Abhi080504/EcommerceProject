import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  styled,
  tableCellClasses,
  Box,
  Typography,
  Chip
} from "@mui/material";
import { Delete, Edit, Discount, Category } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../../State/hooks";
import { fetchDeals, deleteDeal } from "../../../../State/Deals/dealSlice";

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

export default function DealTable() {
  const dispatch = useAppDispatch();
  const { deals } = useAppSelector((state: any) => state.deal);

  useEffect(() => {
    dispatch(fetchDeals());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      dispatch(deleteDeal(id));
    }
  };

  return (
    <Box>
      <Paper 
        elevation={0}
        sx={{ 
            borderRadius: 3, 
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Discount sx={{ color: '#0f172a' }} /> All Deals
            </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                View and manage all active deals
            </Typography>
        </Box>

        <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="deal table">
            <TableHead>
                <TableRow>
                <StyledTableCell>No</StyledTableCell>
                <StyledTableCell align="center">Image</StyledTableCell>
                <StyledTableCell align="left">Category</StyledTableCell>
                <StyledTableCell align="center">Discount</StyledTableCell>
                <StyledTableCell align="center">Update</StyledTableCell>
                <StyledTableCell align="center">Delete</StyledTableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {deals.map((row: any, index: number) => (
                <StyledTableRow key={row.id}>
                    <StyledTableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {String(index + 1).padStart(2, '0')}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box 
                            component="img"
                            src={row.category.image} 
                            alt={row.category.name} 
                            sx={{
                                width: 48,
                                height: 48,
                                objectFit: 'contain',
                                borderRadius: 1.5,
                                border: '1px solid #e2e8f0',
                                p: 0.5,
                                bgcolor: '#fff'
                            }}
                        />
                    </Box>
                    </StyledTableCell>
                    <StyledTableCell align="left" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Category sx={{ fontSize: 16, color: '#64748b' }} />
                            {row.category.name}
                        </Box>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                        <Chip 
                            label={`${row.discount}% OFF`} 
                            size="small"
                            sx={{ 
                                fontWeight: 700, 
                                bgcolor: '#ecfdf5', 
                                color: '#10b981',
                                borderRadius: 1,
                                px: 0.5
                            }} 
                        />
                    </StyledTableCell>

                    {/* Update Button */}
                    <StyledTableCell align="center">
                    <Button 
                        size="small" 
                        sx={{ 
                            minWidth: 'auto',
                            color: '#0f172a',
                            bgcolor: '#f1f5f9',
                            borderRadius: 1,
                            p: 1,
                            '&:hover': { bgcolor: '#e2e8f0' }
                        }}
                    >
                        <Edit fontSize="small" />
                    </Button>
                    </StyledTableCell>

                    {/* Delete Button */}
                    <StyledTableCell align="center">
                    <IconButton 
                        onClick={() => handleDelete(row.id)} 
                        size="small"
                        sx={{ 
                            color: "#ef4444",
                            bgcolor: 'rgba(239, 68, 68, 0.05)',
                            borderRadius: 1,
                            p: 1,
                            '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.15)' } 
                        }}
                    >
                        <Delete fontSize="small" />
                    </IconButton>
                    </StyledTableCell>
                </StyledTableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
