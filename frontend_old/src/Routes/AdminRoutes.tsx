import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SellersTable from '../Seller/SellersTable'
import Coupon from '../admin/pages/dashboard/Coupon/Coupon'
import AddNewCouponForm from '../admin/pages/dashboard/Coupon/AddNewCouponForm'
import GridTable from '../admin/pages/dashboard/HomePage/GridTable'
import ElectronicTable from '../admin/pages/dashboard/HomePage/ElectronicTable'
import AdminLogin from '../admin/pages/Auth/AdminLogin'
import AdminAuthWrapper from '../admin/pages/Auth/AdminAuthWrapper'
import AdminAccount from '../admin/pages/Account/AdminAccount'
import AdminDashboardHome from '../admin/pages/dashboard/HomePage/AdminDashboardHome'
import HomeCategoryTable from '../admin/pages/dashboard/HomePage/HomeCategoryTable'
import Deal from '../admin/pages/dashboard/HomePage/Deal'

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<AdminAuthWrapper><AdminDashboardHome /></AdminAuthWrapper>} />

      <Route path='/sellers' element={<AdminAuthWrapper><SellersTable /></AdminAuthWrapper>} />
      <Route path='/coupon' element={<AdminAuthWrapper><Coupon /></AdminAuthWrapper>} />
      <Route path='/add-coupon' element={<AdminAuthWrapper><AddNewCouponForm /></AdminAuthWrapper>} />
      <Route path='/deals' element={<AdminAuthWrapper><Deal /></AdminAuthWrapper>} />
      <Route path='/home-category' element={<AdminAuthWrapper><HomeCategoryTable /></AdminAuthWrapper>} />
      <Route path='/account' element={<AdminAuthWrapper><AdminAccount /></AdminAuthWrapper>} />
      <Route path='/login' element={<AdminLogin />} />
    </Routes>
  )
}

export default AdminRoutes