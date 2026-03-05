import React, { useEffect } from 'react'
import { Paper, Typography, Box, Avatar, Chip, Grid } from '@mui/material'
import { Email, Shield, Phone, Person } from '@mui/icons-material'
import { useAppSelector } from '../../../State/hooks';

const AdminAccount = () => {
    const { user } = useAppSelector((state: any) => state.auth);

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 4, 
                backgroundColor: '#fff', 
                p: 3, 
                borderRadius: 3, 
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                maxWidth: 800,
                mx: 'auto'
            }}>
                <Box>
                    <Typography variant="h5" sx={{ 
                        fontWeight: 800, 
                        background: 'linear-gradient(135deg, #00927c 0%, #0f9f8f 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.5px' 
                    }}>
                        My Profile
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                        Manage your admin account details
                    </Typography>
                </Box>
                <Chip
                    icon={<Shield style={{ fontSize: 16 }} />}
                    label="Administrator"
                    sx={{ 
                        fontWeight: 700,
                        backgroundColor: '#ecfdf5', 
                        color: '#059669',
                        border: '1px solid #10b981',
                        '& .MuiChip-icon': { color: '#059669' }
                    }}
                />
            </Box>

            <Paper 
                elevation={0} 
                sx={{ 
                    p: 0, 
                    borderRadius: 3, 
                    border: '1px solid #e2e8f0', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    maxWidth: 800, 
                    mx: 'auto', 
                    overflow: 'hidden' 
                }}
            >
                <Box sx={{ 
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
                    p: 4, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    color: 'white'
                }}>
                    <Avatar sx={{ 
                        width: 120, 
                        height: 120, 
                        bgcolor: '#00927c', 
                        fontSize: '3rem', 
                        fontWeight: 700,
                        border: '4px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                        mb: 2
                    }}>
                        {user?.fullName ? user.fullName[0].toUpperCase() : 'A'}
                    </Avatar>
                    <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
                        {user?.fullName || "Admin User"}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#94a3b8', mt: 0.5 }}>
                        Super Admin Access
                    </Typography>
                </Box>

                <Box sx={{ p: 4 }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                             <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Person sx={{ color: '#00927c' }} /> Personal Information
                            </Typography>
                        </Grid>
                        
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ 
                                p: 2.5, 
                                borderRadius: 2, 
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                transition: 'all 0.2s',
                                '&:hover': { borderColor: '#00927c', bgcolor: '#f0fdfa' }
                            }}>
                                <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: '#f1f5f9', color: '#64748b' }}>
                                    <Person />
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>
                                        Full Name
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 600 }}>
                                        {user?.fullName || "N/A"}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ 
                                p: 2.5, 
                                borderRadius: 2, 
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                transition: 'all 0.2s',
                                '&:hover': { borderColor: '#00927c', bgcolor: '#f0fdfa' }
                            }}>
                                <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: '#f1f5f9', color: '#64748b' }}>
                                    <Email />
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>
                                        Email Address
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 600 }}>
                                        {user?.email || "N/A"}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ 
                                p: 2.5, 
                                borderRadius: 2, 
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                transition: 'all 0.2s',
                                '&:hover': { borderColor: '#00927c', bgcolor: '#f0fdfa' }
                            }}>
                                <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: '#f1f5f9', color: '#64748b' }}>
                                    <Phone />
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>
                                        Mobile Number
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#1e293b', fontWeight: 600 }}>
                                        {user?.mobile || "N/A"}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    )
}

export default AdminAccount
