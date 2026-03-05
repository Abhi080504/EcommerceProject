import React, { useEffect, useState } from 'react'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
  styled,
  Button,
  Chip,
  Menu,
  Snackbar,
  Alert
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '../State/hooks'
import { fetchSellers, updateSellerStatus } from '../State/Seller/sellerSlice'

const accountStatusOptions = [
  { status: 'PENDING_VERIFICATION', title: 'Pending Verification', description: 'Account is verified', color: 'warning' },
  { status: 'ACTIVE', title: 'Active', description: 'Account is active and in good state', color: 'success' },
  { status: 'SUSPENDED', title: 'Suspended', description: 'Account is temporarily suspended', color: 'error' },
  { status: 'DEACTIVATED', title: 'Deactivated', description: 'Account is deactivated', color: 'default' },
  { status: 'BANNED', title: 'Banned', description: 'Account is permanently banned', color: 'error' },
  { status: 'CLOSED', title: 'Closed', description: 'Account is permanently closed', color: 'default' },
];

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

const SellersTable = () => {
  const dispatch = useAppDispatch();
  const { sellers, loading } = useAppSelector((state: any) => state.seller);
  const [accountStatus, setAccountStatus] = useState("ACTIVE");

  // Menu State for Change Status
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedSellerId, setSelectedSellerId] = React.useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchSellers({ status: accountStatus }));
  }, [accountStatus, dispatch]);

  const handleStatusChange = (event: any) => {
    setAccountStatus(event.target.value)
  }

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedSellerId(id);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedSellerId(null);
  };

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleUpdateStatus = (status: string) => {
    if (selectedSellerId) {
      dispatch(updateSellerStatus({ id: selectedSellerId, status }))
        // @ts-ignore
        .unwrap()
        .then(() => {
          setSnackbar({ open: true, message: "Status updated successfully", severity: "success" });
        })
        .catch(() => {
          setSnackbar({ open: true, message: "Failed to update status", severity: "error" });
        });
      handleCloseMenu();
    }
  }

  const getStatusColor = (status: string) => {
    const option = accountStatusOptions.find(opt => opt.status === status);
    return (option?.color || 'default') as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
  }

  return (
    <div className="p-2">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Sellers</h1>

        <div className="w-60">
          <FormControl fullWidth size="small">
            <InputLabel id="account-status-label">Account Status</InputLabel>
            <Select
              labelId="account-status-label"
              id="account-status-select"
              value={accountStatus}
              label="Account Status"
              onChange={handleStatusChange}
              sx={{ borderRadius: '8px' }}
            >
              {accountStatusOptions.map((item) => (
                <MenuItem key={item.status} value={item.status}>
                  {item.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <TableContainer component={Paper} elevation={0} sx={{
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #e2e8f0"
      }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Seller Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Mobile</StyledTableCell>
              <StyledTableCell>GSTIN</StyledTableCell>
              <StyledTableCell>Business Name</StyledTableCell>
              <StyledTableCell align="center">Account Status</StyledTableCell>
              <StyledTableCell align="center">Change Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sellers.map((row: any) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  {row.sellerName}
                </StyledTableCell>
                <StyledTableCell>{row.email}</StyledTableCell>
                <StyledTableCell>{row.mobile}</StyledTableCell>
                <StyledTableCell>{row.gstin}</StyledTableCell>
                <StyledTableCell>{row.bussinessDetails?.bussinessName}</StyledTableCell>
                <StyledTableCell align="center">
                  <Chip
                    label={row.accountStatus}
                    color={getStatusColor(row.accountStatus)}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 'bold' }}
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={(e) => handleOpenMenu(e, row.id)}
                    sx={{
                      textTransform: 'none',
                      borderRadius: '8px',
                      boxShadow: 'none',
                      backgroundColor: '#0f172a',
                      '&:hover': {
                        backgroundColor: '#334155',
                        boxShadow: 'none'
                      }
                    }}
                  >
                    Change Status
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Status Selection Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {accountStatusOptions.map((option) => (
          <MenuItem key={option.status} onClick={() => handleUpdateStatus(option.status)}>
            {option.title}
          </MenuItem>
        ))}
      </Menu>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </div>
  )
}

export default SellersTable