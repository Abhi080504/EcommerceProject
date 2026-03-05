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
  tableCellClasses
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../../State/hooks";
import { fetchDeals, deleteDeal } from "../../../../State/Deals/dealSlice";

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
  '&:nth-of-type(odd)': { backgroundColor: '#f8fafc' },
  '&:hover': { backgroundColor: '#e2e8f0', transition: 'background-color 0.2s ease' },
  '&:last-child td, &:last-child th': { border: 0 },
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
    <TableContainer component={Paper} elevation={0} sx={{
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      borderRadius: "12px",
      overflow: "hidden",
      border: "1px solid #e2e8f0"
    }}>
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
              <StyledTableCell>{index + 1}</StyledTableCell>
              <StyledTableCell align="center">
                <div className="flex justify-center">
                  <img src={row.category.image} alt={row.category.name} className="w-10 h-10 object-contain rounded-md border border-gray-200" />
                </div>
              </StyledTableCell>
              <StyledTableCell align="left" sx={{ fontWeight: 500 }}>{row.category.name}</StyledTableCell>
              <StyledTableCell align="center">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                  {row.discount}%
                </span>
              </StyledTableCell>

              {/* Update Button */}
              <StyledTableCell align="center">
                <Button size="small" sx={{ color: '#0f172a' }}>
                  <Edit fontSize="small" />
                </Button>
              </StyledTableCell>

              {/* Delete Button */}
              <StyledTableCell align="center">
                <IconButton onClick={() => handleDelete(row.id)} size="small">
                  <Delete fontSize="small" sx={{ color: "#ef4444" }} />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
