import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import "../styles/dashboard-page.scss";

const TermsOfServicePage = () => {
  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="page-header">
          <h1>Terms of Service</h1>
          <p>These terms govern your use of Smart Interview Coach and the services it provides.</p>
        </div>

        <div className="policy-page card">
          <h2>Service Use</h2>
          <p>By using this service, you agree to provide accurate information and use the platform in a lawful manner.</p>

          <h2>Content Ownership</h2>
          <p>Any content you submit or generate through the platform remains your property. We retain a license to display it within the service and improve the product.</p>

          <h2>Liability</h2>
          <p>Smart Interview Coach is provided for educational and preparation purposes only. We are not liable for decisions made based on salary estimates or interview recommendations.</p>

          <h2>Questions</h2>
          <p>For questions about our terms, email <a href="mailto:sabakauser33@gmail.com">sabakauser33@gmail.com</a>.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TermsOfServicePage;
