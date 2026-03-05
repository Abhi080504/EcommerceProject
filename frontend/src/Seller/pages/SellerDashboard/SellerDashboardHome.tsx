import React from "react";
import { useAppSelector } from "../../../State/hooks";
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Avatar 
} from '@mui/material';
import { 
  Inventory, 
  ShoppingBag, 
  PendingActions, 
  AccountBalanceWallet, 
  TrendingUp, 
  Store 
} from '@mui/icons-material';

const SellerDashboardHome = () => {
  const { seller } = useAppSelector((state) => state.auth);

  const stats = [
    { 
      label: "Total Products", 
      value: "42", 
      icon: <Inventory />, 
      color: '#F59E0B', 
      bgcolor: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)', 
      trend: '+5.4%' 
    },
    { 
      label: "Orders Completed", 
      value: "117", 
      icon: <ShoppingBag />, 
      color: '#8B5CF6', 
      bgcolor: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)', 
      trend: '+12.5%' 
    },
    { 
      label: "Pending Orders", 
      value: "6", 
      icon: <PendingActions />, 
      color: '#3B82F6', 
      bgcolor: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)', 
      trend: '+2.1%' 
    },
    { 
      label: "Total Revenue", 
      value: "₹1,24,500", 
      icon: <AccountBalanceWallet />, 
      color: '#00927c', 
      bgcolor: 'linear-gradient(135deg, #00927c 0%, #0f9f8f 100%)', 
      trend: '+8.2%' 
    },
  ];

  return (
    <Box>
      {/* SELLER PROFILE HEADER */}
      <Box sx={{ mb: 5 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 800, 
            background: 'linear-gradient(135deg, #00927c 0%, #0f9f8f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >
          Seller Overview
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Welcome back! Here's a snapshot of your business performance.
        </Typography>
      </Box>

      {/* SELLER PROFILE CARD */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          mb: 5,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '6px',
            background: 'linear-gradient(to bottom, #00927c, #0f9f8f)',
          }
        }}
      >
        {!seller ? (
          <Typography sx={{ color: '#64748b' }}>Loading seller profile...</Typography>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: '#00927c15', 
                color: '#00927c',
                border: '2px solid #00927c20'
              }}
            >
              <Store sx={{ fontSize: 40 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                {seller?.bussinessDetails?.bussinessName || "Your Store"}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 1 }}>
                   <span style={{ fontWeight: 600, color: '#1e293b' }}>Seller:</span> {seller?.sellerName}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 1 }}>
                   <span style={{ fontWeight: 600, color: '#1e293b' }}>Email:</span> {seller?.email}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 1 }}>
                   <span style={{ fontWeight: 600, color: '#1e293b' }}>Phone:</span> {seller?.mobile}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>

      {/* DASHBOARD STATS */}
      <Grid container spacing={3}>
        {stats.map((item, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { 
                  transform: 'translateY(-8px)', 
                  boxShadow: '0 20px 40px rgba(0, 146, 124, 0.12)',
                  borderColor: '#00927c'
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: item.bgcolor,
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background: item.bgcolor,
                    display: 'flex',
                    color: '#ffffff',
                    boxShadow: `0 8px 16px ${item.color}40`
                  }}
                >
                  {item.icon}
                </Box>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    px: 1,
                    py: 0.5,
                    borderRadius: 1.5,
                    bgcolor: '#00927c10',
                    color: '#00927c'
                  }}
                >
                  <TrendingUp sx={{ fontSize: 14 }} />
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {item.trend}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5, fontWeight: 500 }}>
                {item.label}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>
                {item.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* BOTTOM SECTION PLACEHOLDER */}
      <Box sx={{ mt: 5 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 4, 
            border: '2px dashed #cbd5e1', 
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" sx={{ color: '#94a3b8', fontWeight: 600, mb: 1 }}>
            Advanced Analytics Portal
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Detailed sales charts, regional performance, and inventory forecasts will appear here soon.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default SellerDashboardHome;
