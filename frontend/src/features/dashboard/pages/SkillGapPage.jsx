import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useInterview } from "../../interview/hooks/useInterviewForm";
import { useSearchParams, useNavigate } from "react-router";
import "../styles/skill-gap-page.scss";

const SkillGapPage = () => {
  const [searchParams] = useSearchParams();
  const { report, getReportById, getReports } = useInterview();
  const [loading, setLoading] = useState(true);
  const [localReport, setLocalReport] = useState(null);
  const reportId = searchParams.get("reportId");
  const navigate = useNavigate();
  const [showResourcesFor, setShowResourcesFor] = useState(null);
  const [showPracticeFor, setShowPracticeFor] = useState(null);

  // Lightweight curated resources and practice questions (client-side fallback)
  const resourceMap = {
    react: [
      { title: "React Official Docs", url: "https://react.dev/" },
      { title: "React Tutorial - FreeCodeCamp", url: "https://www.freecodecamp.org/news/learn-react-by-building-a-simple-app/" },
      { title: "Epic React (articles)", url: "https://epicreact.dev/" },
    ],
    dsa: [
      { title: "GeeksforGeeks - Data Structures", url: "https://www.geeksforgeeks.org/data-structures/" },
      { title: "LeetCode Practice", url: "https://leetcode.com/" },
      { title: "NeetCode DSA Guide", url: "https://neetcode.io/" },
    ],
    sql: [
      { title: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial/" },
      { title: "SQLBolt", url: "https://sqlbolt.com/" },
    ],
    nodejs: [
      { title: "Node.js Official Docs", url: "https://nodejs.org/en/docs/" },
      { title: "Express Guide", url: "https://expressjs.com/" },
    ],
    "system design": [
      { title: "Grokking the System Design Interview (patterns)", url: "https://www.educative.io/courses/grokking-the-system-design-interview" },
      { title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" },
    ],
    communication: [
      { title: "Effective Communication Tips", url: "https://www.mindtools.com/CommSkll/CommunicationIntro.htm" },
    ],
    leadership: [
      { title: "Harvard Business Review - Leadership", url: "https://hbr.org/topic/leadership" },
    ],
  };

  const practiceMap = {
    react: [
      "Explain the React component lifecycle and hooks.",
      "Build a small todo app with state management.",
    ],
    dsa: [
      "Reverse a linked list and explain time/space complexity.",
      "Design an algorithm to find kth largest element.",
    ],
    sql: [
      "Write a query to find duplicate rows in a table.",
      "Explain JOIN types with examples.",
    ],
    nodejs: [
      "Explain the event loop and async patterns in Node.js.",
    ],
    "system design": [
      "Design a URL shortening service.",
    ],
    communication: [
      "Practice STAR-format answers for behavioral questions.",
    ],
  };

  const tipsMap = {
    react: "Build small projects and learn hooks, state management, and component patterns.",
    dsa: "Practice problem-solving daily; focus on time/space complexity and common patterns.",
    sql: "Work on real datasets and write queries for aggregation and joins.",
    nodejs: "Understand async patterns, streams, and production debugging techniques.",
    "system design": "Sketch systems on paper, consider trade-offs and scalability concerns.",
    communication: "Prepare STAR responses and practice clear, concise storytelling.",
    leadership: "Study leadership patterns and practice giving structured feedback.",
  };

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

  const handleShowResources = (skill) => {
    setShowResourcesFor(showResourcesFor === skill ? null : skill);
    setShowPracticeFor(null);
  };

  const handleShowPractice = (skill) => {
    setShowPracticeFor(showPracticeFor === skill ? null : skill);
    setShowResourcesFor(null);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-spinner">
          <div className="spinner" />
          <p>Loading skill analysis...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!activeReport) {
    return (
      <DashboardLayout>
        <div className="error-state">
          <h2>Analysis Not Found</h2>
          <p>Please create an interview plan first.</p>
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
      <div className="skill-gap-page">
        <div className="page-header">
          <button className="btn-back" onClick={() => navigate("/dashboard")}>
            ← Back
          </button>
          <h1>Skill Gap Analysis</h1>
          <p>Identify areas for improvement based on the job requirements</p>
        </div>

        <div className="gaps-content">
          {activeReport.skillGaps && activeReport.skillGaps.length > 0 ? (
            <>
              <div className="gaps-summary">
                <div className="summary-card">
                  <span className="summary-icon">📊</span>
                  <h3>Total Gaps Identified</h3>
                  <p className="summary-value">{activeReport.skillGaps.length}</p>
                </div>
              </div>

              <div className="card gaps-list-card">
                <h2>Areas to Improve</h2>
                <div className="gaps-items">
                  {activeReport.skillGaps.map((gap, idx) => {
                    const skillName = typeof gap === 'string' ? gap : (gap.skill || '').toLowerCase();
                    const resources = resourceMap[skillName] || [];
                    const practices = practiceMap[skillName] || [];

                    return (
                      <div key={idx} className="gap-item">
                        <div className="gap-number">{idx + 1}</div>
                        <div className="gap-content">
                          <h4>{typeof gap === 'string' ? gap : gap.skill || JSON.stringify(gap)}</h4>
                          <p>Focus on improving this skill to match job requirements</p>
                          <div className="gap-actions">
                            <button className="btn btn--sm btn--ghost" onClick={() => handleShowResources(skillName)}>
                              View Resources
                            </button>
                            <button className="btn btn--sm btn--ghost" onClick={() => handleShowPractice(skillName)}>
                              Practice Questions
                            </button>
                          </div>

                          {showResourcesFor === skillName && (
                            <div className="resources-list">
                              <h5>Curated Resources</h5>
                              {resources.length > 0 ? (
                                <ul>
                                  {resources.map((r, i) => (
                                    <li key={i}><a href={r.url} target="_blank" rel="noreferrer">{r.title}</a></li>
                                  ))}
                                </ul>
                              ) : (
                                <p>No curated resources found. Try searching online for "{skillName} tutorials"</p>
                              )}
                            </div>
                          )}

                          {showPracticeFor === skillName && (
                            <div className="practice-list">
                              <h5>Practice Questions</h5>
                              {practices.length > 0 ? (
                                <ol>
                                  {practices.map((q, i) => (
                                    <li key={i}>{q}</li>
                                  ))}
                                </ol>
                              ) : (
                                <p>No curated practice questions available for this skill.</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="improvement-tips">
                <h2>Improvement Tips</h2>
                <div className="tips-grid">
                  {(activeReport.skillGaps || []).map((gap, i) => {
                    const skill = (typeof gap === 'string' ? gap : gap.skill || '').toLowerCase();
                    const tip = tipsMap[skill] || "Practice regularly and focus on fundamentals for this skill.";
                    return (
                      <div className="tip-card" key={i}>
                        <span className="tip-icon">💡</span>
                        <h4>{skill || `Skill ${i + 1}`}</h4>
                        <p>{tip}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>No skill gaps identified. You're well-prepared!</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SkillGapPage;
