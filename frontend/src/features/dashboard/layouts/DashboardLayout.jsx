import React from "react";
import Sidebar from "../components/Sidebar";
import ErrorBoundary from "../../../components/ErrorBoundary";
import "../styles/dashboard-layout.scss";

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-content">
        <div className="dashboard-shell">
          <ErrorBoundary>
            <div className="dashboard-wrapper">{children}</div>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
