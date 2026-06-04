const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middleware/file.middleware")

const interviewRouter = express.Router();

// ✅ POST - generate report
interviewRouter.post(
  "/",
  authMiddleware.authUser,
  upload.single("resume"),
  interviewController.generateInterViewReportController
);

// ✅ GET - all reports
interviewRouter.get(
  "/",
  authMiddleware.authUser,
  interviewController.getAllInterviewReportsController
);

// ✅ GET - report by ID
interviewRouter.get(
  "/report/:interviewId",
  authMiddleware.authUser,
  interviewController.getInterviewReportByIdController
);

// ✅ POST - upload resume and optimize PDF
interviewRouter.post(
  "/report/:interviewId/resume/optimize",
  authMiddleware.authUser,
  upload.single("resume"),
  interviewController.uploadResumeOptimizeController
);

// ✅ POST - generate PDF
interviewRouter.post(
  "/resume/pdf/:interviewReportId",
  authMiddleware.authUser,
  interviewController.generateResumePdfController
);

module.exports = interviewRouter;