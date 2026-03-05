import React, { useEffect } from 'react'
import AdminDrawerList from '../../components/AdminDrawerList'
import AdminRoutes from '../../../Routes/AdminRoutes'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../State/hooks'

const AdminDashboard = () => {
  const toggleDrawer = () => { }
  const navigate = useNavigate();
  // Instead, rely on user state logic below or redirect if user loading finishes and user is null
  const { user, loading: authLoading, isAuthChecked } = useAppSelector(state => state.auth);

  useEffect(() => {
    // Only redirect if we have FINISHED checking auth and user is still null
    if (isAuthChecked && !authLoading && !user) {
      navigate("/admin/login");
    }
  }, [authLoading, user, isAuthChecked, navigate]);

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role !== "ROLE_ADMIN" && user.role !== "ROLE_SUPER") {
        navigate("/");
      }
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (user && user.role !== "ROLE_ADMIN" && user.role !== "ROLE_SUPER") {
    return <div className="h-screen flex items-center justify-center text-red-500">Access Denied</div>;
  }

  return (
    <div>
      <div className='lg:flex lg:h-[90vh]'>
        <section className='hidden lg:block h-full'>
          <AdminDrawerList toggleDrawer={toggleDrawer} />
        </section>
        <section className='p-10 w-full lg:w-[80%] overflow-y-auto bg-[#f4f6f8]'>
          <AdminRoutes />
        </section>

      </div>
    </div>
  )
}

export default AdminDashboard