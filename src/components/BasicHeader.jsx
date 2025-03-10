import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BasicHeader = ({ title, navigateTo }) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 left-0 z-50 w-full bg-white flex items-center py-6">
      <button onClick={() => navigate(navigateTo)} className="p-2">
        <ArrowBackIcon style={{ fontSize: 30, color: "#3b82f6" }} />
      </button>
      <h1 className="text-2xl font-bold ml-4">{title}</h1>
    </div>
  );
};

export default BasicHeader;
