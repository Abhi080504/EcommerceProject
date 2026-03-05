import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../State/hooks";
import { updateSeller } from "../../../State/Auth/authSlice";
import { 
  Snackbar, 
  Alert, 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Grid, 
  TextField, 
  Button,
  Divider,
  CircularProgress,
  Chip
} from "@mui/material";
import StoreIcon from '@mui/icons-material/Store';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import VerifiedIcon from '@mui/icons-material/Verified';

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const seller = useAppSelector((state: any) => state.auth?.seller);

  const [editMode, setEditMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    sellerName: "",
    email: "",
    mobile: "",
    bussinessDetails: {
      bussinessName: ""
    }
  });

  useEffect(() => {
    if (seller) {
      setForm({
        sellerName: seller.sellerName || "",
        email: seller.email || "",
        mobile: seller.mobile || "",
        bussinessDetails: {
          bussinessName: seller.bussinessDetails?.bussinessName || ""
        }
      });
    }
  }, [seller]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "storeName") {
      setForm({
        ...form,
        bussinessDetails: { ...form.bussinessDetails, bussinessName: value }
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSave = () => {
    setSaving(true);
    dispatch(updateSeller(form))
      .unwrap()
      .then(() => {
        setEditMode(false);
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.error("Update failed", err);
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const stats = [
    { label: "Products Listed", value: "42", color: '#F59E0B' },
    { label: "Orders Fulfilled", value: "117", color: '#00927c' },
    { label: "Pending Orders", value: "6", color: '#3B82F6' },
    { label: "Merchant Status", value: "Active", color: '#10B981', isStatus: true },
  ];

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
            <PersonIcon sx={{ color: '#00927c' }} /> Account Settings
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
            Management of your personal profile and business identity
          </Typography>
        </Box>
        <Button
          variant={editMode ? "outlined" : "contained"}
          startIcon={editMode ? null : <EditIcon />}
          onClick={() => editMode ? setEditMode(false) : setEditMode(true)}
          sx={{
            bgcolor: editMode ? 'transparent' : '#0f172a',
            color: editMode ? '#64748b' : '#ffffff',
            borderColor: editMode ? '#e2e8f0' : 'transparent',
            textTransform: 'none',
            borderRadius: 2.5,
            fontWeight: 600,
            px: 3,
            '&:hover': { bgcolor: editMode ? '#f8fafc' : '#334155', borderColor: editMode ? '#cbd5e1' : 'transparent' }
          }}
        >
          {editMode ? "Cancel Editing" : "Manage Profile"}
        </Button>
      </Paper>

      <Grid container spacing={4}>
        {/* Profile Card */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 4 }}>
              <Avatar 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  bgcolor: '#00927c10', 
                  color: '#00927c',
                  border: '3px solid #00927c20',
                  fontSize: 40,
                  fontWeight: 800
                }}
              >
                {seller?.sellerName?.charAt(0) || "S"}
              </Avatar>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
                    {seller?.sellerName || "Merchant Partner"}
                  </Typography>
                  <VerifiedIcon sx={{ color: '#3B82F6', fontSize: 20 }} />
                </Box>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StoreIcon sx={{ fontSize: 16 }} /> {seller?.bussinessDetails?.bussinessName || "Official Store"}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                   <Chip label="Verified Seller" size="small" sx={{ bgcolor: '#f0fdf4', color: '#166534', fontWeight: 700, fontSize: 11 }} />
                   <Chip label="Level 2 Merchant" size="small" sx={{ bgcolor: '#eff6ff', color: '#1e40af', fontWeight: 700, fontSize: 11 }} />
                </Box>
              </Box>
            </Box>

            <Divider sx={{ mb: 4, borderStyle: 'dashed' }} />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 3 }}>
                   <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', mb: 1, display: 'block' }}>
                     Full Name
                   </Typography>
                   <TextField
                      fullWidth
                      name="sellerName"
                      value={form.sellerName}
                      disabled={!editMode}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ color: '#94a3b8', mr: 1, fontSize: 18 }} />,
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                   />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 3 }}>
                   <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', mb: 1, display: 'block' }}>
                     Email Address
                   </Typography>
                   <TextField
                      fullWidth
                      name="email"
                      value={form.email}
                      disabled={!editMode}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: <MailIcon sx={{ color: '#94a3b8', mr: 1, fontSize: 18 }} />,
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                   />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 3 }}>
                   <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', mb: 1, display: 'block' }}>
                     Contact Number
                   </Typography>
                   <TextField
                      fullWidth
                      name="mobile"
                      value={form.mobile}
                      disabled={!editMode}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: <PhoneIcon sx={{ color: '#94a3b8', mr: 1, fontSize: 18 }} />,
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                   />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 3 }}>
                   <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', mb: 1, display: 'block' }}>
                     Business Name
                   </Typography>
                   <TextField
                      fullWidth
                      name="storeName"
                      value={form.bussinessDetails.bussinessName}
                      disabled={!editMode}
                      onChange={handleChange}
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: <BusinessIcon sx={{ color: '#94a3b8', mr: 1, fontSize: 18 }} />,
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                   />
                </Box>
              </Grid>
            </Grid>

            {editMode && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  onClick={handleSave}
                  disabled={saving}
                  sx={{
                    bgcolor: '#00927c',
                    color: '#ffffff',
                    px: 4,
                    py: 1.2,
                    borderRadius: 2.5,
                    fontWeight: 700,
                    boxShadow: '0 8px 16px rgba(0, 146, 124, 0.2)',
                    '&:hover': { bgcolor: '#007a68', boxShadow: '0 12px 20px rgba(0, 146, 124, 0.3)' }
                  }}
                >
                  {saving ? "Saving..." : "Commit Changes"}
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Stats Column */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Grid container spacing={3}>
            {stats.map((stat, idx) => (
              <Grid size={{ xs: 6, lg: 12 }} key={idx}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.05)' }
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 1, fontWeight: 600 }}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: stat.isStatus ? '#10B981' : '#1e293b' }}>
                    {stat.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%', borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
          Your profile has been updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;

