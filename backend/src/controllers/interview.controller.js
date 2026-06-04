const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.services")
const interviewReportModel = require("../models/interviewReport.model")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
  try {
    const { selfDescription, jobDescription } = req.body
    let resumeText = ""

    if (req.file && req.file.buffer) {
      const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
      resumeText = resumeContent.text
    }

    if (!resumeText && !selfDescription?.trim()) {
      return res.status(400).json({
        message: "Please provide a resume file or a self description.",
      })
    }

    const interViewReportByAi = await generateInterviewReport({
      resume: resumeText,
      selfDescription,
      jobDescription,
    })

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeText,
      selfDescription,
      jobDescription,
      ...interViewReportByAi,
    })

    res.status(201).json({
      message: "Interview report generated successfully.",
      interviewReport,
    })
  } catch (error) {
    console.error("Interview report generation failed:", error)
    res.status(500).json({
      message: "Unable to generate interview report at this time. Please try again later.",
      error: error.message,
    })
  }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to upload a resume file, save it to the report, and generate an optimized PDF.
 */
async function uploadResumeOptimizeController(req, res) {
  try {
    const { interviewId } = req.params
    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found.",
      })
    }

    if (req.file && req.file.buffer) {
      const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
      interviewReport.resume = resumeContent.text
      await interviewReport.save()
    }

    const { jobDescription, selfDescription, resume } = interviewReport

    if (!resume && !selfDescription?.trim()) {
      return res.status(400).json({
        message: "Please upload a resume file or ensure your report has self-description data before optimizing.",
      })
    }

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume_${interviewId}.pdf`,
    })

    res.send(pdfBuffer)
  } catch (error) {
    console.error("Resume optimization failed:", error)
    res.status(500).json({
      message: "Unable to optimize resume at this time. Please try again later.",
      error: error.message,
    })
  }
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
  try {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewReportId, user: req.user.id })

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview report not found.",
      })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
    })

    res.send(pdfBuffer)
  } catch (error) {
    console.error("Resume PDF generation failed:", error)
    res.status(500).json({
      message: "Unable to generate resume PDF at this time. Please try again later.",
      error: error.message,
    })
  }
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, uploadResumeOptimizeController, generateResumePdfController }