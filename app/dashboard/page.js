"use client"
import React, { useState } from "react";
import { Modal } from "antd";
import { useSession } from "next-auth/react";
import NeumorphicCard from "@/components/QuickCards";
import ExpenseTable from "@/components/ExpenseTable";
import { GiWallet } from "react-icons/gi";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { GiExpense } from "react-icons/gi";
import {Spin} from "antd";
export default function Dashboard() {
  const { data: session, status } = useSession();
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCardClick = (cardType) => {
    setSelectedCard(cardType);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedCard(null);
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col scale-150 h-screen w-screen fixed items-center justify-center gap-3">
        <Spin size="large"></Spin>
        <p>Loading your data!</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="text-center">
        <p>You are not signed in. Please sign in to access the dashboard.</p>
        <Link href="/">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <p className="gradient-text-blue text-lg md:text-2xl font-semibold">
        Hello 👋 {session?.user?.name}, track all your expenses, budget and
        incomes...
      </p>
      <div className="flex flex-wrap justify-center">
        <NeumorphicCard
          title="Budget"
          amount="₹5000"
          icon={<GiWallet />}
          onEyeClick={() => handleCardClick("Budget")}
        />
        <NeumorphicCard
          title="Income"
          amount="₹7000"
          icon={<FaMoneyBillTrendUp />}
          onEyeClick={() => handleCardClick("Income")}
        />
        <NeumorphicCard
          title="Expenses"
          amount="₹3000"
          icon={<GiExpense />}
          onEyeClick={() => handleCardClick("Expenses")}
        />
      </div>

      <ExpenseTable/>

      {/* Modal for displaying selected card details */}
      <Modal
        title={`Details for ${selectedCard}`}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedCard === "Budget" && <p>Here are the details of your budget...</p>}
        {selectedCard === "Income" && <p>Here are the details of your income sources...</p>}
        {selectedCard === "Expenses" && <p>Here are the details of your expenses...</p>}
      </Modal>
    </div>
  );
}
