"use client";
import { Card } from "antd";
import { FaEye } from "react-icons/fa6";
import { useEffect, useState } from "react";

const NeumorphicCard = ({ title, amount, icon, onEyeClick }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const end = Number(amount);

    let start = 0;
    const duration = 1500;
    const incrementTime = 30;
    const totalSteps = Math.floor(duration / incrementTime);
    const incrementValue = Math.ceil(end / totalSteps);

    const timer = setInterval(() => {
      start += incrementValue; 
      if (start >= end) {
        clearInterval(timer);
        setCount(end.toFixed(2));
      } else {
        setCount(start.toFixed(2));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [amount]);

  return (
    <Card
      onClick={onEyeClick}
      className="qccard shadow-neumorphic rounded-lg p-1 m-2 flex-1 cursor-pointer"
    >
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center">
          <div className={`text-5xl md:text-7xl mr-4 p-2 rounded-xl ${title}`}>
            {icon}
          </div>
          <div className="flex flex-col items-start justify-center">
            <h2
              className={`text-2xl md:text-3xl font-bold gradient-text-${title} m-0 mb-2`}
            >
              {title}
            </h2>
            <p className="text-2xl md:text-3xl font-bold gradient-text-blue m-0">
              ₹{count}
            </p>
          </div>
        </div>

        <FaEye
          title={`Expand ${title}`}
          className="text-slate-600 text-6xl rounded-full p-2 bg-light-bg shadow-neumorphic cursor-pointer"
        />
      </div>
    </Card>
  );
};

export default NeumorphicCard;
