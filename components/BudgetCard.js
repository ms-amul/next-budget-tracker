"use client";
import React from "react";
import { Card, Button } from "antd";
import { FaPencilAlt } from "react-icons/fa";

const BudgetCard = ({ budgets, onOpenModal }) => {
  const hasBudget = budgets.length > 0;
  const budget = hasBudget ? budgets[0] : null; // Assuming one budget for simplicity

  return (
    <Card className="bg-blue-200" bordered>
      <h3 className="text-xl font-semibold">
        {hasBudget ? "Budget Set" : "No Budget Set"}
      </h3>
      {hasBudget ? (
        <>
          <p>Category: {budget.category}</p>
          <p>Limit: ${budget.limit}</p>
          <p>Spent: ${budget.spent}</p>
          <div className="flex justify-between">
            <Button
              icon={<FaPencilAlt />}
              onClick={() => onOpenModal("budget")}
            >
              Edit Budget
            </Button>
            <Button danger onClick={() => console.log("Delete Budget")}>
              Delete Budget
            </Button>
          </div>
        </>
      ) : (
        <Button type="primary" onClick={() => onOpenModal("budget")}>
          Add Budget
        </Button>
      )}
    </Card>
  );
};

export default BudgetCard;
