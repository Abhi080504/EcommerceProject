import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { AccountCircle, AttachMoney, Inventory, ShoppingBag, TrendingUp } from '@mui/icons-material';

const stats = [
    { title: 'Total Sales', value: '₹1,24,500', icon: <AttachMoney />, color: '#00927c', bgcolor: 'linear-gradient(135deg, #00927c 0%, #0f9f8f 100%)', trend: '+12.5%' },
    { title: 'Total Orders', value: '450', icon: <ShoppingBag />, color: '#3B82F6', bgcolor: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)', trend: '+8.2%' },
    { title: 'Total Products', value: '1,200', icon: <Inventory />, color: '#F59E0B', bgcolor: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)', trend: '+5.4%' },
    { title: 'Total Sellers', value: '85', icon: <AccountCircle />, color: '#8B5CF6', bgcolor: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)', trend: '+3.1%' },
];

const AdminDashboardHome = () => {
    return (
        <Box>
            {/* Header with gradient text */}
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
                    Dashboard Overview
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Welcome back! Here's what's happening with your store today.
                </Typography>
            </Box>

            {/* Enhanced Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
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
                                    boxShadow: '0 20px 40px rgba(0, 146, 124, 0.15)',
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
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: 2,
                                        bgcolor: '#00927c10',
                                        color: '#00927c'
                                    }}
                                >
                                    <TrendingUp sx={{ fontSize: 16 }} />
                                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                        {item.trend}
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography variant="body2" sx={{ color: '#64748b', mb: 1, fontWeight: 500 }}>
                                {item.title}
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                {item.value}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 4, 
                            borderRadius: 3, 
                            border: '1px solid #e2e8f0', 
                            height: 450,
                            background: '#ffffff',
                            transition: 'all 0.3s',
                            '&:hover': {
                                boxShadow: '0 8px 24px rgba(0, 146, 124, 0.08)'
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                Sales Overview
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                {['Week', 'Month', 'Year'].map((period) => (
                                    <Typography
                                        key={period}
                                        variant="caption"
                                        sx={{
                                            px: 2,
                                            py: 0.75,
                                            borderRadius: 2,
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            bgcolor: period === 'Month' ? '#00927c' : '#f1f5f9',
                                            color: period === 'Month' ? '#ffffff' : '#64748b',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                bgcolor: period === 'Month' ? '#00927c' : '#e2e8f0'
                                            }
                                        }}
                                    >
                                        {period}
                                    </Typography>
                                ))}
                            </Box>
                        </Box>
                        <Box sx={{ 
                            width: '100%', 
                            height: 'calc(100% - 60px)', 
                            background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)', 
                            borderRadius: 2, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            border: '2px dashed #cbd5e1'
                        }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" sx={{ color: '#94a3b8', fontWeight: 700, mb: 1 }}>
                                    Chart Area
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Chart visualization requires 'recharts' dependency
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 3,
                            pr: 2,
                            borderRadius: 3, 
                            border: '1px solid #e2e8f0', 
                            height: 450,
                            background: '#ffffff',
                            transition: 'all 0.3s',
                            '&:hover': {
                                boxShadow: '0 8px 24px rgba(0, 146, 124, 0.08)'
                            }
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: '#1e293b', pr: 1 }}>
                            Recent Activity
                        </Typography>
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: 2, 
                            maxHeight: 365, 
                            overflowY: 'auto', 
                            overflowX: 'hidden',
                            pr: 1,
                            '&::-webkit-scrollbar': {
                                width: '6px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: '#f1f5f9',
                                borderRadius: '10px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: '#cbd5e1',
                                borderRadius: '10px',
                                '&:hover': {
                                    background: '#94a3b8',
                                }
                            }
                        }}>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Box 
                                    key={i} 
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        p: 2,
                                        borderRadius: 2,
                                        border: '1px solid #f1f5f9',
                                        transition: 'all 0.2s',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            bgcolor: '#f8fafc',
                                            borderColor: '#00927c'
                                        }
                                    }}
                                >
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', mb: 0.5 }}>
                                            Order #23{i}2
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                                            2 mins ago
                                        </Typography>
                                    </Box>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            fontWeight: 700, 
                                            color: '#00927c',
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: 2,
                                            bgcolor: '#00927c10'
                                        }}
                                    >
                                        +₹1,200
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboardHome;
