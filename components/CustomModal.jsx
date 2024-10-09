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
      {modalType.type === "expense" && (
        <Expense
          getCategories={getBudgetCategoriesForDropdown}
          fetchData={fetchData}
          editData={modalType.data}
        />
      )}
    </Modal>
  );
};

export default CustomModal;
