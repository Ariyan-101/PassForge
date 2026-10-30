import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  Moon,
  ShieldCheck,
  Sun,
  Zap,
} from "lucide-react";
import Generator from "@/components/Generator";

const privacyStatement =
  "Your passwords are generated locally in your browser. PassForge does not collect, transmit or store your generated passwords.";

const benefits = [
  {
    icon: Fingerprint,
    number: "01",
    title: "Strong randomness",
    description: "Every character is picked with your browser’s cryptographically secure random number generator—not a predictable shortcut.",
    iconClass: "violet",
  },
  {
    icon: LockKeyhole,
    number: "02",
    title: "Complete privacy",
    description: "Your password never leaves this device. No account, upload or history is involved in creating it.",
    iconClass: "blue",
  },
  {
    icon: Zap,
    number: "03",
    title: "Instant by design",
    description: "Adjust your settings and make a fresh password in a moment. No waiting, no unnecessary steps.",
    iconClass: "green",
  },
];

const securityTips = [
  "Use a unique password for every account.",
  "Prefer long, randomly generated passwords.",
  "Never share passwords in a message or call.",
  "Consider using a reputable password manager.",
  "Enable two-factor authentication wherever available.",
];

const faqs = [
  {
    question: "Is PassForge free?",
    answer: "Yes. PassForge is free to use. Generate as many passwords as you need, with no account or subscription required.",
  },
  {
    question: "Are my passwords stored?",
    answer: "No. Generated passwords exist only in this page’s temporary memory while it is open. PassForge does not collect, transmit or store them. Refreshing or closing the page clears them.",
  },
  {
    question: "How are passwords generated?",
    answer: "PassForge uses the browser’s Web Crypto API to draw secure random bytes, then applies unbiased rejection sampling to choose characters from your selected sets. Generation happens on your device.",
  },
  {
    question: "What makes a password strong?",
    answer: "Length and the number of possible characters both matter. PassForge estimates entropy from your selected character pool and password length. Use a unique password and keep it in a trusted password manager.",
  },
  {
    question: "Can I use PassForge on mobile?",
    answer: "Yes. The layout adapts to mobile phones and tablets, and the controls work with touch, keyboard and assistive technologies.",
  },
];

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a className={`brand${footer ? " footer-brand" : ""}`} href="#top" aria-label="PassForge home">
      <img src={`${import.meta.env.BASE_URL}passforge-mark.svg`} width="38" height="38" alt="" />
      <span className="brand-name">Pass<span>Forge</span></span>
    </a>
  );
}

