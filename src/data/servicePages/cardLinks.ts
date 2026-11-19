/**
 * Links for service cards ("Explore …") and "View all projects" buttons whose page did not exist yet.
 * Paste the URL between the quotes, e.g. "/services/space-planning/office-layout-planning".
 * Empty = the card shows its button but is not clickable (no pointer), so visitors never hit a dead link.
 * Keys are the card titles exactly as in the client's reference HTML. URLs from the SEO team (ECT-376 hand-off doc).
 */
export const cardLinks: Record<string, Record<string, string>> = {
  "interior-design": {
    "Budget Office Interior Design": "/services/interior-design/budget-office-interior-design",
    "Executive Office Interior Design": "/services/interior-design/executive-office-interior-design",
    "Premium Office Interior Design": "/services/interior-design/premium-office-interior-design",
    "Minimalist Office Interior Design": "/services/interior-design/minimalist-office-interior-design",
    "Modern Office Interior Design": "/services/interior-design/modern-office-interior-design",
    "Biophilic Office Interior Design": "/services/interior-design/biophilic-office-interior-design",
    "Hybrid Office Interior Design": "/services/interior-design/hybrid-office-interior-design",
    "Industrial Office Interior Design": "/services/interior-design/industrial-office-interior-design",
    "Open Plan Office Interior Design": "/services/interior-design/open-plan-office-interior-design",
    "View All Projects": "/projects",
  },
  "turnkey-fit-outs": {
    "View all office fit out projects": "/projects",
    "Office Fit Out Dubai": "/services/turnkey-fit-outs/office-fit-out-dubai",
    "Office Fit Out Abu Dhabi": "/services/turnkey-fit-outs/office-fit-out-abu-dhabi",
    "Design and Build": "/services/turnkey-fit-outs/design-and-build",
    "Commercial Fit Out": "/services/turnkey-fit-outs/commercial-fit-out",
    "Office Partitions": "/services/turnkey-fit-outs/office-partitions",
    "Cat A and Cat B Fit Out": "/services/turnkey-fit-outs/cat-a-and-cat-b-fit-out",
  },
  "project-management": {
    "Fit Out Approvals Dubai and Abu Dhabi": "/services/project-management/fit-out-approvals-dubai-abu-dhabi",
  },
  "space-planning": {
    "Office Layout Planning": "/services/space-planning/office-layout-planning",
    "Test Fit and Feasibility": "/services/space-planning/test-fit-and-feasibility",
    "Hybrid Workplace Planning": "/services/space-planning/hybrid-workplace-planning",
  },
  "ergonomic-design": {
    "Office Workstations": "/services/ergonomic-design/office-workstations",
    "Office Furniture Planning": "/services/ergonomic-design/office-furniture-planning",
    "Acoustic and Lighting Design": "/services/ergonomic-design/acoustic-and-lighting-design",
    "Workplace Wellbeing": "/services/ergonomic-design/workplace-wellbeing",
  },
  "refurbishment-works": {
    "Office Renovation Dubai": "/services/refurbishment-works/office-renovation-dubai",
    "Office Renovation Abu Dhabi": "/services/refurbishment-works/office-renovation-abu-dhabi",
    "Live Office Refurbishment": "/services/refurbishment-works/live-office-refurbishment",
    "MEP Upgrades": "/services/refurbishment-works/mep-upgrades",
  },
};
