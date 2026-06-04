import React, { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import "../styles/dashboard-page.scss";

const SalaryCalculatorPage = () => {
  const [title, setTitle] = useState("");
  const [experience, setExperience] = useState(1);
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [companyType, setCompanyType] = useState("Product");
  const [estimate, setEstimate] = useState(null);

  const calculateSalary = () => {
    const normalizedTitle = title.trim().toLowerCase();
    const skillCount = skills.split(",").filter((skill) => skill.trim()).length;

    const baseLpa = 3.5 + Math.min(Math.max(experience, 0), 5) * 0.8 + Math.max(0, experience - 5) * 0.4;
    const skillBoost = Math.min(skillCount, 5) * 0.5;
    const cityBoost = location.toLowerCase().includes("bangalore")
      ? 1.1
      : location.toLowerCase().includes("mumbai")
      ? 1.2
      : location.toLowerCase().includes("hyderabad")
      ? 0.9
      : location.toLowerCase().includes("remote")
      ? 0.7
      : 0.5;
    const companyBoost = companyType.toLowerCase() === "product"
      ? 1.1
      : companyType.toLowerCase() === "startup"
      ? 0.8
      : 0.7;
    const roleBoost = normalizedTitle.includes("senior")
      ? 1.2
      : normalizedTitle.includes("lead")
      ? 1.5
      : normalizedTitle.includes("junior")
      ? -0.5
      : 0;

    const midPoint = Math.max(3.0, baseLpa + skillBoost + cityBoost + companyBoost + roleBoost);
    const low = Math.max(3.0, midPoint - 0.7);
    const high = midPoint + 0.9;

    setEstimate({
      low: Number(low.toFixed(1)),
      high: Number(high.toFixed(1)),
    });
  };

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <div className="page-header">
          <h1>AI Salary Calculator</h1>
          <p>Estimate salary in a real India scenario with role, experience, skills, city, and company type.</p>
        </div>

        <div className="salary-calculator-layout">
          <div className="salary-calculator-card card">
            <h2>Calculator Inputs</h2>

            <div className="salary-form-grid">
              <label>
                Role
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Software Engineer"
                />
              </label>

              <label>
                Experience (years)
                <input
                  type="number"
                  min="0"
                  value={experience}
                  onChange={(e) => setExperience(Number(e.target.value))}
                />
              </label>

              <label>
                Skills
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="DSA, React"
                />
              </label>

              <label>
                City
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Bangalore"
                />
              </label>

              <label>
                Company Type
                <select value={companyType} onChange={(e) => setCompanyType(e.target.value)}>
                  <option>Product</option>
                  <option>Service</option>
                  <option>Startup</option>
                </select>
              </label>
            </div>

            <button className="btn btn--primary" type="button" onClick={calculateSalary}>
              Calculate Salary
            </button>

            {estimate !== null && (
              <div className="salary-result card salary-result--compact">
                <h3>Calculated Estimate</h3>
                <p className="salary-value">₹{estimate.low} - ₹{estimate.high} LPA approx</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SalaryCalculatorPage;
