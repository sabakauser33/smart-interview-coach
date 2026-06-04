import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useInterview } from "../../interview/hooks/useInterviewForm";
import { useSearchParams, useNavigate } from "react-router";
import "../styles/questions-page.scss";

const QuestionsPage = () => {
  const [searchParams] = useSearchParams();
  const { report, getReportById, getReports } = useInterview();
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [localReport, setLocalReport] = useState(null);
  const reportId = searchParams.get("reportId");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const loadReport = async () => {
      if (reportId) {
        await getReportById(reportId);
      } else {
        try {
          const list = await getReports();
          if (mounted && Array.isArray(list) && list.length > 0) {
            setLocalReport(list[0]);
          }
        } catch (error) {
          console.error(error);
        }
      }
      if (mounted) {
        setLoading(false);
      }
    };

    loadReport();

    return () => {
      mounted = false;
    };
  }, [reportId, getReportById, getReports]);

  const activeReport = report || localReport;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-spinner">
          <div className="spinner" />
          <p>Loading questions...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!activeReport) {
    return (
      <DashboardLayout>
        <div className="error-state">
          <h2>Interview Plan Not Found</h2>
          <button
            className="btn btn--primary"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const technicalQuestions = activeReport.technicalQuestions || [];
  const behavioralQuestions = activeReport.behavioralQuestions || [];

  const getFilteredQuestions = () => {
    if (activeFilter === "technical") return technicalQuestions;
    if (activeFilter === "behavioral") return behavioralQuestions;
    return [...technicalQuestions, ...behavioralQuestions];
  };

  const filteredQuestions = getFilteredQuestions();

  return (
    <DashboardLayout>
      <div className="questions-page">
        <div className="page-header">
          <button className="btn-back" onClick={() => navigate("/dashboard")}>
            ← Back
          </button>
          <h1>Question Bank</h1>
          <p>Comprehensive collection of potential interview questions</p>
        </div>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          <button
            className={`filter-btn ${activeFilter === "all" ? "filter-btn--active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All Questions
            <span className="count">
              {technicalQuestions.length + behavioralQuestions.length}
            </span>
          </button>
          <button
            className={`filter-btn ${activeFilter === "technical" ? "filter-btn--active" : ""}`}
            onClick={() => setActiveFilter("technical")}
          >
            Technical
            <span className="count">{technicalQuestions.length}</span>
          </button>
          <button
            className={`filter-btn ${activeFilter === "behavioral" ? "filter-btn--active" : ""}`}
            onClick={() => setActiveFilter("behavioral")}
          >
            Behavioral
            <span className="count">{behavioralQuestions.length}</span>
          </button>
        </div>

        {/* Questions List */}
        <div className="questions-list">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((question, idx) => (
              <div
                key={idx}
                className={`question-card ${expandedQuestion === idx ? "question-card--open" : ""}`}
              >
                <div
                  className="question-header"
                  onClick={() =>
                    setExpandedQuestion(expandedQuestion === idx ? null : idx)
                  }
                >
                  <div className="question-number">Q{idx + 1}</div>
                  <div className="question-text">
                    <p>{question.question}</p>
                    {question.category && (
                      <span className={`category-badge category-${question.category.toLowerCase()}`}>
                        {question.category}
                      </span>
                    )}
                  </div>
                  <div className="question-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>

                {expandedQuestion === idx && (
                  <div className="question-content">
                    {question.intention && (
                      <div className="content-section">
                        <h4>
                          <span className="section-icon">🎯</span>
                          Why This Question?
                        </h4>
                        <p>{question.intention}</p>
                      </div>
                    )}

                    {question.answer && (
                      <div className="content-section">
                        <h4>
                          <span className="section-icon">✨</span>
                          Model Answer
                        </h4>
                        <p>{question.answer}</p>
                      </div>
                    )}

                    <div className="content-actions">
                      <button className="btn btn--sm btn--ghost">
                        📝 Take Notes
                      </button>
                      <button className="btn btn--sm btn--ghost">
                        🎤 Practice Speaking
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No questions found for this filter.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QuestionsPage;
