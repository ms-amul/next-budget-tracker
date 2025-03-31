import { GoogleGenAI } from "@google/genai";
import { Button, Modal, DatePicker, Alert, Badge } from "antd";
import "antd/dist/reset.css";
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaShareNodes } from "react-icons/fa6";
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
  const [isCached, setIsCached] = useState(false);
  const [lastCallTimestamp, setLastCallTimestamp] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [promptResponses, setPromptResponses] = useState([]);

  const genAI = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });

  const formatTimestamp = (timestamp) => {
    return dayjs(timestamp).format("MMMM DD, YYYY h:mm A");
  };

  const calculateTimeRemaining = (timestamp) => {
    const now = new Date().getTime();
    const twentyFourHoursLater = timestamp + 24 * 60 * 60 * 1000;
    const difference = twentyFourHoursLater - now;

    if (difference > 0) {
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    } else {
      return "00:00:00";
    }
  };

  useEffect(() => {
    const cachedData = localStorage.getItem("financial_report");
    if (cachedData) {
      const { response, timestamp } = JSON.parse(cachedData);
      const now = new Date().getTime();

      if (now - timestamp < 24 * 60 * 60 * 1000) {
        setResponseText(response);
        setIsCached(true);
        setLastCallTimestamp(timestamp);

        const timer = setInterval(() => {
          setTimeRemaining(calculateTimeRemaining(timestamp));
        }, 1000);
        return () => clearInterval(timer);
      } else {
        localStorage.removeItem("financial_report");
      }
    }
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
    if (!isCached) {
      getBudgetSuggestions();
    }
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
  };

  const handleShare = () => {
    const sanitizedText = responseText
      .replace(/(\*|\#|\-|\>)/g, "")
      .replace(/\n\s*\n/g, "\n")
      .trim();

    const textToShare = `My Financial Report by Servify:\n\n${sanitizedText}`;

    if (navigator.share) {
      navigator
        .share({
          title: "My Financial Report by Servify",
          text: textToShare,
        })
        .catch((error) => console.error("Error sharing:", error));
    } else {
      navigator.clipboard
        .writeText(textToShare)
        .then(() => alert("Report copied to clipboard!"))
        .catch((error) => console.error("Error copying text:", error));
    }
  };

  const getBudgetSuggestions = async () => {
    if (!income.length || !expenses.length || !budget.length) {
      setResponseText(
        "Please add at least one item in each section: income, expenses, and budget."
      );
      return;
    }

    setLoading(true);
    const prompt = `Based on the provided financial data:
      - **Income**: ₹${JSON.stringify(income)}
      - **Expenses**: ₹${JSON.stringify(expenses)}
      - **Budget**: ₹${JSON.stringify(budget)}

    Generate a **structured financial report** with the following sections:

    1. **Expense Report**:
      - Major Expenses: Highlight the top 2-3 expense categories with amounts.
      - Optimization: Provide 1-2 practical suggestions to reduce costs.

    2. **Income Report**:
      - Summary: Describe key income sources and their contributions.
      - Growth Suggestions: Suggest 1-2 actionable ways to increase income.

    3. **Budget Report**:
      - Allocation Overview: Summarize how the budget is distributed across key areas.
      - Status Check: Indicate whether the budget is balanced, surplus, or in deficit.

    4. **Savings Report**:
      - Savings Potential: Calculate potential savings (Income - Expenses).
      - Tips: Suggest 1-2 ways to increase savings and utilize them effectively.

    5. **Suggestions Tab**:
      - Provide concise, actionable financial tips such as:
        - Reduce discretionary expenses where possible.
        - Reassess monthly subscriptions or memberships and eliminate unnecessary ones.
        - Allocate a portion of income to low-risk investments like gold efts mutual funds for gradual growth.
        - Set aside funds for an emergency buffer.
    Ensure the response is concise, professional, and actionable. Avoid mentioning tracking or app-specific tasks. Use bullet points for readability.`;

    try {
      const result = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      const generatedText = result.text;
      setResponseText(generatedText);

      const timestamp = new Date().getTime();
      localStorage.setItem(
        "financial_report",
        JSON.stringify({
          response: generatedText,
          timestamp,
        })
      );
      setLastCallTimestamp(timestamp);
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
          <div className="flex items-center justify-between gap-2 border border-transparent shadow-xl rounded-full border-b-blue-400 p-2">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="logo" className="w-10 h-10" />
              <h1 className="gradient-text-blue text-lg md:text-xl font-bold m-0">
                Your financial report
                <br />
                <span className="gradient-text-red text-xs font-semibold m-0">
                  {"<"}Powered by Google Gemini{"/>"}
                </span>
              </h1>
            </div>
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
            className="text-cyan-500"
          >
            OK
          </Button>,
          <Button
            size="large"
            color="primary"
            variant="fill"
            className="text-cyan-500"
            key="share"
            onClick={handleShare}
          >
            <FaShareNodes className="scale-125" /> Share
          </Button>,
        ]}
        width={1000}
      >
        {isCached && (
          <Alert
            message={
              <ReactMarkdown>
                **Note:** The generated financial report is cached for 24 hours
                to optimize performance. New reports will not be generated
                during this period unless the cache expires. If you've updated
                any financial data, please wait for the cache to refresh.
              </ReactMarkdown>
            }
            type="warning"
            showIcon
            className="mb-3"
            closable
          />
        )}
        {isCached && lastCallTimestamp && (
          <Alert
            message={
              <div className="flex flex-col items-center gap-2 md:flex-row">
                <span>
                  <strong>⏰ Last API Call:</strong> {formatTimestamp(lastCallTimestamp)}
                </span>
                <Badge
                  count={`New Call Available in: ${timeRemaining} hrs`}
                  style={{
                    backgroundColor: "#ff4d4f",
                    color: "white",
                  }}
                />
              </div>
            }
            type="info"
            showIcon
            closable
            className="mb-3"
          />
        )}

        {/* Loading or Generated Report */}
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