export default function Home() {
  const [lightTheme, setLightTheme] = useState(false);

  return (
    <div className={`app-shell${lightTheme ? " theme-light" : ""}`} id="top">
      <header className="site-header">
        <div className="header-inner page-container">
          <Brand />
          <nav className="main-nav" aria-label="Main navigation">
            <a className="nav-active" href="#generator">Generator</a>
            <a href="#security">Security</a>
            <a href="#about">About</a>
          </nav>
          <button
            className="theme-button"
            type="button"
            onClick={() => setLightTheme((current) => !current)}
            aria-label={`Switch to ${lightTheme ? "dark" : "light"} theme`}
            title={`Switch to ${lightTheme ? "dark" : "light"} theme`}
          >
            {lightTheme ? <Moon size={17} /> : <Sun size={17} />}
            <span>{lightTheme ? "Dark" : "Light"}</span>
          </button>
        </div>
      </header>

      <main>
        <section className="hero-section page-container" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="hero-label"><span className="status-dot" /> PRIVATE. SECURE. INSTANT.</div>
            <h1 id="hero-title">Generate stronger<br /><span>passwords.</span></h1>
            <p className="hero-description">Create secure, random passwords in seconds.<br className="desktop-break" /> Your passwords stay on your device.</p>
            <a className="hero-link" href="#generator">Make a password <ArrowRight size={16} /></a>
          </div>
          <div className="hero-aside" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="hero-lock"><KeyRound size={29} strokeWidth={1.5} /></div>
            <div className="hero-aside-note"><span className="hero-aside-line" />LOCAL BY DEFAULT</div>
            <span className="orbit-dot dot-top" />
            <span className="orbit-dot dot-bottom" />
          </div>
        </section>

        <div className="page-container generator-wrap">
          <Generator />
          <div className="micro-trust"><CheckCircle2 size={15} /><span>No account needed</span><i /><span>No password history</span><i /><span>Nothing sent to a server</span></div>
        </div>

        <section className="about-section page-container" id="about" aria-labelledby="about-title">
          <div className="section-intro">
            <span className="eyebrow">WHY PASSFORGE?</span>
            <h2 id="about-title">Privacy is the <span>starting point.</span></h2>
            <p>PassForge keeps the useful part simple and the important part close: your passwords are made right here, on your device.</p>
          </div>
          <div className="benefit-grid">
            {benefits.map(({ icon: Icon, number, title, description, iconClass }) => (
              <article className="benefit-card" key={title}>
                <div className="benefit-card-top"><span className={`benefit-icon ${iconClass}`}><Icon size={19} strokeWidth={1.8} /></span><span className="card-number">{number}</span></div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="security-section" id="security" aria-labelledby="security-title">
          <div className="page-container security-layout">
            <div className="security-copy">
              <span className="eyebrow">PASSWORD SECURITY TIPS</span>
              <h2 id="security-title">Small habits.<br /><span>Meaningful protection.</span></h2>
              <p>A strong password is one part of keeping an account secure. Pair it with a few dependable habits.</p>
              <ul className="tip-list">
                {securityTips.map((tip) => <li key={tip}><span className="tip-check"><CheckCircle2 size={17} /></span>{tip}</li>)}
              </ul>
            </div>
            <aside className="privacy-card" id="privacy" aria-labelledby="privacy-title">
              <div className="privacy-card-heading"><span className="privacy-icon"><ShieldCheck size={21} /></span><span className="privacy-tag">THE PASSFORGE PROMISE</span></div>
              <h3 id="privacy-title">A password should be yours alone.</h3>
              <p>{privacyStatement}</p>
              <div className="privacy-card-rule" />
              <div className="privacy-footnote"><LockKeyhole size={14} /><span>Generated in your browser. Cleared when you leave.</span></div>
            </aside>
          </div>
        </section>

        <section className="faq-section page-container" aria-labelledby="faq-title">
          <div className="faq-intro">
            <span className="eyebrow">FREQUENTLY ASKED QUESTIONS</span>
            <h2 id="faq-title">Good to <span>know.</span></h2>
            <p>Questions about your passwords or how PassForge works? Start here.</p>
          </div>
          <div className="faq-list">
            {faqs.map(({ question, answer }, index) => (
              <details className="faq-item" key={question}>
                <summary><span className="faq-index">0{index + 1}</span><span className="faq-question">{question}</span><span className="faq-chevron" aria-hidden="true">+</span></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="privacy-policy-section page-container" id="privacy-policy" aria-labelledby="privacy-policy-title">
          <div className="privacy-policy-heading">
            <span className="eyebrow">PRIVACY POLICY</span>
            <h2 id="privacy-policy-title">Private by default.</h2>
          </div>
          <div className="privacy-policy-copy">
            <p>{privacyStatement}</p>
            <p>Generated passwords are held in the open page only so you can view or copy them. PassForge creates no password history and does not save generated passwords in browser storage or a database. Refreshing or closing the page clears the current results.</p>
            <p>Copying is optional and happens only when you choose a copy control; the selected password is written to your device clipboard so you can use it.</p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-container footer-main">
          <div className="footer-about"><Brand footer /><p>Thoughtful password generation.<br />Private by design.</p></div>
          <div className="footer-links-wrap">
            <div className="footer-link-group"><span>EXPLORE</span><a href="#generator">Generator</a><a href="#security">Security tips</a><a href="#about">About PassForge</a></div>
            <div className="footer-link-group"><span>YOUR PRIVACY</span><a href="#privacy-policy">Privacy Policy <ArrowRight size={13} /></a><a href="#faq-title">Frequently asked questions</a></div>
          </div>
        </div>
        <div className="page-container footer-bottom"><span>© {new Date().getFullYear()} PassForge. Made for better security.</span><span><LockKeyhole size={13} /> Your passwords stay on this device.</span></div>
      </footer>
    </div>
  );
}
