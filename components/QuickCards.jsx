"use client";
import { Card } from "antd";
import { FaEye } from "react-icons/fa6";

const NeumorphicCard = ({ title, amount, icon, onEyeClick }) => {
  return (
    <Card className="bg-light-bg shadow-neumorphic rounded-lg p-1 m-2 flex-1">
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center">
          <div className={`text-5xl md:text-7xl mr-4 p-2 rounded-xl ${title}`}>
            {icon}
          </div>
          {/* Icon */}
          <div className="flex flex-col items-start justify-center">
            {/* Title and Amount */}
            <h2 className="text-2xl md:text-3xl font-bold gradient-text-red m-0 mb-2">
              {title}
            </h2>
            <p className="text-3xl md:text-4xl font-bold gradient-text-blue m-0">
              {amount}
            </p>
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
