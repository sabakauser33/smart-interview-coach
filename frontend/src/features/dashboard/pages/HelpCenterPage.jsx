import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import "../styles/dashboard-page.scss";

const HelpCenterPage = () => {
  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="page-header">
          <h1>Help Center</h1>
          <p>Need help? Find guidance on support, contact, and frequently asked questions.</p>
        </div>

        <div className="policy-page card">
          <h2>Support</h2>
          <p>If you need assistance using Smart Interview Coach, submitting interview details, or understanding your results, we are here to help.</p>

          <h2>Contact</h2>
          <p>Reach out to us at <a href="mailto:sabakauser33@gmail.com">sabakauser33@gmail.com</a>. We aim to respond promptly to all inquiries.</p>

          <h2>Getting Started</h2>
          <p>Begin by creating an interview plan, reviewing your personalized report, and using the dashboard tools to prepare for interviews.</p>

          <h2>Frequently Asked Questions</h2>
          <ul>
            <li><strong>How do I download my resume?</strong> Use the Resume Builder page, optimize your resume, then click Download PDF.</li>
            <li><strong>Where can I view my plans?</strong> Your saved interview plans appear on the Dashboard and the Home page.</li>
            <li><strong>How do I update my profile?</strong> Profile settings are managed through the account section after login.</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HelpCenterPage;
