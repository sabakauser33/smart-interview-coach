import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useInterview } from "../../interview/hooks/useInterviewForm";
import { useSearchParams, useNavigate } from "react-router";
import "../styles/resume-builder-page.scss";

const ResumeBuilderPage = () => {
  const [searchParams] = useSearchParams();
  const { report, getReportById, getReports, getResumePdf, optimizeResume } = useInterview();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("");
  const [optimizedResumeBlob, setOptimizedResumeBlob] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [localReport, setLocalReport] = useState(null);
  const reportId = searchParams.get("reportId");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const activeReport = report || localReport;
  const currentReportId = reportId || activeReport?._id;

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

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setResumeFile(file);
    setResumeFileName(file?.name || "");
  };

  const handleOptimizeResume = async () => {
    if (!currentReportId) {
      alert("Unable to optimize resume without a report. Please return to the dashboard and select a report.");
      return;
    }

    if (!resumeFile && !activeReport?.resume && !activeReport?.selfDescription) {
      alert("Please upload a resume file or ensure your report contains resume or self-description data before optimizing.");
      return;
    }

    setOptimizing(true);
    setStatusMessage("");
    try {
      const optimizedBlob = await optimizeResume(currentReportId, resumeFile);
      setOptimizedResumeBlob(optimizedBlob);
      setStatusMessage("Your resume has been optimized and is ready to download.");
    } catch (error) {
      console.error("Optimize failed:", error);
      alert("Failed to optimize resume. Please try again.");
    } finally {
      setOptimizing(false);
    }
  };

  const handleDownloadResume = async () => {
    if (!currentReportId) {
      alert("Unable to download resume without a report. Please return to the dashboard and select a report.");
      return;
    }

    setDownloading(true);
    try {
      const blob = optimizedResumeBlob || await getResumePdf(currentReportId);
      const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${currentReportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download resume. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-spinner">
          <div className="spinner" />
          <p>Loading resume builder...</p>
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

  return (
    <DashboardLayout>
      <div className="resume-builder-page">
        <div className="page-header">
          <button className="btn-back" onClick={() => navigate("/dashboard")}>
            ← Back
          </button>
          <h1>Resume Builder</h1>
          <p>Optimize your resume for the target position</p>
        </div>

        <div className="resume-content">
          {/* Quick Actions */}
          <div className="actions-section">
            <div className="card action-card">
              <div className="action-icon">📥</div>
              <h3>Upload Original Resume</h3>
              <p>Start with your current resume</p>
              <button className="btn btn--ghost" type="button" onClick={handleChooseFile}>
                {resumeFileName ? `File: ${resumeFileName}` : "Choose File"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>

            <div className="card action-card">
              <div className="action-icon">✨</div>
              <h3>AI Optimization</h3>
              <p>Tailor resume for this job</p>
              <button className="btn btn--primary" type="button" onClick={handleOptimizeResume} disabled={optimizing}>
                {optimizing ? "Optimizing..." : "Optimize Now"}
              </button>
            </div>

            <div className="card action-card">
              <div className="action-icon">⬇️</div>
              <h3>Download Resume</h3>
              <p>Get your optimized resume as PDF</p>
              <button
                className="btn btn--primary"
                onClick={handleDownloadResume}
                disabled={downloading}
              >
                {downloading ? "Downloading..." : "Download PDF"}
              </button>
            </div>
          </div>

          {statusMessage && (
            <div className="status-message">
              <p>{statusMessage}</p>
            </div>
          )}

          {/* Resume Preview */}
          <div className="card resume-preview">
            <h2>Resume Preview</h2>
            {activeReport.resume ? (
              <div className="preview-content">
                <div className="resume-text">
                  {activeReport.resume.substring(0, 500)}...
                </div>
                <p className="preview-note">
                  Full resume text is displayed above. Edit and download to get your customized version.
                </p>
              </div>
            ) : (
              <p>No resume data available</p>
            )}
          </div>

          {/* Tips */}
          <div className="tips-section">
            <h2>Resume Optimization Tips</h2>
            <div className="tips-grid">
              <div className="tip-card">
                <span className="tip-number">1</span>
                <h4>Use Keywords</h4>
                <p>Include job description keywords to pass ATS screening</p>
              </div>
              <div className="tip-card">
                <span className="tip-number">2</span>
                <h4>Highlight Achievements</h4>
                <p>Focus on results and metrics that matter</p>
              </div>
              <div className="tip-card">
                <span className="tip-number">3</span>
                <h4>Tailor for Each Job</h4>
                <p>Customize your resume for the specific role</p>
              </div>
              <div className="tip-card">
                <span className="tip-number">4</span>
                <h4>Keep It Concise</h4>
                <p>One page for most professionals, two max</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResumeBuilderPage;
