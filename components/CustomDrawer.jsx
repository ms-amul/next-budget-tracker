import { Drawer, Button, DatePicker, Empty } from "antd";
import BudgetCard from "@/components/SidebarCards/BudgetCard";
import IncomeCard from "@/components/SidebarCards/IncomeCard";
import { useState, useMemo } from "react";
import dayjs from "dayjs"; // Assuming dayjs is installed for date handling

const { MonthPicker } = DatePicker;

const CustomDrawer = ({
  isDrawerVisible,
  drawerType,
  handleCloseDrawer,
  handleOpenModal,
  budgets,
  incomes,
  fetchData,
}) => {
  // State to handle selected month (default is current month)
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  // Get the current month
  const currentMonth = dayjs().startOf("month");

  // Helper function to group data by month and year
  const groupByMonth = (data) => {
    return data.reduce((acc, item) => {
      const date = dayjs(item.createdAt);
      const monthYear = date.format("MMMM YYYY"); // e.g., "September 2024"

      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(item);
      return acc;
    }, {});
  };

  // Group budgets and incomes by month
  const groupedBudgets = useMemo(() => groupByMonth(budgets), [budgets]);
  const groupedIncomes = useMemo(() => groupByMonth(incomes), [incomes]);

  // Filter budgets and incomes based on selected month
  const filteredBudgets =
    groupedBudgets[selectedMonth.format("MMMM YYYY")] || [];
  const filteredIncomes =
    groupedIncomes[selectedMonth.format("MMMM YYYY")] || [];

  // Handle month picker change
  const handleMonthChange = (date) => {
    setSelectedMonth(date);
  };

  // Check if the selected month is the current month
  const isCurrentMonth = selectedMonth.isSame(currentMonth, "month");

  return (
    <Drawer
      title={drawerType === "budget" ? "Budgets" : "Incomes"}
      placement="right"
      onClose={handleCloseDrawer}
      visible={isDrawerVisible}
      width={400}
    >
      <div className="flex justify-between items-center mb-4">
        {isCurrentMonth ? (
          <Button type="primary" onClick={() => handleOpenModal(drawerType)}>
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
          disabledDate={(current) =>
            current && current > dayjs().endOf("month")
          }
        />
      </div>

      <h3 className="gradient-text-blue text-lg mb-5 font-bold">
        {drawerType === "budget" ? "Budgets" : "Incomes"} of{" "}
        {selectedMonth.format("MMMM YYYY")}
      </h3>

      {drawerType === "budget" && (
        <div>
          {filteredBudgets.length > 0 ? (
            filteredBudgets.map((budget) => (
              <BudgetCard
                key={budget._id}
                budget={budget}
                fetchData={fetchData}
                editData={() => {
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
                      onClick={() => handleOpenModal(drawerType)}
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
          {filteredIncomes.length > 0 ? (
            filteredIncomes.map((income) => (
              <IncomeCard
                key={income._id}
                income={income}
                fetchData={fetchData}
                editData={() => {
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
                      onClick={() => handleOpenModal(drawerType)}
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
