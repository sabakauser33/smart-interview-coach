import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useInterview } from "../../interview/hooks/useInterviewForm";
import { useSearchParams, useNavigate } from "react-router";
import "../styles/mock-interview-page.scss";

const MockInterviewPage = () => {
  const [searchParams] = useSearchParams();
  const { report, getReportById, getReports } = useInterview();
  const [loading, setLoading] = useState(true);
  const [localReport, setLocalReport] = useState(null);
  const [startedInterview, setStartedInterview] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [recordingError, setRecordingError] = useState("");
  const mediaRecorderRef = useRef(null);
  const reportId = searchParams.get("reportId");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (reportId) {
        await getReportById(reportId);
      } else {
        // Try to fetch user's reports and use the latest as fallback
        try {
          const list = await getReports();
          if (mounted && Array.isArray(list) && list.length > 0) {
            setLocalReport(list[0]);
          }
        } catch (err) {
          console.error(err);
        }
      }
      if (mounted) setLoading(false);
    };

    load();

    return () => { mounted = false };
  }, [reportId, getReportById, getReports]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-spinner">
          <div className="spinner" />
          <p>Loading mock interview...</p>
        </div>
      </DashboardLayout>
    );
  }

  const activeReport = report || localReport;

  if (!activeReport) {
    return (
      <DashboardLayout>
        <div className="error-state">
          <h2>Interview Plan Not Found</h2>
          <p>Please generate an interview plan to use the Mock Interview feature.</p>
          <div className="error-actions">
            <button
              className="btn btn--primary"
              onClick={() => navigate("/interview-plan")}
            >
              Create Interview Plan
            </button>
            <button className="btn btn--ghost" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const allQuestions = [
    ...(activeReport.technicalQuestions || []),
    ...(activeReport.behavioralQuestions || []),
  ];

  const handleStartInterview = () => {
    if (allQuestions.length === 0) {
      return;
    }
    setStartedInterview(true);
    setCurrentQuestionIndex(0);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinishInterview = () => {
    setStartedInterview(false);
  };

  const handleRecordVoice = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      return;
    }

    if (!navigator.mediaDevices || !window.MediaRecorder) {
      setRecordingError("Voice recording is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const newUrl = URL.createObjectURL(blob);
        if (audioURL) URL.revokeObjectURL(audioURL);
        setAudioURL(newUrl);
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecordingError("");
      setIsRecording(true);
    } catch (error) {
      console.error(error);
      setRecordingError("Microphone access denied or unavailable.");
    }
  };

  if (startedInterview && allQuestions.length > 0) {
    const currentQuestion = allQuestions[currentQuestionIndex];

    return (
      <DashboardLayout>
        <div className="mock-interview-active">
          {/* Progress Header */}
          <div className="interview-header">
            <div className="progress-info">
              <h2>Mock Interview Session</h2>
              <span className="progress-text">
                Question {currentQuestionIndex + 1} of {allQuestions.length}
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Question Display */}
          <div className="interview-card">
            <div className="question-display">
              <div className="question-badge">
                {currentQuestion.category || "Question"}
              </div>
              <h3>{currentQuestion.question}</h3>
              <p className="question-hint">
                Take your time to answer. Aim for a 2-3 minute response.
              </p>
            </div>

            {/* Answer Input */}
            <div className="answer-section">
              <label>Your Answer</label>
              <textarea
                placeholder="Type your answer here or use voice recording..."
                className="answer-input"
              />
              <div className="answer-actions">
                <button
                  className={`btn ${isRecording ? "btn--danger" : "btn--ghost"}`}
                  type="button"
                  onClick={handleRecordVoice}
                >
                  <span>🎤</span>
                  {isRecording ? "Stop Recording" : "Record Voice Answer"}
                </button>
              </div>

              {recordingError && (
                <p className="recording-error">{recordingError}</p>
              )}

              {audioURL && (
                <div className="recording-preview">
                  <p className="recording-label">Recorded answer</p>
                  <audio controls src={audioURL} />
                </div>
              )}
            </div>

            {/* Model Answer */}
            <div className="model-answer">
              <h4>
                <span>✨</span> Model Answer Reference
              </h4>
              <p>{currentQuestion.answer}</p>
            </div>

            {/* Navigation */}
            <div className="interview-controls">
              <button
                className="btn btn--ghost"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                ← Previous
              </button>

              <button
                className={`btn ${currentQuestionIndex === allQuestions.length - 1 ? "btn--danger" : "btn--primary"}`}
                onClick={
                  currentQuestionIndex === allQuestions.length - 1
                    ? handleFinishInterview
                    : handleNextQuestion
                }
              >
                {currentQuestionIndex === allQuestions.length - 1
                  ? "Finish Interview"
                  : "Next Question"}
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mock-interview-page">
        <div className="page-header">
          <button className="btn-back" onClick={() => navigate("/dashboard")}>
            ← Back
          </button>
          <h1>Mock Interview</h1>
          <p>Practice with AI-powered interview simulation</p>
        </div>

        <div className="interview-content">
          <div className="card intro-card">
            <div className="intro-icon">🎤</div>
            <h2>Ready for a Mock Interview?</h2>
            <p>
              This simulated interview will test your knowledge with questions based on
              the job description and your profile. You'll get feedback on each answer.
            </p>

            <div className="interview-stats">
              <div className="stat">
                <span className="stat-label">Total Questions</span>
                <span className="stat-value">{allQuestions.length}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Estimated Time</span>
                <span className="stat-value">
                  {Math.round((allQuestions.length * 2.5) / 60)} minutes
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Question Mix</span>
                <span className="stat-value">
                  {(activeReport.technicalQuestions || []).length} Technical, {(activeReport.behavioralQuestions || []).length} Behavioral
                </span>
              </div>
            </div>

            <button
              className="btn btn--primary btn--lg"
              onClick={handleStartInterview}
              disabled={allQuestions.length === 0}
            >
              <span>🚀</span>
              Start Mock Interview
            </button>

            {allQuestions.length === 0 && (
              <p className="muted">No questions available for this report. Generate a report with more details to enable mock interviews.</p>
            )}
          </div>

          {/* Tips */}
          <div className="tips-section">
            <h2>Interview Tips</h2>
            <div className="tips-list">
              <div className="tip-item">
                <span className="tip-icon">1️⃣</span>
                <div>
                  <h4>Think Before Speaking</h4>
                  <p>Take 10-15 seconds to gather your thoughts</p>
                </div>
              </div>
              <div className="tip-item">
                <span className="tip-icon">2️⃣</span>
                <div>
                  <h4>Structure Your Answer</h4>
                  <p>Follow: Situation → Action → Result (STAR method)</p>
                </div>
              </div>
              <div className="tip-item">
                <span className="tip-icon">3️⃣</span>
                <div>
                  <h4>Be Specific</h4>
                  <p>Use concrete examples and metrics from your experience</p>
                </div>
              </div>
              <div className="tip-item">
                <span className="tip-icon">4️⃣</span>
                <div>
                  <h4>Stay Within Time</h4>
                  <p>Aim for 2-3 minutes per answer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MockInterviewPage;
