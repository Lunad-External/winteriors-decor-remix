interface ProjectContent {
  overview: string;
  approach: string;
  features: string[];
  result: string;
}

const categoryContent: Record<string, ProjectContent[]> = {
  "Offices": [
    {
      overview: "This corporate workspace was designed to foster innovation, collaboration, and employee well-being. Our team carefully analyzed the client's workflow requirements, brand identity, and growth projections to create an environment that supports both focused work and dynamic teamwork.",
      approach: "We adopted a human-centric design philosophy, blending ergonomic furniture solutions with biophilic design elements. The space planning prioritized natural light distribution, acoustic comfort, and seamless technology integration throughout the office.",
      features: [
        "Open-plan workstations with adjustable sit-stand desks",
        "Acoustically treated meeting pods and phone booths",
        "Executive boardroom with integrated AV systems",
        "Breakout zones with informal seating arrangements",
        "Reception area reflecting the client's brand identity",
        "Energy-efficient LED lighting with daylight sensors",
      ],
      result: "The completed space has significantly improved employee satisfaction and productivity metrics. The flexible layout accommodates the team's evolving needs while projecting a professional image to clients and visitors.",
    },
    {
      overview: "A modern office transformation that reimagines the traditional corporate environment. This project involved a complete redesign of the existing workspace to align with contemporary work culture and the client's vision for a forward-thinking headquarters.",
      approach: "Our design strategy centred on creating distinct zones for different work modes. Material selections emphasised durability, sustainability, and visual warmth.",
      features: [
        "Hot-desking areas with smart booking systems",
        "Collaborative war rooms with writable wall surfaces",
        "Wellness room and prayer space",
        "Pantry and cafe-style break area",
        "Server room with climate control systems",
        "Visitor management and waiting lounge",
      ],
      result: "The redesigned office has become a benchmark in the region for intelligent space utilisation, reducing the client's per-seat cost while dramatically enhancing the workplace experience.",
    },
  ],
  "Retail": [
    {
      overview: "This retail fit-out was crafted to deliver an immersive brand experience from the moment customers step through the door. Every design decision was guided by the goal of maximising customer engagement and sales conversion.",
      approach: "We studied customer journey patterns and visual merchandising best practices to create a layout that guides visitors naturally through product displays.",
      features: [
        "Bespoke display fixtures with integrated lighting",
        "Customer flow-optimised floor layout",
        "Point-of-sale counter with branded elements",
        "Storage and back-of-house organisation",
        "Atmospheric lighting with adjustable colour temperature",
        "Signage and wayfinding integration",
      ],
      result: "Post-opening metrics showed a notable increase in average dwell time and transaction value, confirming that the design successfully translates brand values into a compelling physical retail experience.",
    },
  ],
  "Education": [
    {
      overview: "This educational facility was designed to inspire learning and intellectual curiosity. The space combines functional flexibility with a warm, welcoming atmosphere that encourages students and staff to engage deeply with knowledge and each other.",
      approach: "We integrated modern pedagogical principles into the spatial design, creating adaptable areas that support individual study, group collaboration, and digital learning.",
      features: [
        "Flexible reading areas with modular furniture",
        "Digital learning stations with power and data access",
        "Quiet study zones with acoustic separation",
        "Group discussion rooms with AV capabilities",
        "Accessible design compliant with international standards",
        "Custom joinery for book storage and display",
      ],
      result: "The facility has been praised by educators and students alike for creating an environment that genuinely enhances the learning experience.",
    },
  ],
  "Control Room": [
    {
      overview: "This mission-critical facility was engineered for 24/7 operational excellence. The design balances the technical demands of continuous monitoring with the human need for comfort during extended shifts.",
      approach: "We collaborated closely with operations teams and technology consultants to ensure every aspect of the room meets the exacting standards required for critical infrastructure management.",
      features: [
        "Ergonomic operator consoles with multi-screen setups",
        "Raised access flooring for cable management",
        "Precision climate control with redundancy",
        "Anti-glare lighting designed for screen-based work",
        "Acoustic treatment for focused concentration",
        "Break and rest areas for shift workers",
      ],
      result: "The facility operates at maximum efficiency with operators reporting reduced fatigue and improved response times.",
    },
  ],
};

const defaultContent: ProjectContent = {
  overview: "This project showcases Winteriors Decor's commitment to delivering exceptional interior solutions that balance aesthetics with functionality.",
  approach: "We followed our proven design-build methodology, starting with comprehensive space analysis and concept development before moving into detailed design, procurement, and installation.",
  features: [
    "Custom-designed furniture and fixtures",
    "Premium material selections and finishes",
    "Integrated lighting design",
    "Space-optimised layout planning",
    "Brand-aligned design language",
    "Sustainable material choices where possible",
  ],
  result: "The completed project stands as a testament to thoughtful design and meticulous execution, delivering a space that the client is proud to occupy and showcase.",
};

export function getProjectContent(category: string, title: string): ProjectContent {
  const categoryOptions = categoryContent[category];
  if (!categoryOptions || categoryOptions.length === 0) {
    return defaultContent;
  }
  const index = title.length % categoryOptions.length;
  return categoryOptions[index];
}
