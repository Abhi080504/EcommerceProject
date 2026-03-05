import React, { useEffect } from 'react'
import { Paper, Typography, Box, Avatar, Divider, Chip } from '@mui/material'
import { AccountCircle, Email, Shield, Phone, Person } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '../../../State/hooks';
import { loadUserProfile } from '../../../State/Auth/authSlice';

const AdminAccount = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state: any) => state.auth);

    return (
        <div className='p-5'>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">My Profile</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your admin account details</p>
                </div>
                <Chip
                    icon={<Shield fontSize='small' />}
                    label="Administrator"
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 'bold' }}
                />
            </div>

            <Paper elevation={0} className="p-8 rounded-xl border border-gray-100 shadow-sm max-w-3xl mx-auto bg-white">
                <div className="flex flex-col items-center mb-8">
                    <Avatar sx={{ width: 100, height: 100, bgcolor: '#0f172a', fontSize: '2.5rem' }}>
                        {user?.fullName ? user.fullName[0].toUpperCase() : 'A'}
                    </Avatar>
                    <Typography variant="h5" className="mt-4 font-bold text-gray-800">
                        {user?.fullName || "Admin User"}
                    </Typography>
                    <Typography variant="body2" className="text-gray-500">Super Admin Access</Typography>
                </div>

                <Divider className="mb-6" />

                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="bg-white p-2 rounded-full shadow-sm text-gray-600">
                            <Person />
                        </div>
                        <div>
                            <Typography variant="caption" className="text-gray-500 block uppercase tracking-wider font-semibold">Full Name</Typography>
                            <Typography variant="body1" className="text-gray-800 font-medium">{user?.fullName || "N/A"}</Typography>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="bg-white p-2 rounded-full shadow-sm text-gray-600">
                            <Email />
                        </div>
                        <div>
                            <Typography variant="caption" className="text-gray-500 block uppercase tracking-wider font-semibold">Email Directory</Typography>
                            <Typography variant="body1" className="text-gray-800 font-medium">{user?.email || "N/A"}</Typography>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="bg-white p-2 rounded-full shadow-sm text-gray-600">
                            <Phone />
                        </div>
                        <div>
                            <Typography variant="caption" className="text-gray-500 block uppercase tracking-wider font-semibold">Mobile</Typography>
                            <Typography variant="body1" className="text-gray-800 font-medium">{user?.mobile || "N/A"}</Typography>
                        </div>
                    </div>
                </div>

            </Paper>
        </div>
    )
}

export default AdminAccount
