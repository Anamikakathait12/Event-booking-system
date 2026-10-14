import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function errorMessage(error) {
  if (error.response?.data?.details?.length) {
    return error.response.data.details.map((detail) => detail.message).join(' ');
  }

  return error.response?.data?.error || 'We couldn’t create your account. Please try again.';
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      await register(form);
      navigate('/', { replace: true });
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-card" aria-labelledby="register-title">
        <div className="auth-eyebrow"><span className="eyebrow-dot" /> THERE’S A PLACE FOR YOU</div>
        <h1 id="register-title">Good times<br />start <em>here.</em></h1>
        <p className="auth-intro">Make an account and find your next favorite thing.</p>

        {error && <div className="form-error" role="alert">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Your name</label>
          <input
            autoComplete="name"
            id="name"
            maxLength={80}
            minLength={2}
            name="name"
            onChange={updateField}
            placeholder="Alex Morgan"
            required
            type="text"
            value={form.name}
          />

          <label htmlFor="email">Email address</label>
          <input
            autoComplete="email"
            id="email"
            maxLength={254}
            name="email"
            onChange={updateField}
            placeholder="you@example.com"
            required
            type="email"
            value={form.email}
          />

          <label htmlFor="password">Password</label>
          <input
            autoComplete="new-password"
            id="password"
            minLength={8}
            name="password"
            onChange={updateField}
            placeholder="At least 8 characters"
            required
            type="password"
            value={form.password}
          />

          <button className="button button-dark button-submit" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Creating your account…' : 'Create account'}
            <span aria-hidden="true">↗</span>
          </button>
        </form>

        <p className="auth-switch">
          Already one of us? <Link to="/login">Log in</Link>
        </p>
        <p className="form-note">By joining, you agree to keep the good times kind.</p>
      </section>

      <aside className="auth-aside register-aside" aria-label="A world of events awaits">
        <div className="aside-orbit orbit-one" />
        <div className="aside-orbit orbit-two" />
        <div className="aside-content">
          <span className="aside-kicker">YOUR CITY, A LITTLE CLOSER</span>
          <h2>Less scrolling.<br />More <em>stories.</em></h2>
          <p>Discover something new, bring someone along, and make an ordinary day a little less ordinary.</p>
          <div className="aside-stamp"><span>✳</span> SEE YOU<br />OUT THERE</div>
        </div>
        <div className="aside-bottom"><span>02 / 03</span><span>THE WORLD IS WAITING</span></div>
      </aside>
    </main>
  );
}
