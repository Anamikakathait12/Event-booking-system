import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function errorMessage(error) {
  return error.response?.data?.error || 'We couldn’t sign you in. Please try again.';
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-card" aria-labelledby="login-title">
        <div className="auth-eyebrow"><span className="eyebrow-dot" /> YOUR NEXT GOOD NIGHT STARTS HERE</div>
        <h1 id="login-title">Welcome<br />back<span className="brand-period">.</span></h1>
        <p className="auth-intro">Pick up where the good times left off.</p>

        {error && <div className="form-error" role="alert">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input
            autoComplete="email"
            id="email"
            name="email"
            onChange={updateField}
            placeholder="you@example.com"
            required
            type="email"
            value={form.email}
          />

          <div className="label-row">
            <label htmlFor="password">Password</label>
          </div>
          <input
            autoComplete="current-password"
            id="password"
            name="password"
            onChange={updateField}
            placeholder="Enter your password"
            required
            type="password"
            value={form.password}
          />

          <button className="button button-dark button-submit" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Signing you in…' : 'Log in'}
            <span aria-hidden="true">↗</span>
          </button>
        </form>

        <p className="auth-switch">
          New around here? <Link to="/register">Create an account</Link>
        </p>
      </section>

      <aside className="auth-aside" aria-label="Discover live events">
        <div className="aside-orbit orbit-one" />
        <div className="aside-orbit orbit-two" />
        <div className="aside-content">
          <span className="aside-kicker">LIFE HAPPENS OUT THERE</span>
          <h2>Make room<br />for <em>something</em><br /><em>memorable.</em></h2>
          <p>From tiny rooms to big nights. Find the people and places worth showing up for.</p>
          <div className="aside-stamp"><span>✳</span> GOOD THINGS<br />HAPPEN TOGETHER</div>
        </div>
        <div className="aside-bottom"><span>01 / 03</span><span>FIND YOUR PEOPLE</span></div>
      </aside>
    </main>
  );
}
