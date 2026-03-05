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
  Alert,
  Box,
  Typography
} from '@mui/material'
import { AccountCircle } from '@mui/icons-material'
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
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
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
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 3 }}>
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
              <AccountCircle sx={{ color: '#00927c' }} /> Sellers Management
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Manage and monitor all seller accounts
            </Typography>
          </Box>

          <FormControl sx={{ minWidth: 240 }} size="small">
            <InputLabel id="account-status-label">Account Status</InputLabel>
            <Select
              labelId="account-status-label"
              id="account-status-select"
              value={accountStatus}
              label="Account Status"
              onChange={handleStatusChange}
              MenuProps={{
                transitionDuration: 0,
                PaperProps: {
                  sx: {
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e2e8f0',
                    mt: 0.5,
                  }
                }
              }}
              sx={{ 
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e2e8f0',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#cbd5e1',
                },
              }}
            >
              {accountStatusOptions.map((item) => (
                <MenuItem key={item.status} value={item.status}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box 
                      sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: item.color === 'success' ? '#10B981' : item.color === 'warning' ? '#F59E0B' : item.color === 'error' ? '#EF4444' : '#94a3b8'
                      }} 
                    />
                    {item.title}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Table Section */}
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
        <Table sx={{ minWidth: 700 }} aria-label="sellers table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Seller Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Mobile</StyledTableCell>
              <StyledTableCell>GSTIN</StyledTableCell>
              <StyledTableCell>Business Name</StyledTableCell>
              <StyledTableCell align="center">Account Status</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Add a simple loading state or keep existing behavior (assuming loading is handled elsewhere or via skeleton)
              // For now, just render empty if not loading and empty
             <TableRow>
                <StyledTableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <Typography variant="body1" sx={{ color: '#64748b' }}>Loading...</Typography>
                </StyledTableCell>
              </TableRow>
            ) : sellers.length > 0 ? (
              sellers.map((row: any) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  {row.sellerName}
                </StyledTableCell>
                <StyledTableCell sx={{ color: '#475569' }}>{row.email}</StyledTableCell>
                <StyledTableCell sx={{ color: '#475569' }}>{row.mobile}</StyledTableCell>
                <StyledTableCell sx={{ color: '#475569', fontFamily: 'monospace', fontSize: 13 }}>{row.gstin}</StyledTableCell>
                <StyledTableCell sx={{ color: '#475569' }}>{row.bussinessDetails?.bussinessName}</StyledTableCell>
                <StyledTableCell align="center">
                  <Chip
                    label={row.accountStatus}
                    color={getStatusColor(row.accountStatus)}
                    size="small"
                    variant="filled"
                    sx={{ 
                      fontWeight: 600,
                      fontSize: 11,
                      letterSpacing: '0.5px',
                      borderRadius: 2,
                      px: 1,
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Button
                    variant="contained"
                    size="small"
                    disableElevation
                    onClick={(e) => handleOpenMenu(e, row.id)}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2,
                      boxShadow: 'none !important',
                      backgroundColor: '#0f172a !important',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: 13,
                      px: 2.5,
                      py: 0.75,
                      minWidth: 130,
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        backgroundColor: '#334155 !important',
                        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.3) !important',
                        transform: 'translateY(-1px)',
                      },
                      '&:active': {
                        backgroundColor: '#334155 !important',
                      },
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    Change Status
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))
            ) : (
              <TableRow>
                <StyledTableCell colSpan={7} align="center" sx={{ py: 8 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                      width: 64, 
                      height: 64, 
                      borderRadius: '50%', 
                      bgcolor: '#f1f5f9', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mb: 1
                    }}>
                      <AccountCircle sx={{ fontSize: 32, color: '#94a3b8' }} />
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#475569' }}>
                      No {accountStatus.toLowerCase().replace('_', ' ')} sellers found
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      Try selecting a different status filter
                    </Typography>
                  </Box>
                </StyledTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Status Selection Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            mt: 1,
          }
        }}
      >
        {accountStatusOptions.map((option) => (
          <MenuItem 
            key={option.status} 
            onClick={() => handleUpdateStatus(option.status)}
            sx={{
              py: 1.5,
              px: 2,
              '&:hover': {
                backgroundColor: '#f8fafc',
              }
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', mb: 0.25 }}>
                {option.title}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                {option.description}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  )
}

export default SellersTable
