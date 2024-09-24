
import React from 'react';
import { Card } from 'antd';

const CurrentBalanceCard = ({ balance }) => {
  return (
    <Card className="bg-green-200" bordered>
      <h3 className="text-xl font-semibold">Current Balance</h3>
      <p>${balance}</p>
    </Card>
  );
};

export default CurrentBalanceCard;
