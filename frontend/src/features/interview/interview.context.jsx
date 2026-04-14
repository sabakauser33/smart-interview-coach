import { createContext, useState, useCallback } from "react";

export const InterviewContext = createContext()

export const InterviewProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState(null)
    const [reports, setReports] = useState([])

    const clearReport = useCallback(() => {
        setReport(null)
    }, [])

    return (
        <InterviewContext.Provider value={{ 
            loading, setLoading, 
            report, setReport, 
            reports, setReports,
            clearReport
        }}>
            {children}
        </InterviewContext.Provider>
    )
}