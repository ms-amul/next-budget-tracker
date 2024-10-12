import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button, Modal } from "antd";
import "antd/dist/reset.css";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import ReactMarkdown from "react-markdown";

const filterCurrentMonthData = (items) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-11
  const currentYear = currentDate.getFullYear(); // YYYY

  return items.filter((item) => {
    const itemDate = new Date(item.createdAt);
    return (
      itemDate.getMonth() === currentMonth &&
      itemDate.getFullYear() === currentYear
    );
  });
};

const BudgetSuggestionComponent = ({ income, expenses, budget }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [promptResponses, setPromptResponses] = useState([]);

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

  const showModal = () => {
    setIsModalVisible(true);
    getBudgetSuggestions(); // Fetch suggestions
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setResponseText(""); // Clear response
  };

  const getBudgetSuggestions = async () => {
    setLoading(true);

    // Filter data for current month
    const filteredIncome = filterCurrentMonthData(income);
    const filteredExpenses = filterCurrentMonthData(expenses);
    const filteredBudget = filterCurrentMonthData(budget);

    const prompt = `I have an income of ₹${JSON.stringify(
      filteredIncome
    )}, expenses of ₹${JSON.stringify(
      filteredExpenses
    )}, and a budget of ₹${JSON.stringify(filteredBudget)}. 

    Please provide detailed suggestions on how to manage my finances. 

    **Format the response as follows:**

    1. **Key Recommendations**
       - Use bullet points to outline specific recommendations for managing my finances effectively, including strategies to reduce expenses, increase savings, and improve overall financial health.

    2. **Areas for Improvement**
       - Identify key areas where I can improve my financial management, including habits, budgeting techniques, or financial tools that could be beneficial.

    3. **Overall Summary**
       - Summarize the current financial health based on the provided data, emphasizing any strengths and weaknesses. Include insights on how to create a balanced financial plan moving forward.

    Give calculations, savings and investment ideas etc. Please ensure the response is formatted correctly in Markdown for better readability.`;

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
      <Button
        color="primary"
        variant="outlined"
        onClick={showModal}
        icon={<FcGoogle />}
      >
        Get AI Suggestion
      </Button>

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
