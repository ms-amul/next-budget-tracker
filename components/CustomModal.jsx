import { Modal, Button } from "antd";
import Budget from "@/components/Forms/Budget";
import Income from "@/components/Forms/Income";
import Expense from "@/components/Forms/Expense";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';

const CustomModal = ({
  isModalVisible,
  modalType,
  handleCloseModal,
  budgets,
  incomes,
  getBudgetCategoriesForDropdown,
  fetchData,
  selectedMonth,
  setSelectedMonth,
}) => {

  dayjs.extend(utc);
  const isCurrentMonth = selectedMonth.isSame(dayjs.utc(), "month");
  const switchToCurrent = () => {
    setSelectedMonth(dayjs());
  };
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
          handleCloseModal={handleCloseModal}
        />
      )}
      {modalType.type === "income" && (
        <Income
          income={incomes}
          fetchData={fetchData}
          editData={modalType.data}
          handleCloseModal={handleCloseModal}
        />
      )}
      {modalType.type === "expense" && (
        <Expense
          getCategories={getBudgetCategoriesForDropdown}
          fetchData={fetchData}
          editData={modalType.data}
          isCurrentMonth={isCurrentMonth}
          switchToCurrent = {switchToCurrent}
          handleCloseModal={handleCloseModal}
        />
      )}
    </Modal>
  );
};

export default CustomModal;
