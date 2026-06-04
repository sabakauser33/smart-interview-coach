import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useInterview } from "../../interview/hooks/useInterviewForm";
import { useNavigate } from "react-router";
import "../styles/dashboard-page.scss";

const Dashboard = () => {
  const { reports, getReports } = useInterview();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      await getReports();
      setLoading(false);
    };
    loadReports();
  }, [getReports]);

  const handleStartNewInterview = () => {
    navigate("/");
  };

  const handleViewReport = (reportId) => {
    navigate(`/interview/${reportId}`);
  };

  const handleInterviewPlan = (reportId) => {
    navigate(`/interview-plan?reportId=${reportId}`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-spinner">
          <div className="spinner" />
          <p>Loading your dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        {/* Page Header */}
        <div className="page-header">
          <h1>Welcome to Your Dashboard</h1>
          <p>Manage your interview preparation and track your progress</p>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button
            className="btn btn--primary btn--lg"
            onClick={handleStartNewInterview}
          >
            <span className="btn-icon">
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
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </span>
            Create New Interview Plan
          </button>
        </div>

        {/* Reports Grid */}
        {reports && reports.length > 0 ? (
          <>
            <div className="section-header">
              <h2>Your Interview Plans</h2>
              <span className="badge">{reports.length} Plan{reports.length !== 1 ? "s" : ""}</span>
            </div>

            <div className="grid grid--3">
              {reports.map((report) => (
                <div key={report._id} className="card report-card">
                  {/* Card Header */}
                  <div className="report-card__header">
                    <div className="report-info">
                      <h3 className="report-title">
                        {report.jobDescription?.substring(0, 50)}...
                      </h3>
                      <p className="report-date">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Card Stats */}
                  <div className="report-stats">
                    <div className="stat">
                      <span className="stat-label">Technical Q&A</span>
                      <span className="stat-value">
                        {report.technicalQuestions?.length || 0}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Behavioral Q&A</span>
                      <span className="stat-value">
                        {report.behavioralQuestions?.length || 0}
                      </span>
                    </div>
                  </div>

                  {/* Skill Gaps */}
                  {report.skillGaps && report.skillGaps.length > 0 && (
                    <div className="skill-gaps">
                      <p className="skill-label">Key Gaps to Address:</p>
                      <div className="gaps-list">
                        {report.skillGaps.slice(0, 2).map((gap, idx) => (
                          <span key={idx} className="gap-tag">
                            {typeof gap === 'string' ? gap : gap.skill || JSON.stringify(gap)}
                          </span>
                        ))}
                        {report.skillGaps.length > 2 && (
                          <span className="gap-tag gap-tag--more">
                            +{report.skillGaps.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Card Actions */}
                  <div className="report-card__footer">
                    <button
                      className="btn btn--ghost btn--sm"
                      onClick={() => handleViewReport(report._id)}
                    >
                      View Details
                    </button>
                    <button
                      className="btn btn--primary btn--sm"
                      onClick={() => handleInterviewPlan(report._id)}
                    >
                      Start Interview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3>No Interview Plans Yet</h3>
            <p>Create your first interview plan to get started with AI-powered preparation</p>
            <button
              className="btn btn--primary"
              onClick={handleStartNewInterview}
            >
              Create Interview Plan
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
