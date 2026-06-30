/** Single source of truth for site-wide info. Never hardcode these in markup. */

export interface SocialLink {
  label: string;
  url: string;
}

export const SITE_URL = "https://labs.jordan-t.dev";

export const siteConfig = {
  name: "Jordan Taisne",
  role: "Tech Lead Front-End · Junior Architect",
  url: SITE_URL,
  // User-facing copy: French (French typography, no em dash).
  title: "Labs · Jordan Taisne",
  description:
    "Galerie d'expériences techniques interactives : CSS, animations, performance, WebGL et POCs. Le terrain de jeu front-end, en complément du portfolio.",
  /** Sister site: the durable Next.js portfolio. */
  portfolio: {
    label: "jordan-t.dev",
    url: "https://jordan-t.dev",
  },
  socials: [
    { label: "GitHub", url: "https://github.com/Jordan-T" },
    { label: "GitLab", url: "https://gitlab.com/Jordan-T" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/jordantaisne59" },
  ] satisfies SocialLink[],
} as const;
