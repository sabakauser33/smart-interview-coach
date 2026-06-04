import axios from "axios";

// Use relative URLs by default so Vite dev proxy can forward requests to the backend.
// In production set `VITE_API_URL` to the deployed backend.
const baseURL = import.meta.env.VITE_API_URL || ""
const api = axios.create({
    baseURL,
    withCredentials: true,
})


/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {

    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resumeFile)

    try {
        const response = await api.post("/api/interview/", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })

        return response.data
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to generate interview report"
        throw new Error(message)
    }

}


/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`)

    return response.data
}


/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/")

    return response.data
}


/**
 * @description Service to generate resume pdf based on user self description, resume content and job description.
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob"
    })

    return response.data
}

export const optimizeResumePdf = async ({ interviewReportId, resumeFile }) => {
    const formData = new FormData()
    if (resumeFile) {
        formData.append("resume", resumeFile)
    }

    try {
        const response = await api.post(`/api/interview/report/${interviewReportId}/resume/optimize`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            responseType: "blob",
        })

        return response.data
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to optimize resume"
        throw new Error(message)
    }
}