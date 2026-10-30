import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Clipboard,
  Copy,
  Eye,
  EyeOff,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  estimateEntropy,
  generatePassword,
  getCharacterPool,
  type PasswordSettings,
} from "@/lib/password";

const INITIAL_SETTINGS: PasswordSettings & { count: number } = {
  length: 24,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeSimilar: true,
  excludeAmbiguous: false,
  count: 1,
};

const CHARACTER_OPTIONS: {
  key: "uppercase" | "lowercase" | "numbers" | "symbols";
  title: string;
  sample: string;
  ariaLabel: string;
}[] = [
  { key: "uppercase", title: "Uppercase", sample: "A–Z", ariaLabel: "Include uppercase letters A to Z" },
  { key: "lowercase", title: "Lowercase", sample: "a–z", ariaLabel: "Include lowercase letters a to z" },
  { key: "numbers", title: "Numbers", sample: "0–9", ariaLabel: "Include numbers from 0 to 9" },
  { key: "symbols", title: "Symbols", sample: "!@#$%", ariaLabel: "Include symbols and punctuation" },
];

const STRENGTH_LABELS = ["Weak", "Fair", "Strong", "Very Strong"] as const;

type StrengthIndex = 0 | 1 | 2 | 3;

function strengthIndex(bits: number): StrengthIndex {
  if (bits < 40) return 0;
  if (bits < 60) return 1;
  if (bits < 80) return 2;
  return 3;
}

async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Try the local selection fallback when clipboard permission is unavailable.
    }
  }

  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(field);
  if (!copied) throw new Error("Clipboard access was not granted. Select and copy the password instead.");
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <label className="toggle-row">
      <span className="toggle-copy">
        <span className="toggle-title">{label}</span>
        <span className="toggle-description">{description}</span>
      </span>
      <input
        className="sr-only"
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-label={label}
      />
      <span className={`switch-track${checked ? " is-on" : ""}`} aria-hidden="true">
        <span className="switch-thumb" />
      </span>
    </label>
  );
}

