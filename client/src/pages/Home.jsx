import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <main className="home-page">
      <section className="hero">
        <div className="hero-copy">
          <span className="auth-eyebrow"><span className="eyebrow-dot" /> A LITTLE MORE OUT OF THE ORDINARY</span>
          <h1>Find your<br />kind of <em>people.</em></h1>
          <p>
            A good night out. A new favorite band. A room full of strangers who won’t be strangers for long.
            It all starts with showing up.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#discover">Explore events <span aria-hidden="true">↗</span></a>
            {!isAuthenticated && <Link className="button button-outline" to="/register">Join Gather</Link>}
            {isAuthenticated && <span className="hero-welcome">Good to see you, {user.name.split(' ')[0]}.</span>}
          </div>
          <div className="hero-footnote"><span>✳</span> MADE FOR THE MOMENTS THAT STICK</div>
        </div>
        <div className="hero-art" aria-label="Illustration of a lively event">
          <div className="art-sun" />
          <div className="art-ring ring-large" />
          <div className="art-ring ring-small" />
          <div className="art-card card-back"><span>THE GOOD<br />STUFF IS<br />OUT THERE.</span></div>
          <div className="art-card card-front">
            <span className="card-tag">TONIGHT LOOKS GOOD</span>
            <span className="card-star">✳</span>
            <span className="card-event">Meet me<br />out there<span className="brand-period">.</span></span>
            <span className="card-caption">YOUR NEXT STORY STARTS HERE</span>
          </div>
          <span className="art-spark spark-one">✳</span>
          <span className="art-spark spark-two">✳</span>
          <span className="art-note">GOOD ENERGY<br />ONLY</span>
        </div>
      </section>

      <section className="discover-strip" id="discover">
        <div>
          <span className="strip-label">A CITY FULL OF POSSIBILITIES</span>
          <h2>Your next story is <em>out there.</em></h2>
        </div>
        <p>We’re making it easier to find the events worth leaving home for. The lineup is just getting started.</p>
        <span className="strip-mark" aria-hidden="true">g.</span>
      </section>
    </main>
  );
}
