const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
})

const DEFAULT_MODEL = process.env.GOOGLE_GENAI_PRIMARY_MODEL || "gemini-1.5"
const FALLBACK_MODELS = Array.from(
  new Set([
    DEFAULT_MODEL,
    ...(process.env.GOOGLE_GENAI_FALLBACK_MODEL || "gemini-1.5-pro,gemini-2.0,gemini-2.0-pro,gemini-2.5-flash-Lite,gemini-2.5-flash").split(",").map((model) => model.trim()).filter(Boolean),
  ]),
)

const interviewReportSchema = z.object({
  matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
  technicalQuestions: z.array(
    z.object({
      question: z.string().describe("The technical question can be asked in the interview"),
      intention: z.string().describe("The intention of interviewer behind asking this question"),
      answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc."),
    }),
  ).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
  behavioralQuestions: z.array(
    z.object({
      question: z.string().describe("The technical question can be asked in the interview"),
      intention: z.string().describe("The intention of interviewer behind asking this question"),
      answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc."),
    }),
  ).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
  skillGaps: z.array(
    z.object({
      skill: z.string().describe("The skill which the candidate is lacking"),
      severity: z.enum(["low", "medium", "high"]).describe(
        "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
      ),
    }),
  ).describe("List of skill gaps in the candidate's profile along with their severity"),
  preparationPlan: z.array(
    z.object({
      day: z.number().describe("The day number in the preparation plan, starting from 1"),
      focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
      tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc."),
    }),
  ).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
  title: z.string().describe("The title of the job for which the interview report is generated"),
})

const resumePdfSchema = z.object({
  html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer"),
})

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function generateContentWithRetries({ model, contents, config, maxRetries = 3 }) {
  let lastError
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await ai.models.generateContent({ model, contents, config })
    } catch (error) {
      lastError = error
      console.error(`[AI] ${model} attempt ${attempt} failed:`, error?.message ?? error)
      if (attempt < maxRetries) {
        await wait(1500 * attempt)
      }
    }
  }
  throw lastError
}

function parseJsonResponse(text) {
  try {
    return JSON.parse(text)
  } catch (error) {
    throw new Error(`Invalid JSON response from AI: ${error.message}`)
  }
}

async function launchBrowser() {
  return puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  })
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await launchBrowser()
  const page = await browser.newPage()
  await page.setContent(htmlContent, { waitUntil: "networkidle0" })

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  })

  await browser.close()
  return pdfBuffer
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const prompt = `Generate an interview report for a candidate with the following details:\nResume: ${resume}\nSelf Description: ${selfDescription}\nJob Description: ${jobDescription}\n\nPlease provide the output as a JSON object that conforms to the expected schema. Include at least 10 technical questions and at least 10 behavioral questions. For each question include the fields: \"question\", \"intention\", and \"answer\". Ensure the JSON is valid and matches the schema exactly.`

  let lastError
  for (const model of FALLBACK_MODELS) {
    try {
      const response = await generateContentWithRetries({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: zodToJsonSchema(interviewReportSchema),
        },
      })

      const parsed = parseJsonResponse(response.text)
      return interviewReportSchema.parse(parsed)
    } catch (error) {
      lastError = error
      console.warn(`[AI] Interview report generation failed with ${model}:`, error?.message ?? error)
    }
  }

  throw lastError
}

function wrapResumeHtml(html) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;margin:0;padding:24px;line-height:1.5;color:#111;} .content{max-width:800px;margin:0 auto;}</style></head><body><div class="content">${html}</div></body></html>`
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const prompt = `Generate resume for a candidate with the following details:\nResume: ${resume}\nSelf Description: ${selfDescription}\nJob Description: ${jobDescription}\n\nThe response should be a JSON object with a single field \"html\" which contains the HTML content of the resume. The resume should be tailored for the job description, look professional, ATS friendly, and be 1-2 pages long when converted to PDF.`

  let lastError
  for (const model of FALLBACK_MODELS) {
    try {
      const response = await generateContentWithRetries({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: zodToJsonSchema(resumePdfSchema),
        },
      })

      const parsed = parseJsonResponse(response.text)
      const validated = resumePdfSchema.parse(parsed)
      try {
        return await generatePdfFromHtml(wrapResumeHtml(validated.html))
      } catch (pdfError) {
        console.warn("PDF generation failed for AI HTML, retrying with plain wrapper:", pdfError?.message ?? pdfError)
        return await generatePdfFromHtml(wrapResumeHtml(validated.html))
      }
    } catch (error) {
      lastError = error
      console.warn(`[AI] Resume PDF generation failed with ${model}:`, error?.message ?? error)
    }
  }

  throw lastError
}

module.exports = { generateInterviewReport, generateResumePdf }