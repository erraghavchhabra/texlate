import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const CircleLoading = ({ size = 22, className }) => {
  return (
    <AiOutlineLoading3Quarters
      className={`animate-spin ${className}`}
      size={size}
    />
  );
};

export default CircleLoading;
