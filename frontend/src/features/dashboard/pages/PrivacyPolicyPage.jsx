import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import "../styles/dashboard-page.scss";

const PrivacyPolicyPage = () => {
  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="page-header">
          <h1>Privacy Policy</h1>
          <p>Your privacy is important to us. This page explains how we collect and use your information.</p>
        </div>

        <div className="policy-page card">
          <h2>Information Collection</h2>
          <p>We collect only the data needed to provide the service, such as your email address, authentication details, and any interview report contents you choose to submit.</p>

          <h2>How We Use Your Data</h2>
          <p>Data is used to build your personalized interview plan, generate resume insights, and improve application functionality. We do not sell or share your personal information with third parties.</p>

          <h2>Security</h2>
          <p>We use industry-standard measures to protect your data. Sensitive data is stored securely and only accessible to authorized systems.</p>

          <h2>Contact</h2>
          <p>If you have privacy questions, please contact us at <a href="mailto:sabakauser33@gmail.com">sabakauser33@gmail.com</a>.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PrivacyPolicyPage;
