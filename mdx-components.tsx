import type { MDXComponents } from "mdx/types";
import { Diagram } from "@/components/mdx/Diagram";
import { RecruiterSummary } from "@/components/RecruiterSummary";
import { RepoLink } from "@/components/mdx/RepoLink";
import { TechList } from "@/components/mdx/TechList";

const components: MDXComponents = {
  Diagram,
  RecruiterSummary,
  RepoLink,
  TechList,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
