import React from "react";
import { Divider, ListItemIcon, ListItemText } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export interface menuItem {
  name: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;

  // Either navigate OR trigger action
  path?: string;
  onClick?: () => void;
}

interface DrawerListProp {
  menu: menuItem[];
  menu2: menuItem[];
  toggleDrawer?: () => void;
}

const DrawerList = ({ menu, menu2, toggleDrawer }: DrawerListProp) => {

  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path?: string) =>
    path ? location.pathname === path : false;

  const handleItemClick = (item: menuItem) => {
    if (item.onClick) {
      item.onClick();        // logout / custom actions
    } else if (item.path) {
      navigate(item.path);   // normal navigation
    }

    toggleDrawer?.();        // close drawer on mobile
  };

  const renderMenuItem = (item: menuItem, index: number) => {
    const active = isActive(item.path);

    return (
      <div
        key={index}
        onClick={() => handleItemClick(item)}
        className="cursor-pointer"
      >
        <div
          className={`flex items-center gap-4 py-3 pl-4 pr-6 rounded-r-[999px] transition-all duration-150
            ${active ? "bg-[#0f9f8f] text-white" : "text-[#66ead7] hover:bg-white/5"}
          `}
        >
          <ListItemIcon
            className={`min-w-[40px] flex justify-center items-center
              ${active ? "text-white" : "text-[#66ead7]"}
            `}
          >
            {active && item.activeIcon ? item.activeIcon : item.icon}
          </ListItemIcon>

          <ListItemText
            primary={item.name}
            primaryTypographyProps={{
              className: `text-sm ${active ? "font-medium" : "font-normal"}`
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-[300px] bg-[#0f1111] text-[#9ee9dd]">

      <div className="flex flex-col justify-between h-full py-6 px-4">

        {/* top menu */}
        <div className="space-y-4">
          {menu.map(renderMenuItem)}
        </div>

        <Divider className="border-[#222] my-4" />

        {/* bottom menu */}
        <div className="space-y-4">
          {menu2.map(renderMenuItem)}
        </div>

      </div>
    </div>
  );
};

export default DrawerList;
