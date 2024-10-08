"use client"
import React from "react";
import { Card } from "antd";
import { FaEye } from "react-icons/fa6";

const NeumorphicCard = ({ title, amount, icon, onEyeClick }) => {
  return (
    <Card className="bg-light-bg shadow-neumorphic rounded-lg p-1 m-4 flex-1">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-4xl md:text-6xl mr-4">{icon}</div>
          <div>
            <h2 className="text-2xl font-bold gradient-text-red">{title}</h2>
            <p className="text-3xl font-bold gradient-text-blue">{amount}</p>
          </div>
        </div>
        <FaEye
          title={`Expand ${title}`}
          className="text-slate-600 text-6xl rounded-full p-2 bg-light-bg shadow-neumorphic cursor-pointer"
          onClick={onEyeClick}
        />
      </div>
    </Card>
  );
};

export default NeumorphicCard;
