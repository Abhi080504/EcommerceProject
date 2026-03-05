import React, { useState } from "react";
import { Button, Box } from "@mui/material";
import DealTable from "./DealTable";
import DealCategoryTable from "./DealCategoryTable";
import CreateDealForm from "./CreateDealForm";
import { LocalOffer, Category, AddCircleOutline } from '@mui/icons-material';

const tabs = [
  { name: "Deals", icon: <LocalOffer fontSize="small" /> },
  { name: "Category", icon: <Category fontSize="small" /> },
  { name: "Create Deal", icon: <AddCircleOutline fontSize="small" /> }
];

const Deal = () => {
  const [activeTab, setActiveTab] = useState("Deals");

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 4, 
        p: 1, 
        borderRadius: 4, 
        bgcolor: '#ffffff', 
        border: '1px solid #e2e8f0',
        width: 'fit-content',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
      }}>
        {tabs.map((item) => (
          <Button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            startIcon={item.icon}
            variant={activeTab === item.name ? "contained" : "text"}
            disableElevation
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: activeTab === item.name ? 600 : 500,
              px: 3,
              py: 1,
              backgroundColor: activeTab === item.name ? "#0f172a" : "transparent",
              color: activeTab === item.name ? "#fff" : "#64748b",
              '&:hover': {
                backgroundColor: activeTab === item.name ? "#334155" : "#f1f5f9",
              },
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {item.name}
          </Button>
        ))}
      </Box>
      
      <Box sx={{ mt: 3 }}>
        {activeTab === "Deals" ? (
          <DealTable />
        ) : activeTab === "Category" ? (
          <DealCategoryTable />
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CreateDealForm />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Deal;
