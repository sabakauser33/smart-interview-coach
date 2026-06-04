import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf, optimizeResumePdf } from "../services/interview.api"
import { useContext, useCallback } from "react"
import { InterviewContext } from "../interview.context"

export const useInterview = () => {

    const context = useContext(InterviewContext)

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports, clearReport } = context

    const generateReport = useCallback(async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
            } catch (error) {
            console.error(error)
            throw error
        } finally {
            setLoading(false)
        }
        return response?.interviewReport || null
    }, [setLoading, setReport])

    const getReportById = useCallback(async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
        return response?.interviewReport || null
    }, [setLoading, setReport])

    const getReports = useCallback(async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
        return response?.interviewReports || []
    }, [setLoading, setReports])

    const getResumePdf = useCallback(async (interviewReportId) => {
        const response = await generateResumePdf({ interviewReportId })
        return response
    }, [])

    const optimizeResume = useCallback(async (interviewReportId, resumeFile) => {
        const response = await optimizeResumePdf({ interviewReportId, resumeFile })
        return response
    }, [])

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf, optimizeResume, clearReport }
}