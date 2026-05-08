/**
 * Service Hierarchy - Single source of truth from Excel.
 * DO NOT modify category/subcategory names without explicit approval.
 */

export interface ServiceSubcategory {
  name: string;
  slug: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
}

export interface ServiceCategory {
  name: string;
  slug: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  subcategories: ServiceSubcategory[];
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export const serviceHierarchy: ServiceCategory[] = [
  {
    name: "Interior Design",
    slug: "interior-design",
    description: "At Winteriors Decor, our interior designing services are built on the foundation of creativity, functionality, and refined aesthetics. We transform shell-and-core spaces into elegant, ready-to-occupy environments.",
    metaTitle: "Interior Design Services Dubai | Winteriors Decor LLC",
    metaDescription: "Premier interior design services in Dubai — office interiors, luxury fit-outs, retail design, and end-to-end transformations for commercial spaces across UAE.",
    subcategories: [
      {
        name: "Office Interior Design",
        slug: "office-interior-design",
        description: "From small offices to corporate headquarters, we design workspaces that attract talent, impress clients, and boost productivity. Our office interior design services cover layout planning, furniture selection, branding integration, and complete fit-out execution.",
        metaTitle: "Office Interior Design Dubai | Office Designers & Fit Outs | Winteriors",
        metaDescription: "Expert office interior design in Dubai. Corporate, small office, modern workspace, and clinic interior design — from concept to handover.",
      },
      {
        name: "Retail Interior & Fit-Out",
        slug: "retail-interior-and-fit-out",
        description: "We create retail environments that captivate customers and drive sales. Our retail design expertise spans boutiques, showrooms, F&B outlets, and large-format stores with a focus on brand storytelling and customer flow.",
        metaTitle: "Retail Interior Design & Fit-Out Dubai | Winteriors Decor",
        metaDescription: "Retail interior design and fit-out services in Dubai. Boutiques, showrooms, F&B outlets — brand-driven spaces that convert.",
      },
      {
        name: "Home Office Design",
        slug: "home-office-design",
        description: "Design a productive and inspiring home office that blends seamlessly with your living space. We optimize ergonomics, storage, lighting, and aesthetics to create work-from-home environments that perform.",
        metaTitle: "Home Office Design Dubai | Winteriors Decor LLC",
        metaDescription: "Professional home office design services in Dubai. Ergonomic, stylish, and productive home workspaces tailored to your needs.",
      },
      {
        name: "Modern Office Interior Design",
        slug: "modern-office-interior-design",
        description: "Embrace contemporary design principles with open layouts, biophilic elements, smart technology integration, and flexible workspaces that reflect the modern way of working.",
        metaTitle: "Modern Office Interior Design Dubai | Winteriors Decor",
        metaDescription: "Modern office interior design in Dubai. Open-plan layouts, biophilic design, smart offices — contemporary workspaces built for today.",
      },
      {
        name: "Luxury Office Interior Design",
        slug: "luxury-office-interior-design",
        description: "Premium design solutions for executive suites, boardrooms, and high-end corporate environments. We use the finest materials, bespoke joinery, and meticulous detailing to create spaces that command respect.",
        metaTitle: "Luxury Office Interior Design Dubai | Winteriors Decor",
        metaDescription: "Luxury office interior design in Dubai. Bespoke executive suites, premium materials, and meticulous craftsmanship for elite workspaces.",
      },
      {
        name: "End-to-End Interior Design",
        slug: "end-to-end-interior-design",
        description: "A comprehensive design service from initial consultation through concept development, construction documentation, project management, and final handover — a single point of accountability for your entire project.",
        metaTitle: "End-to-End Interior Design Dubai | Winteriors Decor",
        metaDescription: "Complete end-to-end interior design services in Dubai. From concept to handover — one team, one vision, zero gaps.",
      },
      {
        name: "Enhancement Design",
        slug: "enhancement-design",
        description: "Strategic design interventions that elevate existing spaces without a full renovation. We refresh interiors through targeted upgrades to lighting, finishes, furniture, and spatial flow.",
        metaTitle: "Enhancement Design Dubai | Winteriors Decor LLC",
        metaDescription: "Interior enhancement design services in Dubai. Strategic upgrades that refresh your space without full renovation.",
      },
    ],
  },
  {
    name: "Turnkey Fit-Outs",
    slug: "turnkey-fit-outs",
    description: "Our interior fit-out services are designed to transform approved concepts into fully functional, ready-to-use spaces with precision and efficiency. We handle every element from partitions to MEP works.",
    metaTitle: "Turnkey Fit-Out Services Dubai | Winteriors Decor LLC",
    metaDescription: "Turnkey interior fit-out services in Dubai. Office, retail, warehouse, and co-working fit-outs — from shell-and-core to ready-to-occupy.",
    subcategories: [
      {
        name: "Office Fit-Out",
        slug: "office-fit-out",
        description: "Complete office fit-out solutions from partition walls and ceiling systems to MEP integration, flooring, and bespoke joinery. We deliver turnkey offices ready for day-one operations.",
        metaTitle: "Office Fit-Out Dubai | Turnkey Office Solutions | Winteriors",
        metaDescription: "Professional office fit-out services in Dubai. Partitions, ceilings, MEP, joinery — turnkey delivery from shell to move-in.",
      },
      {
        name: "Retail Fit-Out",
        slug: "retail-fit-out",
        description: "Purpose-built retail fit-outs that bring brand concepts to life. We manage everything from shopfront installations to display systems, POS areas, and back-of-house infrastructure.",
        metaTitle: "Retail Fit-Out Dubai | Shop & Store Fit-Outs | Winteriors",
        metaDescription: "Retail fit-out services in Dubai. Shopfronts, display systems, branded environments — turnkey retail execution.",
      },
      {
        name: "Shell & Core / Cat A Fit-Out",
        slug: "shell-and-core-cat-a-fit-out",
        description: "Base building fit-out services that prepare shell-and-core spaces for tenant occupation. We deliver Cat A specifications including raised floors, suspended ceilings, basic MEP, and fire safety compliance.",
        metaTitle: "Shell & Core Fit-Out Dubai | Cat A Fit-Out | Winteriors",
        metaDescription: "Shell and core Cat A fit-out services in Dubai. Base building preparation for tenant readiness — floors, ceilings, MEP, fire safety.",
      },
      {
        name: "Warehouse Fit-Out",
        slug: "warehouse-fit-out",
        description: "Industrial and warehouse fit-out services including office mezzanines, storage systems, loading areas, and climate-controlled zones tailored to operational requirements.",
        metaTitle: "Warehouse Fit-Out Dubai | Industrial Interiors | Winteriors",
        metaDescription: "Warehouse and industrial fit-out services in Dubai. Mezzanines, storage systems, office areas — optimized for operations.",
      },
      {
        name: "Co-Working Space Fit-Out",
        slug: "co-working-space-fit-out",
        description: "Flexible, multi-tenant fit-outs designed for the co-working model. We create hot-desking areas, private pods, meeting rooms, and community spaces that attract diverse professionals.",
        metaTitle: "Co-Working Space Fit-Out Dubai | Winteriors Decor",
        metaDescription: "Co-working space fit-out in Dubai. Hot desks, private offices, meeting rooms — flexible workspaces built for community.",
      },
      {
        name: "Hybrid / Phased Fit-Out",
        slug: "hybrid-phased-fit-out",
        description: "Staged fit-out execution that allows businesses to occupy spaces while construction continues in designated zones. Ideal for operational continuity during major transformations.",
        metaTitle: "Hybrid & Phased Fit-Out Dubai | Winteriors Decor",
        metaDescription: "Phased and hybrid fit-out services in Dubai. Occupy while we build — staged execution for business continuity.",
      },
      {
        name: "FF&E Procurement",
        slug: "ffande-procurement",
        description: "End-to-end furniture, fixtures, and equipment sourcing — from specification and budgeting to logistics and installation. We leverage global supply chains to deliver quality at competitive pricing.",
        metaTitle: "FF&E Procurement Dubai | Furniture & Fixtures | Winteriors",
        metaDescription: "FF&E procurement services in Dubai. Furniture, fixtures, equipment — sourced, delivered, and installed to specification.",
      },
    ],
  },
  {
    name: "Project Management",
    slug: "project-management",
    description: "Effective project management lies at the core of every successful interior design and fit-out project we deliver. From inception to handover, we take complete ownership of every detail.",
    metaTitle: "Interior Project Management Dubai | Winteriors Decor LLC",
    metaDescription: "Expert interior project management in Dubai. Design coordination, cost control, contractor management, and quality assurance from start to finish.",
    subcategories: [
      {
        name: "Design Project Management",
        slug: "design-project-management",
        description: "Coordinating the design process from brief to construction documentation. We manage stakeholders, timelines, and deliverables to ensure design intent is preserved through execution.",
        metaTitle: "Design Project Management Dubai | Winteriors Decor",
        metaDescription: "Design project management in Dubai. Stakeholder coordination, timeline control, and design integrity from brief to build.",
      },
      {
        name: "Fit-Out Project Management",
        slug: "fit-out-project-management",
        description: "On-site project management for interior fit-out works. We coordinate trades, manage schedules, control costs, and ensure quality standards are met throughout construction.",
        metaTitle: "Fit-Out Project Management Dubai | Winteriors Decor",
        metaDescription: "Fit-out project management in Dubai. Trade coordination, schedule management, cost control — on-site leadership for your project.",
      },
      {
        name: "Cost Management",
        slug: "cost-management",
        description: "Budget planning, cost estimation, value engineering, and financial tracking throughout the project lifecycle. We protect your investment with transparent reporting and proactive cost control.",
        metaTitle: "Interior Cost Management Dubai | Winteriors Decor",
        metaDescription: "Cost management for interior projects in Dubai. Budgeting, value engineering, and financial tracking for total cost control.",
      },
      {
        name: "Tender Management",
        slug: "tender-management",
        description: "Professional tender preparation, contractor prequalification, bid analysis, and negotiation services. We ensure competitive pricing and qualified execution partners for your project.",
        metaTitle: "Tender Management Dubai | Interior Projects | Winteriors",
        metaDescription: "Tender management for interior projects in Dubai. Bid preparation, contractor selection, and negotiation for best value.",
      },
      {
        name: "Contractor Management",
        slug: "contractor-management",
        description: "Comprehensive contractor oversight including performance monitoring, compliance verification, and dispute resolution. We ensure all trades deliver to specification, on time, and within budget.",
        metaTitle: "Contractor Management Dubai | Winteriors Decor",
        metaDescription: "Contractor management services in Dubai. Performance monitoring, compliance, and trade coordination for project success.",
      },
      {
        name: "Site Supervision",
        slug: "site-supervision",
        description: "Daily on-site presence to monitor construction progress, quality, safety, and compliance. Our supervisors ensure workmanship meets design specifications and industry standards.",
        metaTitle: "Site Supervision Dubai | Interior Fit-Out | Winteriors",
        metaDescription: "Professional site supervision for interior fit-out projects in Dubai. Quality, safety, and compliance monitoring on-site.",
      },
      {
        name: "Snagging & Handover",
        slug: "snagging-and-handover",
        description: "Systematic defect identification, rectification tracking, and structured handover procedures. We ensure every detail meets the agreed standard before client acceptance.",
        metaTitle: "Snagging & Handover Dubai | Winteriors Decor",
        metaDescription: "Snagging and handover services in Dubai. Defect-free delivery with systematic inspection and structured handover.",
      },
      {
        name: "Permit & NOC Management",
        slug: "permit-and-noc-management",
        description: "Navigating Dubai and Abu Dhabi's regulatory landscape — building permits, civil defense approvals, municipality NOCs, and authority inspections managed end to end.",
        metaTitle: "Permit & NOC Management Dubai | Winteriors Decor",
        metaDescription: "Permit and NOC management in Dubai & Abu Dhabi. Building permits, civil defense, municipality approvals — handled for you.",
      },
      {
        name: "Programme Scheduling",
        slug: "programme-scheduling",
        description: "Detailed project scheduling using critical path analysis, resource planning, and milestone tracking. We create realistic programmes and manage progress to keep projects on track.",
        metaTitle: "Programme Scheduling Dubai | Interior Projects | Winteriors",
        metaDescription: "Project scheduling for interior fit-outs in Dubai. Critical path planning, milestone tracking, and resource management.",
      },
      {
        name: "Quality Control",
        slug: "quality-control",
        description: "Rigorous quality assurance processes including material inspections, workmanship audits, and compliance verification against design specifications and industry standards.",
        metaTitle: "Quality Control Dubai | Interior Fit-Out | Winteriors",
        metaDescription: "Quality control for interior projects in Dubai. Material inspection, workmanship audits, and specification compliance.",
      },
      {
        name: "Post-Handover Support",
        slug: "post-handover-support",
        description: "Continued support after project completion including defect liability management, maintenance guidance, and warranty coordination with suppliers and contractors.",
        metaTitle: "Post-Handover Support Dubai | Winteriors Decor",
        metaDescription: "Post-handover support for interior projects in Dubai. Defect liability, maintenance, and warranty management.",
      },
      {
        name: "Multi-Site / Rollout Projects",
        slug: "multi-site-rollout-projects",
        description: "Standardized design and execution across multiple locations. We manage brand consistency, local compliance, and parallel delivery for multi-site rollout programmes.",
        metaTitle: "Multi-Site Rollout Projects Dubai | Winteriors Decor",
        metaDescription: "Multi-site rollout project management in Dubai. Consistent design, parallel execution across multiple locations.",
      },
    ],
  },
  {
    name: "Space Planning",
    slug: "space-planning",
    description: "Effective space planning is the foundation of every successful interior design project. We create intelligent layouts that maximize every square meter while supporting how people actually work.",
    metaTitle: "Space Planning Services Dubai | Winteriors Decor LLC",
    metaDescription: "Professional space planning services in Dubai. Commercial, office, retail, and warehouse layout optimization for maximum efficiency.",
    subcategories: [
      {
        name: "Commercial Space Planning",
        slug: "commercial-space-planning",
        description: "Strategic space planning for commercial environments including offices, mixed-use developments, and business parks. We balance density, circulation, and amenity to create productive environments.",
        metaTitle: "Commercial Space Planning Dubai | Winteriors Decor",
        metaDescription: "Commercial space planning in Dubai. Strategic layouts for offices, mixed-use, and business parks — productivity optimized.",
      },
      {
        name: "Office Space Planning",
        slug: "office-space-planning",
        description: "Workplace-specific layouts that balance open collaboration areas, private offices, meeting rooms, and support spaces. We apply workplace strategy principles to optimize headcount and functionality.",
        metaTitle: "Office Space Planning Dubai | Winteriors Decor",
        metaDescription: "Office space planning in Dubai. Open plan, private offices, meeting rooms — layouts that maximize headcount and function.",
      },
      {
        name: "Retail Layout Planning",
        slug: "retail-layout-planning",
        description: "Customer journey-driven retail layouts that maximize dwell time, product visibility, and transaction efficiency. We design floor plans that guide shoppers naturally through your brand story.",
        metaTitle: "Retail Layout Planning Dubai | Winteriors Decor",
        metaDescription: "Retail layout planning in Dubai. Customer flow, product visibility, and transaction zones — designed for conversion.",
      },
      {
        name: "Healthcare Space Planning",
        slug: "healthcare-space-planning",
        description: "Specialized layouts for clinics, medical centers, and wellness facilities that prioritize patient flow, infection control, accessibility, and regulatory compliance.",
        metaTitle: "Healthcare Space Planning Dubai | Winteriors Decor",
        metaDescription: "Healthcare space planning in Dubai. Clinics, medical centers — patient flow, accessibility, and compliance optimized.",
      },
      {
        name: "Warehouse Layout Planning",
        slug: "warehouse-layout-planning",
        description: "Operational efficiency-focused layouts for warehouses and logistics facilities. We optimize storage density, picking routes, loading zones, and office integration.",
        metaTitle: "Warehouse Layout Planning Dubai | Winteriors Decor",
        metaDescription: "Warehouse layout planning in Dubai. Storage optimization, picking routes, loading zones — logistics efficiency maximized.",
      },
      {
        name: "Furniture Layout Planning",
        slug: "furniture-layout-planning",
        description: "Detailed furniture placement plans that consider ergonomics, circulation, power/data access, and aesthetics. We create environments where every piece has purpose and position.",
        metaTitle: "Furniture Layout Planning Dubai | Winteriors Decor",
        metaDescription: "Furniture layout planning in Dubai. Ergonomic placement, circulation, power access — every piece with purpose.",
      },
      {
        name: "Circulation & Flow Analysis",
        slug: "circulation-and-flow-analysis",
        description: "Movement pattern analysis and circulation planning that eliminates bottlenecks, reduces travel distances, and creates intuitive wayfinding through interior spaces.",
        metaTitle: "Circulation & Flow Analysis Dubai | Winteriors Decor",
        metaDescription: "Circulation and flow analysis for interiors in Dubai. Movement optimization, wayfinding, and bottleneck elimination.",
      },
      {
        name: "Wayfinding Design",
        slug: "wayfinding-design",
        description: "Intuitive navigation systems including signage, visual cues, spatial hierarchy, and digital wayfinding that help people move confidently through complex environments.",
        metaTitle: "Wayfinding Design Dubai | Winteriors Decor",
        metaDescription: "Wayfinding design in Dubai. Signage, visual cues, and navigation systems for complex interior environments.",
      },
      {
        name: "Hybrid Work Space Planning",
        slug: "hybrid-work-space-planning",
        description: "Flexible workspace planning for the hybrid work model. We design adaptable environments with hot-desking, collaboration zones, quiet rooms, and technology-enabled meeting spaces.",
        metaTitle: "Hybrid Workspace Planning Dubai | Winteriors Decor",
        metaDescription: "Hybrid workspace planning in Dubai. Flexible layouts with hot-desking, collaboration zones, and tech-enabled spaces.",
      },
      {
        name: "Density & Capacity Planning",
        slug: "density-and-capacity-planning",
        description: "Optimizing occupant density within regulatory and comfort parameters. We balance headcount requirements with space quality, ventilation, and emergency egress compliance.",
        metaTitle: "Density & Capacity Planning Dubai | Winteriors Decor",
        metaDescription: "Density and capacity planning in Dubai. Occupant optimization within regulatory, comfort, and safety parameters.",
      },
      {
        name: "Space Saving Furniture",
        slug: "space-saving-furniture",
        description: "Innovative furniture solutions for compact spaces including modular systems, multi-functional pieces, and integrated storage that maximize utility without compromising design.",
        metaTitle: "Space Saving Furniture Dubai | Winteriors Decor",
        metaDescription: "Space saving furniture solutions in Dubai. Modular, multi-functional, and integrated designs for compact spaces.",
      },
      {
        name: "Multi-Use Space Design",
        slug: "multi-use-space-design",
        description: "Versatile environments that serve multiple functions — meeting rooms that convert to training spaces, lobbies that host events, and offices that adapt to changing needs throughout the day.",
        metaTitle: "Multi-Use Space Design Dubai | Winteriors Decor",
        metaDescription: "Multi-use space design in Dubai. Convertible rooms, adaptable layouts — one space, many functions.",
      },
    ],
  },
  {
    name: "Ergonomic Design",
    slug: "ergonomic-design",
    description: "We believe that a well-designed workspace should prioritize the comfort, health, and productivity of every individual. By integrating ergonomic principles, we create environments that enhance performance.",
    metaTitle: "Ergonomic Design Services Dubai | Winteriors Decor LLC",
    metaDescription: "Ergonomic interior design in Dubai. Workstation design, acoustic solutions, accessibility, and wellness-focused environments for peak performance.",
    subcategories: [
      {
        name: "Office Ergonomics",
        slug: "office-ergonomics",
        description: "Comprehensive ergonomic assessment and design for office environments. We optimize workstation setups, screen positioning, seating, and environmental factors to reduce strain and boost productivity.",
        metaTitle: "Office Ergonomics Dubai | Winteriors Decor",
        metaDescription: "Office ergonomics design in Dubai. Workstation optimization, seating, screen positioning — healthier, more productive workplaces.",
      },
      {
        name: "Workstation Design",
        slug: "workstation-design",
        description: "Purpose-built workstation configurations that support different work modes — focused tasks, collaborative sessions, and creative work — with proper ergonomic adjustment ranges.",
        metaTitle: "Workstation Design Dubai | Winteriors Decor",
        metaDescription: "Ergonomic workstation design in Dubai. Task-specific configurations with proper adjustment ranges for every work mode.",
      },
      {
        name: "Ergonomic Furniture Selection",
        slug: "ergonomic-furniture-selection",
        description: "Expert guidance in selecting ergonomic furniture that meets both health standards and design aspirations. We evaluate chairs, desks, accessories, and ancillary furniture for ergonomic compliance.",
        metaTitle: "Ergonomic Furniture Selection Dubai | Winteriors Decor",
        metaDescription: "Ergonomic furniture selection in Dubai. Chairs, desks, accessories — health-compliant and design-aligned choices.",
      },
      {
        name: "Acoustic Design",
        slug: "acoustic-design",
        description: "Sound management solutions including acoustic panels, ceiling treatments, sound masking, and spatial zoning that create comfortable acoustic environments for concentration and communication.",
        metaTitle: "Acoustic Design Dubai | Interior Acoustics | Winteriors",
        metaDescription: "Acoustic design for interiors in Dubai. Panels, ceiling treatments, sound masking — comfortable environments for focus and communication.",
      },
      {
        name: "People of Determination Ergonomics",
        slug: "people-of-determination-ergonomics",
        description: "Inclusive design solutions that ensure full accessibility and comfort for people of determination. We go beyond compliance to create genuinely welcoming and functional environments for all users.",
        metaTitle: "Accessibility Ergonomics Dubai | Winteriors Decor",
        metaDescription: "Ergonomic design for people of determination in Dubai. Beyond compliance — genuinely inclusive and functional spaces.",
      },
      {
        name: "Energy Saving Lighting Ergonomics",
        slug: "energy-saving-lighting-ergonomics",
        description: "Lighting design that balances energy efficiency with visual comfort. We specify LED systems, daylight harvesting, task lighting, and circadian-supportive solutions for healthier work environments.",
        metaTitle: "Energy Saving Lighting Dubai | Ergonomic Lighting | Winteriors",
        metaDescription: "Energy-efficient ergonomic lighting design in Dubai. LED, daylight harvesting, task lighting — comfort meets sustainability.",
      },
      {
        name: "User Efficient Furniture",
        slug: "user-efficient-furniture",
        description: "Furniture solutions designed for intuitive operation — height-adjustable desks, one-touch mechanism chairs, and modular systems that people actually use correctly without training.",
        metaTitle: "User Efficient Furniture Dubai | Winteriors Decor",
        metaDescription: "User-efficient furniture design in Dubai. Intuitive, adjustable, modular — furniture people actually use correctly.",
      },
      {
        name: "Indoor-Outdoor Connectivity Room",
        slug: "indoor-outdoor-connectivity-room",
        description: "Transitional spaces that blur the boundary between indoor and outdoor environments — biophilic meeting rooms, terrace-connected lounges, and nature-integrated breakout areas.",
        metaTitle: "Indoor-Outdoor Connectivity Dubai | Winteriors Decor",
        metaDescription: "Indoor-outdoor connectivity design in Dubai. Biophilic rooms, terrace lounges, and nature-integrated breakout spaces.",
      },
      {
        name: "Accessible & Inclusive Design",
        slug: "accessible-and-inclusive-design",
        description: "Universal design principles applied across all touchpoints — entrances, circulation, workstations, amenities, and signage — ensuring every person can navigate and use the space independently.",
        metaTitle: "Accessible & Inclusive Design Dubai | Winteriors Decor",
        metaDescription: "Accessible and inclusive interior design in Dubai. Universal design for entrances, circulation, workstations, and amenities.",
      },
      {
        name: "Hangout Spaces Design",
        slug: "hangout-spaces-design",
        description: "Informal social and relaxation zones — game rooms, coffee bars, lounge areas, and rooftop terraces — that foster team bonding, creativity, and mental well-being in the workplace.",
        metaTitle: "Hangout Spaces Design Dubai | Winteriors Decor",
        metaDescription: "Hangout and social space design in Dubai. Game rooms, lounges, coffee bars — spaces that foster team bonding and well-being.",
      },
      {
        name: "Posture & Movement Zone Design",
        slug: "posture-and-movement-zone-design",
        description: "Active workplace design featuring sit-stand zones, walking paths, stretch areas, and movement-encouraging layouts that combat sedentary behavior and promote physical health.",
        metaTitle: "Posture & Movement Design Dubai | Winteriors Decor",
        metaDescription: "Posture and movement zone design in Dubai. Sit-stand zones, walking paths — active workplace design for health.",
      },
      {
        name: "Healthcare Ergonomics",
        slug: "healthcare-ergonomics",
        description: "Specialized ergonomic solutions for healthcare settings including patient handling areas, clinical workstations, examination rooms, and staff break areas designed to reduce occupational injury.",
        metaTitle: "Healthcare Ergonomics Dubai | Winteriors Decor",
        metaDescription: "Healthcare ergonomics design in Dubai. Clinical workstations, patient areas, staff zones — reducing occupational strain.",
      },
    ],
  },
  {
    name: "Refurbishment Works",
    slug: "refurbishment-works",
    description: "Give us any type of commercial interiors for refurbishing. Our fit-out contractors can develop a complete new theme. We breathe new life into existing workplaces with comprehensive renovation solutions.",
    metaTitle: "Refurbishment Works Dubai | Winteriors Decor LLC",
    metaDescription: "Commercial refurbishment services in Dubai. Office renovation, retail refresh, facade upgrades, MEP systems — comprehensive interior renewal.",
    subcategories: [
      {
        name: "Office Refurbishment",
        slug: "office-refurbishment",
        description: "Complete office renovation from structural modifications to finish upgrades. We modernize outdated workplaces while minimizing disruption to ongoing operations.",
        metaTitle: "Office Refurbishment Dubai | Winteriors Decor",
        metaDescription: "Office refurbishment services in Dubai. Complete renovation with minimal disruption — modernize your workplace.",
      },
      {
        name: "Office Renovation",
        slug: "office-renovation",
        description: "Targeted renovation works addressing specific areas — reception upgrades, meeting room modernization, breakout area creation, and workspace reconfiguration.",
        metaTitle: "Office Renovation Dubai | Winteriors Decor",
        metaDescription: "Office renovation in Dubai. Reception upgrades, meeting rooms, breakout areas — targeted improvements that transform.",
      },
      {
        name: "Retail Renovation",
        slug: "retail-renovation",
        description: "Refreshing retail spaces to reflect updated brand identities, new product lines, or changing customer expectations. We execute renovations within tight operational windows.",
        metaTitle: "Retail Renovation Dubai | Winteriors Decor",
        metaDescription: "Retail renovation services in Dubai. Brand refresh, layout updates, and store modernization within tight timelines.",
      },
      {
        name: "Facade Refurbishment",
        slug: "facade-refurbishment",
        description: "External facade upgrades including cladding replacement, glass curtain wall maintenance, signage updates, and entrance modernization that refresh the building's public face.",
        metaTitle: "Facade Refurbishment Dubai | Winteriors Decor",
        metaDescription: "Facade refurbishment in Dubai. Cladding, glazing, signage, entrances — refresh your building's public presence.",
      },
      {
        name: "MEP Upgrade Works",
        slug: "mep-upgrade-works",
        description: "Mechanical, electrical, and plumbing system upgrades including HVAC modernization, electrical distribution, lighting systems, and plumbing infrastructure renewal.",
        metaTitle: "MEP Upgrade Works Dubai | Winteriors Decor",
        metaDescription: "MEP upgrade services in Dubai. HVAC, electrical, lighting, plumbing — infrastructure renewal for modern performance.",
      },
      {
        name: "Ceiling Renovation",
        slug: "ceiling-renovation",
        description: "Ceiling system replacement and upgrade — from basic grid ceilings to architectural features including bulkheads, coffers, linear systems, and integrated lighting solutions.",
        metaTitle: "Ceiling Renovation Dubai | Winteriors Decor",
        metaDescription: "Ceiling renovation in Dubai. Grid systems, architectural features, bulkheads, integrated lighting — elevated overhead design.",
      },
      {
        name: "Wall Renovation",
        slug: "wall-renovation",
        description: "Wall treatment upgrades including partition reconfiguration, feature wall installation, acoustic treatment, wallcovering, and paint systems that transform spatial character.",
        metaTitle: "Wall Renovation Dubai | Winteriors Decor",
        metaDescription: "Wall renovation in Dubai. Partitions, feature walls, acoustic treatment, wallcovering — transform your spatial character.",
      },
      {
        name: "Flooring Replacement",
        slug: "flooring-replacement",
        description: "Complete flooring renewal including subfloor preparation, raised access floors, carpet tiles, luxury vinyl, porcelain, and natural stone — specified for performance and aesthetics.",
        metaTitle: "Flooring Replacement Dubai | Winteriors Decor",
        metaDescription: "Flooring replacement in Dubai. Carpet tiles, LVT, porcelain, stone — performance flooring specified and installed.",
      },
      {
        name: "Partial vs Full Refurbishment",
        slug: "partial-vs-full-refurbishment",
        description: "Strategic guidance on refurbishment scope — whether targeted interventions or complete overhaul delivers better ROI for your specific situation, timeline, and budget.",
        metaTitle: "Partial vs Full Refurbishment Dubai | Winteriors Decor",
        metaDescription: "Partial or full refurbishment in Dubai? Strategic guidance on scope, ROI, timeline, and budget for your renovation.",
      },
      {
        name: "Gypsum Refurbishment",
        slug: "gypsum-refurbishment",
        description: "Specialized gypsum board works including partition repair, ceiling restoration, decorative features, and fire-rated assemblies — restoring and upgrading drywall systems throughout your space.",
        metaTitle: "Gypsum Refurbishment Dubai | Winteriors Decor",
        metaDescription: "Gypsum refurbishment in Dubai. Partition repair, ceiling restoration, decorative features, fire-rated assemblies.",
      },
    ],
  },
];

/** Flat lookup helpers */
export function getCategoryBySlug(slug: string): ServiceCategory | undefined {
  return serviceHierarchy.find((c) => c.slug === slug);
}

export function getSubcategoryBySlug(
  categorySlug: string,
  subcategorySlug: string
): { category: ServiceCategory; subcategory: ServiceSubcategory } | undefined {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return undefined;
  const subcategory = category.subcategories.find((s) => s.slug === subcategorySlug);
  if (!subcategory) return undefined;
  return { category, subcategory };
}

/** Get all category/subcategory route pairs for routing */
export function getAllServiceRoutes(): Array<{
  categorySlug: string;
  subcategorySlug: string;
}> {
  return serviceHierarchy.flatMap((cat) =>
    cat.subcategories.map((sub) => ({
      categorySlug: cat.slug,
      subcategorySlug: sub.slug,
    }))
  );
}
