import { Modal } from "antd";
import Budget from "@/components/Budget";
import Income from "@/components/Income";
import Expense from "@/components/Expense";

const CustomModal = ({
  isModalVisible,
  modalType,
  handleCloseModal,
  budgets,
  incomes,
  getBudgetCategoriesForDropdown,
  fetchData,
}) => {
  return (
    <Modal
      visible={isModalVisible}
      onCancel={handleCloseModal}
      footer={null}
      className="z-[999]"
    >
      {modalType === "budget" && <Budget budget={budgets} />}
      {modalType === "income" && <Income income={incomes} />}
      {modalType === "expense" && (
        <Expense
          getCategories={getBudgetCategoriesForDropdown}
          fetchData={fetchData}
        />
      )}
    </Modal>
  );
};

export default CustomModal;
