// IncomeCarousel.js
import React from 'react';
import { Carousel, Card, Button } from 'antd';
import { FaPlus } from 'react-icons/fa';

const incomeSources = [
  { name: "Salary", amount: 5000 },
  { name: "Freelance", amount: 2000 },
  // Add more sources as needed
];

const IncomeCarousel = () => {
  return (
    <Carousel autoplay>
      {incomeSources.map((income, index) => (
        <Card key={index} className="bg-yellow-200">
          <h3 className="text-xl font-semibold">{income.name}</h3>
          <p>${income.amount}</p>
          <Button icon={<FaPlus />} onClick={() => console.log("Edit Income")}>
            Edit
          </Button>
        </Card>
      ))}
    </Carousel>
  );
};

export default IncomeCarousel;
