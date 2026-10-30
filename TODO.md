# PassForge delivery ToDo

## 1. Responsive branded interface and information architecture
- [x] Create a polished premium SaaS website, not a basic AI-generated or generic dashboard template; the password generator is the visual centerpiece.
- [x] Use the requested restrained palette: deep charcoal/near-black `#0B0D12`, secondary surfaces `#121620`, electric violet `#8B5CF6`, soft blue `#60A5FA`, off-white `#F4F4F5`, muted gray `#9298A5`, soft green success and subtle dark-gray borders. Keep generous spacing, subtle borders and elegant shadows, 12–18px rounded corners, modern typography, consistent icons and responsive mobile/tablet/desktop layouts.
- [x] Header includes PassForge logo/brand name and Generator, Security and About navigation; a minimal theme toggle may be included only if functional and fitting the design.
- [x] Hero includes `PRIVATE. SECURE. INSTANT.`, heading `Generate stronger passwords.`, and supporting text `Create secure, random passwords in seconds. Your passwords stay on your device.` directly above the generator.
- [x] Below the generator, include Why PassForge cards: Strong Randomness — cryptographically secure random generation; Complete Privacy — passwords stay on the device; Instant Generation — create new passwords in seconds.
- [x] Include Password Security Tips: use unique passwords for every account; prefer long, randomly generated passwords; never share passwords; consider using a reputable password manager; enable two-factor authentication where available.
- [x] Include expandable FAQ questions: Is PassForge free? Are my passwords stored? How are passwords generated? What makes a password strong? Can I use PassForge on mobile?
- [x] Footer includes PassForge logo, short description, working on-page navigation links, Privacy Policy and copyright; avoid unnecessary social media icons and fake links. The Privacy Policy link opens clear policy content on password handling.

## 2. Client-side cryptographic password generation and controls
- [x] Generate passwords entirely client-side with browser Web Crypto API `crypto.getRandomValues`; never use `Math.random()` for password generation; never send generated passwords to a server, persist them, store them in localStorage/cookies/databases, or log them.
- [x] Avoid biased random selection when mapping random bytes to characters.
- [x] Generator panel displays generated password(s) and offers working copy, regenerate and show/hide controls, with clear visual feedback when copied.
- [x] Password length supports 8–64 characters with slider, selected-length display and manual numeric input.
- [x] Individually toggle uppercase letters `A–Z`, lowercase letters `a–z`, numbers `0–9` and symbols (`!@#$%^&*` etc.).
- [x] Additional controls: exclude similar characters (`O`, `0`, `I`, `l`); exclude ambiguous symbols; generate 1–10 passwords; allow copying each generated password individually.
- [x] Require at least one character type selected and gracefully handle invalid configurations, empty pools and edge cases.
- [x] Ensure exact requested length and selected character behavior; satisfy each selected character-set requirement while preserving the exact length.

## 3. Calibrated strength analysis and privacy content
- [x] Strength indicator updates when the password configuration changes and does not rely on password length alone: calculate from the actual character pool and password length.
- [x] Show Weak, Fair, Strong or Very Strong, an animated visual strength meter, estimated entropy in bits and a short explanation.
- [x] Do not make misleading claims that any password is impossible to crack.
- [x] Display exactly: `Your passwords are generated locally in your browser. PassForge does not collect, transmit or store your generated passwords.`

## 4. Accessibility, interactions and finish quality
- [x] Smooth, fast, tasteful hover transitions; subtle button scaling on hover/press; restrained animated glow on the primary action; smooth slider movement and strength-meter transition; subtle fade/slide on generation; smooth copy confirmation; animated toggles and subtle card entrance animations.
- [x] Respect the user's reduced-motion accessibility preference.
- [x] Every interactive element has a meaningful action; no decorative nonfunctional buttons.
- [x] Use semantic HTML, keyboard navigation, visible focus states, accessible labels, good contrast and readable typography; interface works across screen sizes and loads quickly with minimal unnecessary dependencies.
- [x] Final result is a complete functional website, not a visual mockup, with clean reusable components, separate password-generation logic and robust error/edge handling.