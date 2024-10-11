import { Modal } from "antd";
import Budget from "@/components/Forms/Budget";
import Income from "@/components/Forms/Income";
import Expense from "@/components/Forms/Expense";

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
    <>
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
      </Modal>
      {modalType.type === "expense" && (
        <Modal
          open={isModalVisible}
          onCancel={handleCloseModal}
          footer={null}
          className="custom-modal"
        >
          <Expense
            getCategories={getBudgetCategoriesForDropdown}
            fetchData={fetchData}
            editData={modalType.data}
          />
        </Modal>
      )}
    </>
  );
};

export default CustomModal;
