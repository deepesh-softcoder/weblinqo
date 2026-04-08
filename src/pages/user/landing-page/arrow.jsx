import React from "react";

// triagnle for slider
const Triangle = ({ direction = "down", color = "black", size = 24 }) => {
  const baseStyle = {
    width: 0,
    height: 0,
  };

  const directions = {
    up: {
      borderLeft: `${size}px solid transparent`,
      borderRight: `${size}px solid transparent`,
      borderBottom: `${size}px solid ${color}`,
    },
    down: {
      borderLeft: `${size}px solid transparent`,
      borderRight: `${size}px solid transparent`,
      borderTop: `${size}px solid ${color}`,
    },
    left: {
      borderTop: `${size}px solid transparent`,
      borderBottom: `${size}px solid transparent`,
      borderRight: `${size}px solid ${color}`,
    },
    right: {
      borderTop: `${size}px solid transparent`,
      borderBottom: `${size}px solid transparent`,
      borderLeft: `${size}px solid ${color}`,
    },
  };

  return <div style={{ ...baseStyle, ...directions[direction] }} />;
};

export default Triangle;
