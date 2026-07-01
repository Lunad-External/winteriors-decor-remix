import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import winteriorsLogo from "@/assets/logos/winteriors-logo.png";

const services = [
  { name: "Interior Design", id: "interior-design" },
  { name: "Turnkey Fit-Outs", id: "turnkey-fit-outs" },
  { name: "Project Management", id: "project-management" },
  { name: "Space Planning", id: "space-planning" },
  { name: "Ergonomic Design", id: "ergonomic-design" },
  { name: "Refurbishment Works", id: "refurbishment-works" },
];

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Services", path: "/services", hasDropdown: true },
  { name: "Projects", path: "/projects" },
  { name: "Clientele", path: "/clientele" },
  { name: "Contact", path: "/contactus" },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleServiceClick = (serviceId: string) => {
    setIsServicesOpen(false);
    navigate(`/services/${serviceId}`);
  };

  const pagesWithHero = ["/", "/about", "/services", "/clientele", "/contactus", "/blogs", "/enquiry"];
  const isProjectDetail = location.pathname.startsWith("/projects/");
  const isServicePage = location.pathname.startsWith("/services/");
  const hasHeroBehindHeader = pagesWithHero.includes(location.pathname) || isProjectDetail || isServicePage;
  const solidHeader = isScrolled || !hasHeroBehindHeader;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          solidHeader
            ? "bg-background shadow-md py-4"
            : "bg-transparent py-5"
        }`}
        style={!solidHeader ? { textShadow: '0 1px 8px rgba(0,0,0,0.8), 0 0 3px rgba(0,0,0,0.6)' } : undefined}
      >
        <div className="container-custom">
          <nav className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={winteriorsLogo}
                alt="Winteriors Decor LLC"
                className={`h-14 md:h-16 w-auto object-contain ${!solidHeader ? 'drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]' : ''}`}
                loading="eager"
              />
              <div className="hidden sm:block">
                <span className={`font-poppins font-bold text-lg md:text-xl leading-tight block ${solidHeader ? 'text-foreground' : 'text-white'}`}>
                  Winteriors
                </span>
                <span className={`text-xs md:text-sm -mt-0.5 block ${solidHeader ? 'text-muted-foreground' : 'text-white/80'}`}>
                  Decor LLC
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                link.hasDropdown ? (
                  <div key={link.path} ref={dropdownRef} className="relative">
                    <button
                      onClick={() => setIsServicesOpen(!isServicesOpen)}
                      className={`flex items-center gap-1 text-sm font-medium cursor-pointer transition-colors ${
                        location.pathname === link.path
                          ? solidHeader
                            ? "text-primary"
                            : "text-white font-semibold underline underline-offset-4 decoration-primary decoration-2"
                          : solidHeader
                            ? "text-muted-foreground hover:text-foreground"
                            : "text-white/90 hover:text-white"
                      }`}
                      style={!solidHeader ? { textShadow: '0 1px 8px rgba(0,0,0,0.8), 0 0 3px rgba(0,0,0,0.6)' } : undefined}
                    >
                      {link.name}
                      <ChevronDown className={`w-4 h-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} style={!solidHeader ? { filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.8)) drop-shadow(0 0 2px rgba(0,0,0,0.6))' } : undefined} />
                    </button>

                    <AnimatePresence>
                      {isServicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 w-56 bg-background border border-border shadow-lg z-50"
                        >
                          <Link
                            to="/services"
                            onClick={() => setIsServicesOpen(false)}
                            className="block w-full text-left px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors border-b border-border"
                          >
                            Services
                          </Link>
                          {services.map((service) => (
                            <button
                              key={service.id}
                              onClick={() => handleServiceClick(service.id)}
                              className="block w-full text-left px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                            >
                              {service.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? solidHeader
                          ? "text-primary"
                          : "text-white font-semibold underline underline-offset-4 decoration-primary decoration-2"
                        : solidHeader
                          ? "text-muted-foreground hover:text-foreground"
                          : "text-white/90 hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-6">
              <a
                href="tel:+97126432711"
                className={`flex items-center gap-2 text-sm font-medium ${solidHeader ? 'text-foreground' : 'text-white'}`}
              >
                <Phone className="w-4 h-4" style={!solidHeader ? { filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.8)) drop-shadow(0 0 2px rgba(0,0,0,0.6))' } : undefined} />
                +971 2 6432711
              </a>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link to="/enquiry">Send Enquiry</Link>
              </Button>
            </div>

            <button
              className={`lg:hidden p-2 ${solidHeader ? 'text-foreground' : 'text-white'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[9998] lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed top-0 right-0 bottom-0 w-[280px] max-w-[80vw] bg-background border-l border-border z-[9999] lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-end mb-8">
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-foreground hover:text-primary transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    link.hasDropdown ? (
                      <div key={link.path}>
                        <Link
                          to={link.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`text-lg font-medium py-2 block transition-colors ${
                            location.pathname === link.path
                              ? "text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {link.name}
                        </Link>
                        <div className="pl-4 space-y-1">
                          {services.map((service) => (
                            <button
                              key={service.id}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                handleServiceClick(service.id);
                              }}
                              className="block w-full text-left py-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            >
                              {service.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`text-lg font-medium py-2 transition-colors ${
                          location.pathname === link.path
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {link.name}
                      </Link>
                    )
                  ))}
                  <Button asChild variant="default" className="mt-4 w-full bg-primary hover:bg-primary/90">
                    <Link to="/enquiry" onClick={() => setIsMobileMenuOpen(false)}>Send Enquiry</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
