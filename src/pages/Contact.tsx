import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/common/PageHero";
import { EditableText } from "@/components/common/EditableText";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Phone, Mail, MapPin, Clock, Smartphone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { offices } from "@/data/contact";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useToast } from "@/hooks/use-toast";
import { submitFormFn } from "@/lib/email.functions";
import heroContact from "@/assets/hero-contact.jpg";

const ContactPage = () => {
  const { get } = useSiteContent();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const updateField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.message) {
      toast({ title: "Missing fields", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setSubmitting(true);

    try {
      await submitFormFn({
        data: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company || undefined,
          message: form.message,
          type: "Contact",
        }
      });

      toast({ title: "Message sent!", description: "We'll get back to you within one business day." });
      setForm({ name: "", email: "", phone: "", company: "", message: "" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to send message", variant: "destructive" });
    }

    setSubmitting(false);
  };

  return (
    <Layout>
      <Helmet>
        <title>Contact Us | Winteriors Decor LLC - Dubai & Abu Dhabi</title>
        <meta name="description" content="Get in touch with Winteriors Decor LLC. Visit our offices in Dubai Media City and Abu Dhabi." />
      </Helmet>
 
      <PageHero
        title={get("contact_hero_title", "We're Here To Help")}
        subtitle={get("contact_hero_subtitle", "Get in touch with our team to discuss your next project.")}
        backgroundImage={heroContact}
        compact
      />

      <section className="py-12 md:py-16 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative h-[400px] lg:h-auto min-h-[500px]">
              <img src={heroContact} alt="Winteriors office" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <EditableText contentKey="contact_cta_heading" fallback="Let's Create Together" value={get("contact_cta_heading")} as="h3" className="text-2xl md:text-3xl font-bold font-poppins mb-2" page="contact" label="CTA Heading" />
                <EditableText contentKey="contact_cta_subtitle" fallback="Transform your space with award-winning interior design" value={get("contact_cta_subtitle")} as="p" className="text-white/80" page="contact" label="CTA Subtitle" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-secondary p-8 md:p-12 lg:p-16">
              <EditableText contentKey="contact_form_heading" fallback="Send Us a Message" value={get("contact_form_heading")} as="h2" className="text-2xl md:text-3xl font-bold mb-2 font-poppins" page="contact" label="Form Heading" />
              <EditableText contentKey="contact_form_subtitle" fallback="Fill out the form below and we'll get back to you shortly." value={get("contact_form_subtitle")} as="p" className="text-muted-foreground mb-8" page="contact" label="Form Subtitle" />
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Your Name*" className="bg-card border-border" required value={form.name} onChange={(e) => updateField("name", e.target.value)} />
                  <Input type="email" placeholder="Email Address*" className="bg-card border-border" required value={form.email} onChange={(e) => updateField("email", e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input type="tel" placeholder="Phone Number*" className="bg-card border-border" required value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
                  <Input placeholder="Company Name" className="bg-card border-border" value={form.company} onChange={(e) => updateField("company", e.target.value)} />
                </div>
                <Textarea placeholder="Your Message*" rows={5} className="bg-card border-border" required value={form.message} onChange={(e) => updateField("message", e.target.value)} />
                <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={submitting}>
                  {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : "Send Message"}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-secondary">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="inline-block text-primary font-medium mb-4 uppercase tracking-wider text-sm">Our Locations</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground font-poppins">Visit Our Offices</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {offices.map((office, index) => (
              <motion.div key={office.city} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-card border border-border overflow-hidden">
                <div className="h-[250px] w-full">
                  <iframe
                    src={office.city === "Abu Dhabi"
                      ? "https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Ahmed+Abdulla+Alhameli+Bldg,+Salam+Street,+Abu+Dhabi,+UAE&zoom=16"
                      : "https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Concord+Tower,+Dubai+Media+City,+Dubai,+UAE&zoom=16"
                    }
                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`${office.city} Office Location`}
                  />
                </div>
                <div className="p-6 md:p-8">
                  <h3 className="text-xl font-bold text-foreground mb-6 font-poppins">{office.city} Office</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <div className="flex gap-4">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div><p>{office.address}</p><p className="text-sm">{office.poBox}</p></div>
                    </div>
                    <div className="flex gap-4">
                      <Smartphone className="w-5 h-5 text-primary flex-shrink-0" />
                      <a href={`tel:${office.mobile}`} className="hover:text-primary transition-colors">{office.mobile}</a>
                    </div>
                    <div className="flex gap-4">
                      <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                      <a href={`tel:${office.tel}`} className="hover:text-primary transition-colors">{office.tel}</a>
                    </div>
                    <div className="flex gap-4">
                      <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                      <a href={`mailto:${office.email}`} className="hover:text-primary transition-colors">{office.email}</a>
                    </div>
                    <div className="flex gap-4">
                      <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>Mon – Fri: 8:00 AM – 6:00 PM</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
