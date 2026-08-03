import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/common/PageHero";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, CheckCircle, Loader2 } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import heroEnquiry from "@/assets/hero-enquiry.jpg";

const EnquiryPage = () => {
  const { get } = useSiteContent();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const updateField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const valid = Array.from(files).filter((f) => f.size <= 10 * 1024 * 1024);
    if (valid.length < files.length) {
      toast({ title: "Some files skipped", description: "Max file size is 10MB", variant: "destructive" });
    }
    setAttachments((prev) => [...prev, ...valid]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.message) {
      toast({ title: "Missing fields", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setSubmitting(true);

    try {
      const enquiryId = crypto.randomUUID();
      const submittedAt = new Date().toISOString();

      const { error } = await supabase.from("enquiries").insert({
        id: enquiryId,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        company: form.company.trim() || null,
        message: form.message.trim(),
      } as any);

      if (error) throw error;

      // Fire notification email — non-blocking, never breaks the form
      try {
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "enquiry-notification",
            recipientEmail: "info@winteriorsdecor.com",
            idempotencyKey: `enquiry-notify-${enquiryId}`,
            templateData: {
              name: form.name.trim(),
              email: form.email.trim(),
              phone: form.phone.trim(),
              company: form.company.trim() || undefined,
              message: form.message.trim(),
              submittedAt,
            },
          },
        });
      } catch (emailErr) {
        console.error("Notification email failed (enquiry was saved):", emailErr);
      }

      setSubmitted(true);
      toast({ title: "Enquiry sent!", description: "We'll get back to you within one business day." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to send enquiry", variant: "destructive" });
    }

    setSubmitting(false);
  };

  if (submitted) {
    return (
      <Layout>
        <Helmet>
          <title>Enquiry Sent | Winteriors Decor LLC</title>
        </Helmet>
        <PageHero
          title="Thank You!"
          subtitle="Your enquiry has been received"
          backgroundImage={heroEnquiry}
          compact
        />
        <section className="py-16 md:py-24 bg-background">
          <div className="container-custom max-w-2xl text-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-2xl font-bold font-poppins mb-3">Message Received</h2>
              <p className="text-muted-foreground mb-8">
                Our team will review your enquiry and respond within one business day.
              </p>
              <Button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", company: "", message: "" }); setAttachments([]); }}>
                Send Another Enquiry
              </Button>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Send Enquiry | Winteriors Decor LLC</title>
        <meta name="description" content="Submit your project enquiry to Winteriors Decor LLC. Our team will get back to you within 24 hours." />
      </Helmet>

      <PageHero
        title={get("enquiry_hero_title", "Let's Design Together")}
        subtitle={get("enquiry_hero_subtitle", "Submit your requirements and our experts will respond within one business day")}
        backgroundImage={heroEnquiry}
        compact
      />

      <section className="py-12 md:py-16 bg-background">
        <div className="container-custom max-w-3xl">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 p-10 bg-card rounded-3xl shadow-card border border-border/50"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Your Name *</label>
                <Input placeholder="Enter your name" className="input-focus" required value={form.name} onChange={(e) => updateField("name", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email Address *</label>
                <Input type="email" placeholder="Enter your email address" className="input-focus" required value={form.email} onChange={(e) => updateField("email", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
                <Input type="tel" placeholder="Enter your phone number" className="input-focus" required value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Company Name</label>
                <Input placeholder="Enter your company name" className="input-focus" value={form.company} onChange={(e) => updateField("company", e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Your Message *</label>
              <Textarea placeholder="Tell us about your project requirements, timeline, and any specific needs..." rows={6} className="input-focus" required value={form.message} onChange={(e) => updateField("message", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Attachments</label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer relative">
                <input type="file" multiple accept="image/*,.pdf,.doc,.docx,.dwg" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">+ Add Attachments</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Drawings, photos, floor plans, etc. (max 10MB each)</p>
              </div>
              {attachments.length > 0 && (
                <div className="mt-3 space-y-1">
                  {attachments.map((f, i) => (
                    <div key={i} className="flex items-center justify-between text-sm bg-muted px-3 py-1.5 rounded-md">
                      <span className="truncate">{f.name}</span>
                      <button type="button" onClick={() => setAttachments(prev => prev.filter((_, j) => j !== i))} className="text-destructive text-xs hover:underline ml-2">Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 h-14 text-lg" disabled={submitting}>
              {submitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending...</> : get("enquiry_submit_text", "Send Message")}
            </Button>
          </motion.form>
        </div>
      </section>
    </Layout>
  );
};

export default EnquiryPage;
