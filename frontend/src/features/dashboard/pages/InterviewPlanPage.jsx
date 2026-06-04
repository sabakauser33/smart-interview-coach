import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useInterview } from "../../interview/hooks/useInterviewForm";
import { useSearchParams, useNavigate } from "react-router";
import "../styles/interview-plan-page.scss";

const InterviewPlanPage = () => {
  const [searchParams] = useSearchParams();
  const { report, getReportById, getReports } = useInterview();
  const [loading, setLoading] = useState(true);
  const [localReport, setLocalReport] = useState(null);
  const reportId = searchParams.get("reportId");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const loadPlan = async () => {
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

    loadPlan();

    return () => {
      mounted = false;
    };
  }, [reportId, getReportById, getReports]);

  const activeReport = report || localReport;
  const activeReportId = reportId || activeReport?._id;

  const handleStartInterview = () => {
    if (!activeReportId) return;
    navigate(`/interview/${activeReportId}`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-spinner">
          <div className="spinner" />
          <p>Loading interview plan...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!activeReport) {
    return (
      <DashboardLayout>
        <div className="error-state">
          <h2>Interview Plan Not Found</h2>
          <p>Please create a new interview plan to get started.</p>
          <div className="error-actions">
            <button
              className="btn btn--primary"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="interview-plan-page">
        {/* Header */}
        <div className="page-header">
          <button className="btn-back" onClick={() => navigate("/dashboard")}>
            ← Back
          </button>
          <h1>Interview Strategy & Preparation Plan</h1>
          <p>Your personalized roadmap for success</p>
        </div>

        <div className="plan-content">
          {/* Job Match Overview */}
          <div className="card overview-card">
            <div className="overview-header">
              <h2>Job Overview</h2>
              <div className="match-score">
                <span className="score-label">Match Score</span>
                <span className="score-value">85%</span>
              </div>
            </div>

            <div className="overview-grid">
              <div className="overview-item">
                <span className="icon">📋</span>
                <span className="label">Job Description Summary</span>
                <p>{activeReport.jobDescription?.substring(0, 150)}...</p>
              </div>
              <div className="overview-item">
                <span className="icon">👤</span>
                <span className="label">Your Profile</span>
                <p>{activeReport.selfDescription?.substring(0, 150)}...</p>
              </div>
            </div>
          </div>

          {/* Preparation Plan */}
          {activeReport.preparationPlan && (
            <div className="card preparation-card">
              <h2>Preparation Roadmap</h2>
              <div className="roadmap">
                {activeReport.preparationPlan.map((day, idx) => (
                  <div key={idx} className="roadmap-day">
                    <div className="day-header">
                      <span className="day-badge">Day {day.day || idx + 1}</span>
                      <h3>{day.focus || `Phase ${idx + 1}`}</h3>
                    </div>
                    <ul className="tasks">
                      {(day.tasks || []).map((task, i) => (
                        <li key={i}>
                          <span className="task-bullet">✓</span>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skill Gaps */}
          {activeReport.skillGaps && activeReport.skillGaps.length > 0 && (
            <div className="card skill-gaps-card">
              <h2>Key Skill Gaps to Address</h2>
              <div className="gaps-grid">
                {activeReport.skillGaps.map((gap, idx) => (
                  <div key={idx} className="gap-item">
                    <div className="gap-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                      </svg>
                    </div>
                    <p>{typeof gap === 'string' ? gap : gap.skill || JSON.stringify(gap)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Start Interview Button */}
          <div className="action-footer">
            <button className="btn btn--primary btn--lg" onClick={handleStartInterview}>
              <span>🎤</span>
              Start Mock Interview
            </button>
            <p className="action-note">Test your knowledge with AI-powered mock interviews</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewPlanPage;
