import React from "react";
import { FaCrown } from "react-icons/fa";

const PlanBadge = () => {
  return (
    <span className="inline-flex items-center gap-1 bg-primary/75 text-white text-xs px-2 py-1.5 rounded-full ml-auto">
      <FaCrown size={10} color="white" />
    </span>
  );
};

export default PlanBadge;
