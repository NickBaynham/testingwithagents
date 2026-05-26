/*
  Single source of truth for site-wide content that components share.
  Edit here, not in components.
*/

export const site = {
  name: "Nick Baynham",
  role: "Software testing & quality engineering",
  tagline: "Software testing for the agentic era.",
  url: "https://testingwithagents.com",
  social: {
    linkedin: "https://www.linkedin.com/in/nickbaynham/",
    github: "https://github.com/NickBaynham",
  },
} as const;

export type NavLink = { readonly label: string; readonly href: string };

export const primaryNav: readonly NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Test Commander", href: "/test-commander" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];
