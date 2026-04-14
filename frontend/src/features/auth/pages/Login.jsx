import React, { useState , useEffect} from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Login = () => {
  const { loading, handleLogin, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {                    // ← add this
    if (user) navigate('/')
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await handleLogin({ email, password })
    navigate('/')
  }

  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Signing you in...</h1>
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
        <h1 className="auth-heading">Welcome <span>back</span></h1>
        <p className="auth-subheading">Sign in to access your personalized interview plans.</p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="auth-btn">Sign In</button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}

export default Login