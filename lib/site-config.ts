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

export type NavChild = { readonly label: string; readonly href: string };
export type NavLink = {
  readonly label: string;
  readonly href: string;
  readonly children?: readonly NavChild[];
};

export const primaryNav: readonly NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Test Commander", href: "/test-commander" },
  {
    label: "Reference Implementations",
    href: "/reference-implementations",
    children: [
      { label: "Python Playwright", href: "/reference-implementations/python-playwright" },
      {
        label: "TypeScript Playwright",
        href: "/reference-implementations/typescript-playwright",
      },
    ],
  },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];
