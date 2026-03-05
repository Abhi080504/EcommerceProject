import React from "react";
import {
  Add,
  Dashboard,
  Inventory,
  ShoppingBag,
  AccountBalanceWallet,
  Receipt,
  AccountBox,
  Logout,
} from "@mui/icons-material";

import DrawerList from "../../../Customer/components/Navbar/DrawerList";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../State/hooks";
import { performLogout } from "../../../State/Auth/authSlice";

const SellerDrawerList = ({ toggleDrawer }: { toggleDrawer: any }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(performLogout());
    toggleDrawer();
  };

  const menu = [
    {
      name: "Dashboard",
      path: "/seller",
      icon: <Dashboard className="text-primary-color" />,
      activeIcon: <Dashboard className="text-white" />,
    },
    {
      name: "Orders",
      path: "/seller/orders",
      icon: <ShoppingBag className="text-primary-color" />,
      activeIcon: <ShoppingBag className="text-white" />,
    },
    {
      name: "Products",
      path: "/seller/products",
      icon: <Inventory className="text-primary-color" />,
      activeIcon: <Inventory className="text-white" />,
    },
    {
      name: "Add Product",
      path: "/seller/add-product",
      icon: <Add className="text-primary-color" />,
      activeIcon: <Add className="text-white" />,
    },
    {
      name: "Payment",
      path: "/seller/payment",
      icon: <AccountBalanceWallet className="text-primary-color" />,
      activeIcon: <AccountBalanceWallet className="text-white" />,
    },
    {
      name: "Transaction",
      path: "/seller/transaction",
      icon: <Receipt className="text-primary-color" />,
      activeIcon: <Receipt className="text-white" />,
    },
  ];

  const menu2 = [
    {
      name: "Account",
      path: "/seller/account",
      icon: <AccountBox className="text-primary-color" />,
      activeIcon: <AccountBox className="text-white" />,
    },
    {
      name: "Logout",
      icon: <Logout className="text-primary-color" />,
      activeIcon: <Logout className="text-white" />,
      onClick: handleLogout, // 🔹 call logout, don't route
    },
  ];

  return (
    <DrawerList
      menu={menu}
      menu2={menu2}
      toggleDrawer={toggleDrawer}
    />
  );
};

export default SellerDrawerList;
