import BudgetCard from "@/components/SidebarCards/BudgetCard";
import IncomeCard from "@/components/SidebarCards/IncomeCard";
import { Button, DatePicker, Drawer, Empty } from "antd";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
const { MonthPicker } = DatePicker;

const CustomDrawer = ({
  userCreated,
  isDrawerVisible,
  drawerType,
  handleCloseDrawer,
  handleOpenModal,
  budgets,
  incomes,
  fetchData,
  selectedMonth,
  setSelectedMonth
}) => {
  dayjs.extend(utc);
  const currentMonth = dayjs.utc().startOf("month");
  const handleMonthChange = (date) => {
    setSelectedMonth(date);
  };

  const isCurrentMonth = selectedMonth.isSame(currentMonth, "month");

  return (
    <Drawer
      title={drawerType === "budget" ? "Budgets" : "Incomes"}
      placement="right"
      onClose={handleCloseDrawer}
      open={isDrawerVisible}
      width={400}
      className="custom-drawer"
    >
      <div className="flex justify-between items-center mb-4">
        {isCurrentMonth ? (
          <Button
            type="primary"
            onClick={() => {
              handleCloseDrawer();
              handleOpenModal(drawerType);
            }}
          >
            Add {drawerType === "budget" ? "Budget" : "Income"}
          </Button>
        ) : (
          <p className="gradient-text-green">
            Adding new {drawerType === "budget" ? "budgets" : "incomes"} is only
            allowed in the current month.
          </p>
        )}

        {/* Month Picker */}
        <MonthPicker
          value={selectedMonth}
          onChange={handleMonthChange}
          placeholder="Select Month"
          allowClear={false}
          inputReadOnly={true}
          format="MMMM YYYY"
          disabledDate={(current) =>
            current &&
            (current > dayjs.utc().endOf("month") || current < dayjs(userCreated))
          }
        />
      </div>

      <h3 className="gradient-text-blue text-lg mb-5 font-bold">
        {drawerType === "budget" ? "Budgets" : "Incomes"} of{" "}
        {selectedMonth.format("MMMM YYYY")}
      </h3>

      {drawerType === "budget" && (
        <div>
          {budgets.length > 0 ? (
            budgets.map((budget) => (
              <BudgetCard
                key={budget._id}
                budget={budget}
                fetchData={fetchData}
                editData={() => {
                  handleCloseDrawer();
                  handleOpenModal(drawerType, budget);
                }}
              />
            ))
          ) : (
            <Empty
              description={
                <>
                  <p className="mb-3 gradient-text-blue">
                    Your Budget for this month is empty.
                  </p>
                  {isCurrentMonth && (
                    <Button
                      type="primary"
                      shape="round"
                      onClick={() => {
                        handleCloseDrawer();
                        handleOpenModal(drawerType);
                      }}
                    >
                      Add 1st {drawerType === "budget" ? "Budget" : "Income"}
                    </Button>
                  )}
                </>
              }
            />
          )}
        </div>
      )}

      {drawerType === "income" && (
        <div>
          {incomes.length > 0 ? (
            incomes.map((income) => (
              <IncomeCard
                key={income._id}
                income={income}
                fetchData={fetchData}
                editData={() => {
                  handleCloseDrawer();
                  handleOpenModal(drawerType, income);
                }}
              />
            ))
          ) : (
            <Empty
              description={
                <>
                  <p className="mb-3 gradient-text-blue">
                    Your Income for this month is empty.
                  </p>
                  {isCurrentMonth && (
                    <Button
                      type="primary"
                      shape="round"
                      onClick={() => {
                        handleCloseDrawer();
                        handleOpenModal(drawerType);
                      }}
                    >
                      Add 1st {drawerType === "budget" ? "Budget" : "Income"}
                    </Button>
                  )}
                </>
              }
            />
          )}
        </div>
      )}
    </Drawer>
  );
};

export default CustomDrawer;
