import React from 'react';
import ProfileFieldCard from '../../../component/ProfileFieldCard';
import { Divider, Paper, Avatar } from '@mui/material';
import { useAppSelector } from '../../../State/hooks';

const UserDetails = () => {
    const { user } = useAppSelector(state => state.auth);

    return (
        <div className='space-y-6'>
            {/* Header / Avatar Section */}
            <div className='flex items-center gap-4'>
                <Avatar sx={{ width: 80, height: 80, bgcolor: '#D97706', fontSize: '2rem' }}>
                    {user?.fullName?.[0]?.toUpperCase()}
                </Avatar>
                <div>
                    <h1 className='text-2xl font-bold text-gray-800'>{user?.fullName}</h1>
                    <p className='text-gray-500'>Welcome back!</p>
                </div>
            </div>

            <Paper elevation={0} className='border border-gray-200 rounded-xl overflow-hidden'>
                <div className='p-5 bg-gray-50 border-b border-gray-200'>
                    <h2 className='font-bold text-gray-700'>Personal Information</h2>
                </div>
                <div className='p-6 space-y-2'>
                    <ProfileFieldCard keys='Full Name' value={user?.fullName || "N/A"} />
                    <Divider variant="middle" sx={{ my: 2, borderStyle: 'dashed' }} />
                    <ProfileFieldCard keys='Email Address' value={user?.email || "N/A"} />
                    <Divider variant="middle" sx={{ my: 2, borderStyle: 'dashed' }} />
                    <ProfileFieldCard keys='Mobile Number' value={user?.mobile || "Not Provided"} />
                </div>
            </Paper>
        </div>
    );
}

export default UserDetails;
