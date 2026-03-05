import React from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Avatar
} from '@mui/material'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Transaction from './Transaction';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../State/Store';
import { fetchSellerTransactions } from '../../../State/Seller/transactionSlice';

const Payment = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions } = useSelector((state: RootState) => state.transaction);

  useEffect(() => {
    // Ensuring transactions are fetched when landing on the Payment tab directly
    dispatch(fetchSellerTransactions());
  }, [dispatch]);

  const { lifetimeEarnings, pendingClearance } = useMemo(() => {
    let lifetime = 0;
    let pending = 0;

    transactions.forEach(txn => {
      const amount = txn.order?.totalSellingPrice || 0;
      const status = txn.order?.paymentStatus;
      if (status === 'COMPLETED') {
        lifetime += amount;
      } else if (status === 'PENDING') {
        pending += amount;
      }
    });

    return {
      lifetimeEarnings: lifetime.toLocaleString('en-IN'),
      pendingClearance: pending.toLocaleString('en-IN')
    };
  }, [transactions]);

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
            <AccountBalanceWalletIcon sx={{ color: '#00927c' }} /> Financial Overview
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
            Manage your earnings, payouts and transaction history
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#0f172a',
            textTransform: 'none',
            borderRadius: 2.5,
            fontWeight: 600,
            px: 3,
            '&:hover': { bgcolor: '#334155' }
          }}
        >
          Withdraw Funds
        </Button>
      </Paper>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#ffffff',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1, fontWeight: 500 }}>
                Total Lifetime Earnings
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                ₹{lifetimeEarnings}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon sx={{ color: '#10B981', fontSize: 20 }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#10B981' }}>
                  +15% from last month
                </Typography>
              </Box>
            </Box>
            <AccountBalanceWalletIcon
              sx={{
                position: 'absolute',
                right: -20,
                bottom: -20,
                fontSize: 140,
                opacity: 0.05,
                transform: 'rotate(-15deg)'
              }}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: '#ffffff',
              border: '1px solid #e2e8f0',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: '#f0fdf4', color: '#166534' }}>
                <HistoryIcon />
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                Last Payout
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
              ₹0.00
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Next payout scheduled for <span style={{ fontWeight: 600, color: '#0f172a' }}>Feb 28, 2026</span>
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: '#ffffff',
              border: '1px solid #e2e8f0',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: '#fff7ed', color: '#9a3412' }}>
                <TrendingUpIcon />
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                Pending Clearance
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
              ₹{pendingClearance}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Funds currently under standard 7-day review
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Transaction History */}
      <Box sx={{ mt: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <HistoryIcon sx={{ color: '#64748b' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Recent Transactions
          </Typography>
        </Box>
        <Transaction />
      </Box>
    </Box>
  )
}

export default Payment
