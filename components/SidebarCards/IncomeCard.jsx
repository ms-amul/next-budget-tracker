import {
  RiMoneyDollarCircleFill,
  RiEdit2Line,
  RiDeleteBinLine,
} from "react-icons/ri";
import { message, Popconfirm } from "antd";

const IncomeCard = ({ income, editData, fetchData }) => {
  // Function to handle deletion of income
  const deleteIncome = async (id) => {
    const res = await fetch(`/api/income`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      message.success("Deleted the income");
      fetchData();
    } else {
      message.error("Failed to delete income. Please try again.");
    }
  };

  return (
    <div className="p-4 bg-slate-900 rounded-lg shadow-md my-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 mr-3 flex items-center justify-center bg-slate-950 rounded-full">
          {income.icon ? (
            <span className="text-2xl rounded-full">{income.icon}</span>
          ) : (
            <RiMoneyDollarCircleFill className="text-gray-200 text-xl" />
          )}
        </div>
        <div className="flex justify-between w-full">
          <h3 className="text-lg font-semibold text-slate-100">{income.name}</h3>
          <span className="text-gray-200 font-medium">₹{income.amount}</span>
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        {/* Edit Button */}
        <button
          onClick={() => {
            editData();
          }}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
        >
          <RiEdit2Line className="text-lg" />
        </button>

        {/* Delete Button with Confirmation Popover */}
        <Popconfirm
          title="Are you sure you want to delete this income?"
          onConfirm={() => deleteIncome(income._id)} // Confirm delete
          okText="Yes"
          cancelText="No"
        >
          <button className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300">
            <RiDeleteBinLine className="text-lg" />
          </button>
        </Popconfirm>
      </div>
    </div>
  );
};

export default IncomeCard;
