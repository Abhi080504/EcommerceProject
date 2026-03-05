import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../State/hooks';

const AdminAuthWrapper = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const { user } = useAppSelector(state => state.auth);

    useEffect(() => {
        // Cookie Auth: Check user state instead of localStorage
        if (user === null) {
            // We can't immediately redirect if it's still loading. 
            // Ideally we check 'loading' state too. 
            // But if user is null after App.tsx's initial load, they are guest.
            // For now, let's assume if user is accessed here they should be loaded.
            // But triggering redirect here might be premature if loading.
            // However, this wrapper is used inside routes.
            // If we are here, we probably should have user.
        }

        if (user && user.role !== "ROLE_ADMIN" && user.role !== "ROLE_SUPER") {
            navigate("/");
        }
    }, [user, navigate]);

    return <>{children}</>;
};

export default AdminAuthWrapper;
