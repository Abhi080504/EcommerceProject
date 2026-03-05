import React, { useEffect } from 'react'
import AdminDrawerList from '../../components/AdminDrawerList'
import AdminRoutes from '../../../Routes/AdminRoutes'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../../State/hooks'

const AdminDashboard = () => {
  const toggleDrawer = () => { }
  const navigate = useNavigate();
  const location = useLocation();
  // Instead, rely on user state logic below or redirect if user loading finishes and user is null
  const { user, loading: authLoading, isAuthChecked } = useAppSelector(state => state.auth);

  // Check if we're on the login page
  const isLoginPage = location.pathname === '/admin/login';

  useEffect(() => {
    // Only redirect if we have FINISHED checking auth and user is still null
    if (isAuthChecked && !authLoading && !user && !isLoginPage) {
      navigate("/admin/login");
    }
  }, [authLoading, user, isAuthChecked, navigate, isLoginPage]);

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role !== "ROLE_ADMIN" && user.role !== "ROLE_SUPER") {
        navigate("/");
      }
    }
  }, [user, authLoading, navigate]);

  if (authLoading && !isLoginPage) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (user && user.role !== "ROLE_ADMIN" && user.role !== "ROLE_SUPER" && !isLoginPage) {
    return <div className="h-screen flex items-center justify-center text-red-500">Access Denied</div>;
  }

  // If on login page, render only the routes without sidebar
  if (isLoginPage) {
    return (
      <div className="w-full h-screen">
        <AdminRoutes />
      </div>
    );
  }

  // Otherwise, render with sidebar layout
  return (
    <div>
      <div className='lg:flex lg:h-screen'>
        <section className='hidden lg:block h-full'>
          <AdminDrawerList toggleDrawer={toggleDrawer} />
        </section>
        <section className='relative w-full lg:w-[80%] h-full overflow-hidden bg-[#f4f6f8]'>
          
          {/* Animation Styles */}
          <style>
            {`
              @keyframes slowPan {
                0% { background-position: 0% 0%; }
                50% { background-position: 100% 100%; }
                100% { background-position: 0% 0%; }
              }
            `}
          </style>

          {/* Animated Background Layer */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url('/adminbg.png')`,
              backgroundSize: '150% 150%',
              animation: 'slowPan 60s ease-in-out infinite',
              opacity: 0.25, // Increased opacity for better visibility
              filter: 'brightness(0.85) grayscale(20%)', // Increased brightness
              zIndex: 0,
              pointerEvents: 'none'
            }}
          />

          {/* Scrollable Content Layer */}
          <div className='p-10 w-full h-full overflow-y-auto relative z-10'>
            <AdminRoutes />
          </div>
        </section>

      </div>
    </div>
  )
}

export default AdminDashboard