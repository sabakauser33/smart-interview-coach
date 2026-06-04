const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())

const allowedOrigins = [
  "http://localhost:5173",
  "https://smart-interview-coach-pilj.vercel.app",
]

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}))

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204)
  }
  next()
})

/* require all the routes here */
const authRouter = require("./routes/auth.route")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});



module.exports = app