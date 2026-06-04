import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import "../auth.form.scss"

const Register = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { loading, handleRegister } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    const success = await handleRegister({ username, email, password })
    if (success) {
      navigate("/")
    } else {
      setError("Unable to create account. Please check your details and try again.")
    }
  }

  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Creating your account...</h1>
      </main>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-grid" />

      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <span className="auth-brand__dot" />
          <span>Smart Interview Coach</span>
        </div>

        {/* Heading */}
        <h1 className="auth-heading">Create an <span>account</span></h1>
        <p className="auth-subheading">Start building your personalized interview strategy today.</p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrap">
              <span className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                onChange={(e) => setUsername(e.target.value)}
                type="text" id="username" name="username"
                placeholder="johndoe"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email address</label>
            <div className="input-wrap">
              <span className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email" id="email" name="email"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <span className="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password" id="password" name="password"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-btn">Create Account</button>
        </form>

        {error && <p className="auth-error">{error}</p>}
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register