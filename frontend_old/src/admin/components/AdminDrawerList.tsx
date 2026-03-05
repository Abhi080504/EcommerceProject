
import React from 'react'
import DrawerList from '../../Customer/components/Navbar/DrawerList'
import {
  AccountBalanceWallet,
  AccountBox,
  Add,
  Category,
  Dashboard,
  ElectricBolt,
  Home,
  IntegrationInstructions,
  LocalOffer,
  Logout
} from '@mui/icons-material'
import { useAppDispatch } from '../../State/hooks'
import { performLogout } from '../../State/Auth/authSlice'
import { useNavigate } from 'react-router-dom'

const AdminDrawerList = ({ toggleDrawer }: any) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(performLogout());
  }

  const menu = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <Dashboard className='text-primary-color' />,
      activeIcon: <Dashboard className='text-white' />,
    },
    {
      name: "Sellers",
      path: "/admin/sellers",
      icon: <AccountBox className='text-primary-color' />,
      activeIcon: <AccountBox className='text-white' />,
    },
    {
      name: "Coupons",
      path: "/admin/coupon",
      icon: <IntegrationInstructions className='text-primary-color' />,
      activeIcon: <IntegrationInstructions className='text-white' />,
    },
    {
      name: "Add New Coupon",
      path: "/admin/add-coupon",
      icon: <Add className='text-primary-color' />,
      activeIcon: <Add className='text-white' />,
    },
    {
      name: "Deals",
      path: "/admin/deals",
      icon: <LocalOffer className='text-primary-color' />,
      activeIcon: <LocalOffer className='text-white' />,
    },
    {
      name: "Home Category",
      path: "/admin/home-category",
      icon: <Category />,
      activeIcon: <Category className='text-white' />
    },
    {
      name: "Electronics Category",
      path: "/admin/electronics-category",
      icon: <ElectricBolt />,
      activeIcon: <ElectricBolt className='text-white' />
    },
  ]

  const menu2 = [
    {
      name: "Account",
      path: "/admin/account",
      icon: <AccountBox className='text-primary-color' />,
      activeIcon: <AccountBox className='text-white' />,
    },
    {
      name: "Logout",
      path: "/",
      icon: <Logout className='text-primary-color' />,
      activeIcon: <Logout className='text-white' />,
      onClick: handleLogout
    },
  ]

  return (
    <DrawerList menu={menu} menu2={menu2} toggleDrawer={toggleDrawer} />
  )
}

export default AdminDrawerList