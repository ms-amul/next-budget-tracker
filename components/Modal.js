"use client";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const Modal = ({ type, onClose, refreshData }) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: 0,
    icon: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (type === "budget") {
        res = await fetch("/api/budget", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else if (type === "income") {
        res = await fetch("/api/income", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else if (type === "expense") {
        res = await fetch("/api/expense", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (res.ok) {
        setFormData({ name: "", amount: 0, icon: "" }); 
        refreshData();
        onClose();
      }
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{`Add ${
            type.charAt(0).toUpperCase() + type.slice(1)
          }`}</h2>
          <button onClick={onClose}>
            <FaTimes className="text-red-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border p-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Amount</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: Number(e.target.value) })
              }
              className="border p-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Icon</label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) =>
                setFormData({ ...formData, icon: e.target.value })
              }
              className="border p-2 w-full rounded"
              placeholder="Emoji or Icon"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded shadow"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