export default function Generator() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [lengthDraft, setLengthDraft] = useState(String(INITIAL_SETTINGS.length));
  const [passwords, setPasswords] = useState<string[]>([]);
  const [visible, setVisible] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState("");
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pool = useMemo(() => getCharacterPool(settings), [settings]);
  const entropy = useMemo(() => estimateEntropy(settings), [settings]);
  const strength = strengthIndex(entropy);

  const createBatch = () => {
    if (!pool.size) {
      setPasswords([]);
      setError("Choose at least one character type to generate a password.");
      return;
    }
    try {
      const next = Array.from({ length: settings.count }, () => generatePassword(settings));
      setPasswords(next);
      setError("");
    } catch (cause) {
      setPasswords([]);
      setError(cause instanceof Error ? cause.message : "Secure generation could not be completed.");
    }
  };

  useEffect(() => {
    createBatch();
    // Regenerate immediately whenever a generation setting changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );

  const changeSetting = <K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const changeLength = (value: number) => {
    const safeValue = Math.min(64, Math.max(8, value));
    setLengthDraft(String(safeValue));
    changeSetting("length", safeValue);
  };

  const onLengthInput = (value: string) => {
    setLengthDraft(value);
    if (/^\d{1,2}$/.test(value)) {
      const parsed = Number(value);
      if (parsed >= 8 && parsed <= 64) changeSetting("length", parsed);
    }
  };

  const finishLengthInput = () => {
    const parsed = Number(lengthDraft);
    if (!Number.isInteger(parsed) || parsed < 8 || parsed > 64) {
      setLengthDraft(String(settings.length));
      return;
    }
    changeLength(parsed);
  };

  const handleCopy = async (password: string, key: string) => {
    try {
      await copyText(password);
      setCopied(key);
      setError("");
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(null), 1700);
    } catch (cause) {
      setCopied(null);
      setError(cause instanceof Error ? cause.message : "Unable to copy this password.");
    }
  };

  const copyLabel = (key: string) => (copied === key ? "Copied" : "Copy password");
  const trackProgress = `${((settings.length - 8) / 56) * 100}%`;

  return (
    <section className="generator-card" id="generator" aria-labelledby="generator-title">
      <div className="generator-heading">
        <div>
          <div className="section-eyebrow"><span className="eyebrow-dot" /> PASSWORD GENERATOR</div>
          <h2 id="generator-title">Your next password, made random.</h2>
          <p>Fine-tune your settings. Every change creates a fresh password on this device.</p>
        </div>
        <div className="local-badge"><LockKeyhole size={14} strokeWidth={1.8} /> LOCAL ONLY</div>
      </div>

      <div className="result-panel">
        <div className="result-topline">
          <span className="result-label">{passwords.length > 1 ? "GENERATED PASSWORDS" : "GENERATED PASSWORD"}</span>
          <div className="result-actions">
            <button
              type="button"
              className="icon-button"
              onClick={() => setVisible((current) => !current)}
              aria-label={visible ? "Hide passwords" : "Show passwords"}
              title={visible ? "Hide passwords" : "Show passwords"}
              disabled={!passwords.length}
            >
              {visible ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={createBatch}
              aria-label="Regenerate passwords"
              title="Regenerate passwords"
              disabled={!pool.size}
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
        {passwords.length === 1 ? (
          <div className="password-line" key={passwords[0]}>
            <code aria-label={visible ? `Generated password, ${passwords[0].length} characters` : `Password hidden, ${passwords[0].length} characters`}>
              {visible ? passwords[0] : "•".repeat(passwords[0].length)}
            </code>
            <button
              type="button"
              className={`copy-button${copied === "password-0" ? " is-copied" : ""}`}
              onClick={() => void handleCopy(passwords[0], "password-0")}
              aria-label={copyLabel("password-0")}
            >
              {copied === "password-0" ? <Check size={16} /> : <Copy size={16} />}
              <span>{copyLabel("password-0")}</span>
            </button>
          </div>
        ) : passwords.length > 1 ? (
          <div className="password-list">
            {passwords.map((password, index) => {
              const key = `password-${index}`;
              return (
                <div className="password-list-row" key={`${index}-${password}`}>
                  <span className="password-index">{String(index + 1).padStart(2, "0")}</span>
                  <code aria-label={visible ? `Password ${index + 1}, ${password.length} characters` : `Password ${index + 1} hidden, ${password.length} characters`}>
                    {visible ? password : "•".repeat(password.length)}
                  </code>
                  <button
                    type="button"
                    className={`row-copy${copied === key ? " is-copied" : ""}`}
                    onClick={() => void handleCopy(password, key)}
                    aria-label={`${copyLabel(key)} ${index + 1}`}
                  >
                    {copied === key ? <Check size={15} /> : <Clipboard size={15} />}
                    <span>{copied === key ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-result"><span className="empty-lock"><LockKeyhole size={19} /></span><span>Choose a character set to begin</span></div>
        )}
        <div className="strength-row" aria-live="polite">
          <div className="strength-copy">
            <span className={`strength-label strength-${strength}`}>{pool.size ? STRENGTH_LABELS[strength] : "No character set"}</span>
            <span className="entropy-value">{Math.round(entropy)} bits estimated entropy</span>
          </div>
          <div className={`strength-meter meter-${strength}`} role="img" aria-label={pool.size ? `${STRENGTH_LABELS[strength]} estimated strength` : "Strength unavailable until a character set is selected"}>
            {STRENGTH_LABELS.map((label, index) => (
              <span key={label} className={pool.size && index <= strength ? "meter-segment active" : "meter-segment"} />
            ))}
          </div>
        </div>
        <p className="strength-explanation">
          {!pool.size
            ? "Select at least one character type to estimate the search space."
            : strength === 0
              ? "This setting offers a limited search space. Try adding length or character types."
              : strength === 1
                ? "A useful start. More length or variety can improve resilience for important accounts."
                : strength === 2
                  ? "A solid random combination. Use a unique password for every account."
                  : "High estimated entropy. Keep it protected in a reputable password manager."}
          <span> Estimates are informational and do not account for every real-world risk.</span>
        </p>
      </div>

      <div className="settings-grid">
        <div className="setting-block length-block">
          <div className="setting-label-row">
            <label htmlFor="password-length" className="setting-title">Password length</label>
            <div className="length-number-wrap">
              <input
                id="password-length"
                className="length-number"
                type="number"
                inputMode="numeric"
                min={8}
                max={64}
                step={1}
                value={lengthDraft}
                onChange={(event) => onLengthInput(event.target.value)}
                onBlur={finishLengthInput}
                onKeyDown={(event) => {
                  if (event.key === "Enter") event.currentTarget.blur();
                }}
                aria-describedby="length-hint"
              />
              <span>chars</span>
            </div>
          </div>
          <input
            id="length-slider"
            className="length-slider"
            type="range"
            min={8}
            max={64}
            step={1}
            value={settings.length}
            onChange={(event) => changeLength(Number(event.target.value))}
            style={{ "--range-progress": trackProgress } as React.CSSProperties}
            aria-label={`Password length: ${settings.length} characters`}
            aria-valuetext={`${settings.length} characters`}
          />
          <div className="range-labels" id="length-hint"><span>8 characters</span><span>64 characters</span></div>
        </div>

        <div className="setting-block count-block">
          <label htmlFor="password-count" className="setting-title">Generate multiple</label>
          <div className="select-wrap">
            <select
              id="password-count"
              value={settings.count}
              onChange={(event) => changeSetting("count", Number(event.target.value))}
              aria-label="Number of passwords to generate"
            >
              {Array.from({ length: 10 }, (_, index) => index + 1).map((count) => (
                <option key={count} value={count}>{count} {count === 1 ? "password" : "passwords"}</option>
              ))}
            </select>
            <span className="select-chevron" aria-hidden="true">⌄</span>
          </div>
        </div>
      </div>

      <div className="option-section">
        <div className="option-section-heading">
          <h3>Character types</h3>
          <span>Choose what to include</span>
        </div>
        <div className="character-options">
          {CHARACTER_OPTIONS.map((option) => (
            <label className={`character-option${settings[option.key] ? " selected" : ""}`} key={option.key}>
              <input
                type="checkbox"
                checked={settings[option.key]}
                onChange={(event) => changeSetting(option.key, event.target.checked)}
                aria-label={option.ariaLabel}
              />
              <span className="character-check" aria-hidden="true">{settings[option.key] ? <Check size={13} /> : null}</span>
              <span className="character-name">{option.title}</span>
              <span className="character-sample">{option.sample}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="advanced-options">
        <div className="option-section-heading advanced-heading">
          <h3>Fine-tune</h3>
          <span>Optional exclusions</span>
        </div>
        <div className="toggle-grid">
          <Toggle
            checked={settings.excludeSimilar}
            onChange={(value) => changeSetting("excludeSimilar", value)}
            label="Exclude similar characters"
            description="Avoid O, 0, I and l"
          />
          <Toggle
            checked={settings.excludeAmbiguous}
            onChange={(value) => changeSetting("excludeAmbiguous", value)}
            label="Exclude ambiguous symbols"
            description="Skip look-alike punctuation"
          />
        </div>
      </div>

      <div className="generator-bottom">
        <p><ShieldCheck size={15} /> Generated in your browser. Never sent anywhere.</p>
        <button className="generate-button" type="button" onClick={createBatch} disabled={!pool.size}>
          <Sparkles size={17} />
          Generate {settings.count > 1 ? `${settings.count} passwords` : "password"}
        </button>
      </div>
      <div className="sr-only" aria-live="polite" aria-atomic="true">{copied ? "Password copied to clipboard." : ""}</div>
      {error ? <div className="generator-error" role="alert">{error}</div> : null}
    </section>
  );
}
