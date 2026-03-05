import React, { useState } from "react";
import { Button } from "@mui/material";
import DealTable from "./DealTable";
import DealCategoryTable from "./DealCategoryTable";
import CreateDealForm from "./CreateDealForm";

const tabs = ["Deals", "Category", "Create Deal"];

const Deal = () => {
  const [activeTab, setActiveTab] = useState("Deals");

  return (
    <div className="p-2">
      <div className="flex gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 items-center">
        {tabs.map((item) => (
          <Button
            key={item}
            onClick={() => setActiveTab(item)}
            variant={activeTab === item ? "contained" : "text"}
            sx={{
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: activeTab === item ? "600" : "500",
              px: 3,
              backgroundColor: activeTab === item ? "#0f172a" : "transparent",
              color: activeTab === item ? "#fff" : "#64748b",
              '&:hover': {
                backgroundColor: activeTab === item ? "#334155" : "#f1f5f9",
              }
            }}
          >
            {item}
          </Button>
        ))}
      </div>
      <div className="mt-5">
        {activeTab === "Deals" ? (
          <DealTable />
        ) : activeTab === "Category" ? (
          <DealCategoryTable />
        ) : (
          <div className="mt-5 flex flex-col justify-center items-center h-[70vh]">
            <CreateDealForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default Deal;
