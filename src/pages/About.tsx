import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/common/PageHero";
import { EditableText } from "@/components/common/EditableText";
import { CertificateLightbox } from "@/components/common/CertificateLightbox";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ZoomIn } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import aboutHero from "@/assets/about-hero.jpg";
import aboutTeamMeeting from "@/assets/about-team-meeting.jpg";
import { teamMembers } from "@/data/team";
import groupPicture from "@/assets/team/group-picture.jpg";
import iso9001Cert from "@/assets/certificates/iso-9001-cert.jpg";
import iso14001Cert from "@/assets/certificates/iso-14001-cert.jpg";
import iso45001Cert from "@/assets/certificates/iso-45001-cert.jpg";

const AboutPage = () => {
  const { get } = useSiteContent();
  const certifications = [
    { name: "ISO 9001:2015", description: "Quality Management System", image: iso9001Cert },
    { name: "ISO 14001:2015", description: "Environmental Management", image: iso14001Cert },
    { name: "ISO 45001:2018", description: "Occupational Health & Safety", image: iso45001Cert },
  ];

  const [lightboxCert, setLightboxCert] = useState<{ image: string; name: string } | null>(null);

  return (
    <Layout>
      <Helmet>
        <title>About Us | Winteriors Decor LLC - Interior Design Company Dubai</title>
        <meta name="description" content="Learn about Winteriors Decor LLC's 17+ year journey in delivering exceptional commercial interior design and fit-out solutions across Dubai and Abu Dhabi." />
      </Helmet>

      <PageHero
        title={get("about_hero_title", "What Makes Us Stand Out")}
        subtitle={get("about_hero_subtitle", "At Winteriors Decor, we specialize in creating inspiring workspaces that elevate the way businesses operate.")}
        backgroundImage={aboutHero}
        compact
      />

      <section className="py-12 md:py-16 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <EditableText
                contentKey="about_main_heading"
                fallback="Winteriors Decor LLC - Creating Spaces that are a joy to work in!"
                value={get("about_main_heading")}
                as="h2"
                className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-poppins"
                page="about"
                label="Main Heading"
              />
              <EditableText
                contentKey="about_main_p1"
                fallback="At Winteriors Decor, we believe that great design is more than aesthetics—it is about creating meaningful spaces that inspire people every day."
                value={get("about_main_p1")}
                as="p"
                className="text-muted-foreground mb-6 leading-relaxed text-justify"
                page="about"
                label="Main Paragraph 1"
                multiline
              />
              <EditableText
                contentKey="about_main_p2"
                fallback="Our team consists of experienced designers, architects, project managers, and craftsmen who work collaboratively to provide end-to-end solutions."
                value={get("about_main_p2")}
                as="p"
                className="text-muted-foreground leading-relaxed text-justify"
                page="about"
                label="Main Paragraph 2"
                multiline
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <img src={aboutTeamMeeting} alt="Winteriors team meeting" loading="lazy" className="w-full shadow-lg" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-secondary">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="p-8 md:p-12 bg-primary text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 font-poppins">Our Vision</h3>
              <EditableText
                contentKey="about_vision"
                fallback="To be the most trusted and preferred interior design and fit-out company in the UAE, known for creating inspiring workspaces that transform businesses."
                value={get("about_vision")}
                as="p"
                className="text-white/90 leading-relaxed text-lg text-justify"
                page="about"
                label="Vision Statement"
                multiline
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }} className="p-8 md:p-12 bg-winteriors-purple-dark text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 font-poppins">Our Mission</h3>
              <EditableText
                contentKey="about_mission"
                fallback="To deliver exceptional interior design and fit-out solutions that exceed client expectations through innovation, quality craftsmanship, and sustainable practices."
                value={get("about_mission")}
                as="p"
                className="text-white/90 leading-relaxed text-lg text-justify"
                page="about"
                label="Mission Statement"
                multiline
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-background">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-12">
            <EditableText contentKey="about_team_heading" fallback="Meet Our Team" value={get("about_team_heading")} as="h2" className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-poppins" page="about" label="Team Heading" />
            <EditableText contentKey="about_team_subtitle" fallback="The passionate professionals behind Winteriors' success" value={get("about_team_subtitle")} as="p" className="text-muted-foreground max-w-xl mx-auto" page="about" label="Team Subtitle" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mb-12 overflow-hidden">
            <img src={groupPicture} alt="Winteriors Decor team group photo" loading="lazy" className="w-full shadow-lg" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-6">
            {teamMembers.slice(0, 2).map((member, index) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} className="group relative bg-secondary overflow-hidden">
                <div className="aspect-[3/4] overflow-hidden">
                  <img src={member.image} alt={member.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ objectPosition: member.objectPosition || 'center 25%', transform: member.scale ? `scale(${member.scale})` : undefined }} />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-foreground text-lg font-poppins">{member.name}</h3>
                  <p className="text-primary">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.slice(2).map((member, index) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} className="group relative bg-secondary overflow-hidden">
                <div className="aspect-[3/4] overflow-hidden">
                  {member.image ? (
                    <img src={member.image} alt={member.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ objectPosition: member.objectPosition || 'center 25%', transform: member.scale ? `scale(${member.scale})` : undefined }} />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center">
                      <div className="w-24 h-24 bg-primary/20 flex items-center justify-center">
                        <span className="text-3xl font-bold text-primary font-poppins">{member.name.charAt(0)}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-foreground text-lg font-poppins">{member.name}</h3>
                  <p className="text-primary">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-secondary">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-10">
            <EditableText contentKey="about_certs_heading" fallback="Our Accreditations" value={get("about_certs_heading")} as="h2" className="text-2xl md:text-3xl font-bold text-foreground mb-4 font-poppins" page="about" label="Certifications Heading" />
            <EditableText contentKey="about_certs_subtitle" fallback="ISO certified for quality, environment, and safety standards" value={get("about_certs_subtitle")} as="p" className="text-muted-foreground" page="about" label="Certifications Subtitle" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {certifications.map((cert, index) => (
              <motion.div key={cert.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.15 }} viewport={{ once: true }} className="flex flex-col items-center">
                <button onClick={() => setLightboxCert(cert)} className="group relative bg-background rounded-lg shadow-lg overflow-hidden cursor-pointer">
                  <img src={cert.image} alt={`${cert.name} Certificate`} className="w-full h-auto object-contain" />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-background opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                  </div>
                </button>
                <div className="mt-4 text-center">
                  <span className="text-sm font-semibold text-foreground block font-poppins">{cert.name}</span>
                  <span className="text-xs text-muted-foreground">{cert.description}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {lightboxCert && (
        <CertificateLightbox certName={lightboxCert.name} onClose={() => setLightboxCert(null)} />
      )}
    </Layout>
  );
};

export default AboutPage;
