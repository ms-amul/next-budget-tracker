import { Modal, Button } from "antd";
import Budget from "@/components/Forms/Budget";
import Income from "@/components/Forms/Income";
import Expense from "@/components/Forms/Expense";
import dayjs from "dayjs";

const CustomModal = ({
  isModalVisible,
  modalType,
  handleCloseModal,
  budgets,
  incomes,
  getBudgetCategoriesForDropdown,
  fetchData,
  selectedMonth,
  setSelectedMonth, // added to allow switching to current month
}) => {
  const isCurrentMonth = selectedMonth.isSame(dayjs(), "month");

  return (
    <Modal
      open={isModalVisible}
      onCancel={handleCloseModal}
      footer={null}
      className="custom-modal"
    >
      {modalType.type === "budget" && (
        <Budget
          budget={budgets}
          fetchData={fetchData}
          editData={modalType.data}
        />
      )}
      {modalType.type === "income" && (
        <Income
          income={incomes}
          fetchData={fetchData}
          editData={modalType.data}
        />
      )}
      {modalType.type === "expense" ? (
        isCurrentMonth ? (
          <Expense
            getCategories={getBudgetCategoriesForDropdown}
            fetchData={fetchData}
            editData={modalType.data}
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-center p-2 mt-4">
            <h3 className="gradient-text-blue text-lg">
              Can't add expenses to previous months. Switch to the current month
              to add expenses.
            </h3>
            <Button type="primary" onClick={() => setSelectedMonth(dayjs())}>
              Switch to Current Month
            </Button>
          </div>
        )
      ) : null}
    </Modal>
  );
};

export default CustomModal;
