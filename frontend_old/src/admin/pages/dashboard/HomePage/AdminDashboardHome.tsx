import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { AccountCircle, AttachMoney, Inventory, ShoppingBag } from '@mui/icons-material';

const stats = [
    { title: 'Total Sales', value: '₹1,24,500', icon: <AttachMoney />, color: '#10B981', bgcolor: '#D1FAE5' },
    { title: 'Total Orders', value: '450', icon: <ShoppingBag />, color: '#3B82F6', bgcolor: '#DBEAFE' },
    { title: 'Total Products', value: '1,200', icon: <Inventory />, color: '#F59E0B', bgcolor: '#FEF3C7' },
    { title: 'Total Sellers', value: '85', icon: <AccountCircle />, color: '#8B5CF6', bgcolor: '#EDE9FE' },
];

const AdminDashboardHome = () => {
    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }} className="text-gray-800">
                Dashboard Overview
            </Typography>

            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((item, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 4,
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }
                            }}
                        >
                            <div>
                                <Typography variant="subtitle2" sx={{ color: '#64748b', mb: 1 }}>
                                    {item.title}
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                                    {item.value}
                                </Typography>
                            </div>
                            <Box
                                sx={{
                                    p: 1.5,
                                    borderRadius: '50%',
                                    color: item.color,
                                    backgroundColor: item.bgcolor,
                                    display: 'flex'
                                }}
                            >
                                {item.icon}
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Charts Section Placeholder */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', height: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', alignSelf: 'flex-start' }}>Sales Overview</Typography>
                        <Typography variant="body1" color="text.secondary">Chart visualization requires 'recharts' dependency.</Typography>
                        <div className="w-full h-full bg-blue-50 mt-4 rounded-xl flex items-center justify-center">
                            <span className="text-blue-300 font-bold text-4xl">Chart Area</span>
                        </div>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', height: 400 }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Recent Activity</Typography>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">Order #23{i}2</p>
                                        <p className="text-xs text-gray-500">2 mins ago</p>
                                    </div>
                                    <span className="text-emerald-600 text-sm font-medium">+₹1,200</span>
                                </div>
                            ))}
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboardHome;
