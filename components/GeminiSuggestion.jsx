import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button, Modal, DatePicker } from "antd";
import "antd/dist/reset.css";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import ReactMarkdown from "react-markdown";
import dayjs from "dayjs";

const { MonthPicker } = DatePicker;
import DownloadReportButton from "./ReportDownload";

const BudgetSuggestionComponent = ({
  income,
  expenses,
  budget,
  selectedMonth,
  setSelectedMonth,
  user,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [promptResponses, setPromptResponses] = useState([]);

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

  const showModal = () => {
    setIsModalVisible(true);
    getBudgetSuggestions();
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setResponseText("");
  };

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
  };

  const getBudgetSuggestions = async () => {
    if (!income.length || !expenses.length || !budget.length) {
      setResponseText(
        "Please add at least one item in each section: income, expenses, and budget."
      );
      return;
    }

    setLoading(true);

    const prompt = `I have the following data:
    - Income: ₹${JSON.stringify(income)}
    - Expenses: ₹${JSON.stringify(expenses)}
    - Budget: ₹${JSON.stringify(budget)}
  
    Please provide a brief, compact report covering:
  
    1. **Expense Report**: A quick summary of the major expenses and suggestions to optimize them.
    2. **Income Report**: Insights into my income sources and ways to increase them.
    3. **Budget Report**: A brief overview of my budget allocation and whether it’s balanced.
    4. **Savings Report**: How much I can potentially save and any tips on increasing savings.
  
    Keep the response concise and consistent.`;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = result.response;
      const generatedText = response.text();
      setResponseText(generatedText);
      setPromptResponses([...promptResponses, generatedText]);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setResponseText("An error occurred while fetching suggestions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-right">
      <div className="flex justify-end gap-2 mb-3 items-center">
        <DownloadReportButton
          budgets={budget}
          incomes={income}
          expenses={expenses}
          selectedMonth={selectedMonth}
          user={user}
        />
        <Button
          color="primary"
          variant="outlined"
          onClick={showModal}
          icon={<FcGoogle className="scale-125" />}
          className="text-cyan-100"
        >
          Insights
        </Button>
        <MonthPicker
          onChange={handleMonthChange}
          value={selectedMonth}
          placeholder="Select Month"
          allowClear={false}
          inputReadOnly={true}
          className="text-cyan-100 border-blue-500"
          format="MMMM YYYY"
          disabledDate={(current) =>
            current &&
            (current > dayjs().endOf("month") || current < dayjs("2024-09-01"))
          }
        />
      </div>
      <Modal
        title={
          <div className="flex items-center gap-2 border border-transparent shadow-xl rounded-full border-b-blue-400 p-2">
            <img src="/logo.png" alt="logo" className="w-10 h-10" />
            <h1 className="gradient-text-blue text-lg md:text-xl font-bold m-0">
              Your financial report
              <br />
              <span className="gradient-text-red text-xs font-semibold m-0">
                {"<"}Powered by Google Gemini{"/>"}
              </span>
            </h1>
          </div>
        }
        open={isModalVisible}
        onOk={handleClose}
        onCancel={handleClose}
        footer={[
          <Button
            size="large"
            color="primary"
            variant="fill"
            key="ok"
            onClick={handleClose}
          >
            OK
          </Button>,
        ]}
        width={1000}
      >
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden flex justify-center items-center flex-col">
                <img
                  className="mix-blend-multiply"
                  src="/load.gif"
                  alt="Loading...."
                />
                <p className="gradient-text-green">Fetching report....</p>
              </span>
            </div>
          </div>
        ) : (
          <ReactMarkdown>{responseText}</ReactMarkdown>
        )}
      </Modal>
    </div>
  );
};

export default BudgetSuggestionComponent;
