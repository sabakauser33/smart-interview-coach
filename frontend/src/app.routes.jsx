import {createHashRouter} from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/interview";
import Dashboard from "./features/dashboard/pages/Dashboard";
import InterviewPlanPage from "./features/dashboard/pages/InterviewPlanPage";
import SkillGapPage from "./features/dashboard/pages/SkillGapPage";
import QuestionsPage from "./features/dashboard/pages/QuestionsPage";
import ResumeBuilderPage from "./features/dashboard/pages/ResumeBuilderPage";
import SalaryCalculatorPage from "./features/dashboard/pages/SalaryCalculatorPage";
import PrivacyPolicyPage from "./features/dashboard/pages/PrivacyPolicyPage";
import TermsOfServicePage from "./features/dashboard/pages/TermsOfServicePage";
import HelpCenterPage from "./features/dashboard/pages/HelpCenterPage";
import MockInterviewPage from "./features/dashboard/pages/MockInterviewPage";

export const router = createHashRouter([
  

    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />

    },
    
    {
    path: "/",
    element: <Protected><Home /></Protected>    
     
    },

    {
        path: "/dashboard",
        element: <Protected><Dashboard /></Protected>
    },

    {
        path: "/interview-plan",
        element: <Protected><InterviewPlanPage /></Protected>
    },

    {
        path: "/skill-gap",
        element: <Protected><SkillGapPage /></Protected>
    },

    {
        path: "/questions",
        element: <Protected><QuestionsPage /></Protected>
    },

    {
        path: "/resume-builder",
        element: <Protected><ResumeBuilderPage /></Protected>
    },

    {
        path: "/salary-calculator",
        element: <Protected><SalaryCalculatorPage /></Protected>
    },

    {
        path: "/privacy-policy",
        element: <Protected><PrivacyPolicyPage /></Protected>
    },

    {
        path: "/terms-of-service",
        element: <Protected><TermsOfServicePage /></Protected>
    },

    {
        path: "/help-center",
        element: <Protected><HelpCenterPage /></Protected>
    },

    {
        path: "/mock-interview",
        element: <Protected><MockInterviewPage /></Protected>
    },

    {
        path: "/interview/:interviewId",
        element: <Protected><Interview /></Protected>  
    }


]);