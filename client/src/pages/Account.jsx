import { useAuth } from '../context/AuthContext.jsx';

export default function Account() {
  const { user } = useAuth();

  return (
    <main className="simple-page">
      <span className="auth-eyebrow"><span className="eyebrow-dot" /> YOUR GATHER</span>
      <h1>Hey, {user.name.split(' ')[0]}<em>.</em></h1>
      <p>You’re all set. Keep an eye out for something worth showing up for.</p>
      <div className="account-card">
        <span className="account-avatar">{user.name.charAt(0).toUpperCase()}</span>
        <div><strong>{user.name}</strong><span>{user.email}</span></div>
        <span className="account-role">{user.role}</span>
      </div>
    </main>
  );
}
