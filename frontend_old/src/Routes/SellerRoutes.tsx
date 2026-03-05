import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Products from '../Seller/pages/Products/Products'
import AddProduct from '../Seller/pages/Products/AddProduct'
import Orders from '../Seller/pages/Orders/Orders'
import Profile from '../Seller/pages/Account/Profile'
import Transaction from '../Seller/pages/Payment/Transaction'
import Payment from '../Seller/pages/Payment/Payment'
import SellerDashboard from '../Seller/pages/SellerDashboard/SellerDashboard'
const SellerRoutes = () => {
  return (
    <div>
      <Routes>
        {/* <Route path='/*' element={<SellerDashboard/>}/> */}
        <Route path='products' element={<Products />} />
        <Route path='add-product' element={<AddProduct />} />
        <Route path='update-product/:productId' element={<AddProduct />} />
        <Route path='orders' element={<Orders />} />
        <Route path='account' element={<Profile />} />
        <Route path='transaction' element={<Transaction />} />
        <Route path='payment' element={<Payment />} />
      </Routes>
    </div>
  )
}

export default SellerRoutes
