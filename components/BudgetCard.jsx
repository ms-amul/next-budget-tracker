import { RiMoneyDollarCircleFill, RiEdit2Line, RiDeleteBinLine } from "react-icons/ri";

const BudgetCard = ({ budget }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md my-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 mr-3 flex items-center justify-center bg-gray-200 rounded-full">
          {budget.icon ? (
            <span className="text-2xl rounded-full">{budget.icon}</span>
          ) : (
            <RiMoneyDollarCircleFill className="text-gray-500 text-xl" />
          )}
        </div>
        <div className="flex justify-between w-full">
          <h3 className="text-lg font-semibold text-gray-800">{budget.name}</h3>
          <span className="text-gray-600 font-medium">₹{budget.amount}</span>
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300">
          <RiEdit2Line className="text-lg" />
        </button>
        <button className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300">
          <RiDeleteBinLine className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default BudgetCard;
