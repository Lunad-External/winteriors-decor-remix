import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Twitter, ArrowRight, Youtube, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableText } from "@/components/common/EditableText";
import { useSiteContent } from "@/hooks/useSiteContent";
import winteriorsLogo from "@/assets/logos/winteriors-logo.png";
import { offices } from "@/data/contact";

const footerLinks = {
  company: [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Projects", path: "/projects" },
    { name: "Clientele", path: "/clientele" },
    { name: "Blogs", path: "/blogs" },
    { name: "Contact Us", path: "/contact" },
  ],
};

const PinterestIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
);

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com/winteriorsdecor", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com/winteriorsdecor", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com/company/winteriorsdecor", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com/winteriorsdecor", label: "Twitter" },
  { icon: Youtube, href: "https://www.youtube.com/channel/UC6zRlUnYv-zXnQjxMUe5H7w", label: "YouTube" },
  { icon: PinterestIcon, href: "https://pinterest.com/winteriorsdecor", label: "Pinterest" },
];

export const Footer = forwardRef<HTMLElement>((_, ref) => {
  const { get } = useSiteContent();
  return (
    <footer ref={ref}>
      <div className="bg-winteriors-purple py-14 md:py-20">
        <div className="container-custom text-center">
          <EditableText contentKey="footer_cta_heading" fallback="Let's Connect" value={get("footer_cta_heading")} as="h2" className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 font-poppins" page="footer" label="CTA Heading" />
          <EditableText contentKey="footer_cta_subtitle" fallback="Ready to transform your space? Let's create something extraordinary together." value={get("footer_cta_subtitle")} as="p" className="text-white/85 text-base md:text-lg mb-8 max-w-2xl mx-auto" page="footer" label="CTA Subtitle" multiline />
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 group">
            <Link to="/enquiry">
              Start Your Project
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="bg-winteriors-purple-dark py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[80px] md:text-[120px] lg:text-[160px] font-black text-white/[0.02] font-poppins leading-none whitespace-nowrap select-none tracking-[0.15em]">
            WINTERIORS
          </span>
        </div>
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
            <div className="lg:col-span-4">
              <Link to="/" className="flex items-center gap-3 mb-5">
                <img src={winteriorsLogo} alt="Winteriors Decor LLC" className="h-12 w-auto object-contain" loading="lazy" />
                <div>
                  <span className="font-bold text-white text-lg block font-poppins">Winteriors</span>
                  <span className="text-white/70 text-sm block">Decor LLC</span>
                </div>
              </Link>
              <EditableText contentKey="footer_description" fallback="Creating inspiring workspaces that elevate the way businesses operate. 17+ years of excellence in interior design and fit-out solutions across the UAE." value={get("footer_description")} as="p" className="text-white/70 mb-5 text-sm leading-relaxed max-w-sm" page="footer" label="Company Description" multiline />
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-white/10 flex items-center justify-center hover:bg-white hover:text-primary transition-colors text-white"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>

              {/* Company profile PDF download temporarily removed — file deleted from repo.
              <a
                href="/winteriors-decor-company-profile-2026.pdf"
                download
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full md:w-auto items-center gap-3 bg-white/10 hover:bg-white text-white hover:text-primary transition-colors px-4 py-3 rounded-sm group"
              >
                <Download className="w-5 h-5 flex-shrink-0" />
                <span className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold font-poppins">Download Company Profile</span>
                  <span className="text-xs opacity-70">PDF • 2026 Edition</span>
                </span>
              </a>
              */}
            </div>

            <div className="lg:col-span-2">
              <h4 className="font-semibold text-base mb-4 font-poppins text-white">Quick Links</h4>
              <ul className="space-y-2.5">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-white/70 hover:text-white transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-6">
              <h4 className="font-semibold text-base mb-4 font-poppins text-white">Our Offices</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offices.map((office) => (
                  <div key={office.city} className="bg-white/5 p-5 rounded-sm">
                    <h5 className="font-semibold text-base mb-3 font-poppins text-white">{office.city}</h5>
                    <ul className="space-y-2.5">
                      <li className="flex items-start gap-2.5 text-white/70 text-sm">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="leading-snug">{office.address}</p>
                          <p className="text-white/50 text-xs mt-0.5">{office.poBox}</p>
                        </div>
                      </li>
                      <li>
                        <a href={`tel:${office.mobile.replace(/\s/g, '')}`} className="flex items-center gap-2.5 text-white/70 hover:text-white transition-colors text-sm">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{office.mobile}</span>
                        </a>
                      </li>
                      <li>
                        <a href={`tel:${office.tel.replace(/\s/g, '')}`} className="flex items-center gap-2.5 text-white/70 hover:text-white transition-colors text-sm">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{office.tel}</span>
                        </a>
                      </li>
                      <li>
                        <a href={`mailto:${office.email}`} className="flex items-center gap-2.5 text-white/70 hover:text-white transition-colors text-sm">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span>{office.email}</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-4">
        <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-3">
          <EditableText contentKey="footer_copyright" fallback="© 2025 All Rights Reserved. Winteriors Decor LLC | Interior Design Company Dubai Abu Dhabi" value={get("footer_copyright")} as="p" className="text-foreground/60 text-xs text-center md:text-left" page="footer" label="Copyright" />
          <div className="flex items-center gap-4">
            <p className="text-foreground/60 text-xs">
              ISO 9001 | ISO 14001 | ISO 45001 Certified
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});
