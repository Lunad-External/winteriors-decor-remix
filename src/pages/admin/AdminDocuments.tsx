import { useEffect, useRef, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Upload, FileText, ExternalLink, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSiteContent, useInvalidateSiteContent } from "@/hooks/useSiteContent";

const KEYS = {
  url: "footer_company_profile_url",
  label: "footer_company_profile_label",
  sublabel: "footer_company_profile_sublabel",
  filename: "footer_company_profile_filename",
};

export default function AdminDocuments() {
  const { get, loading } = useSiteContent();
  const invalidate = useInvalidateSiteContent();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [label, setLabel] = useState("");
  const [sublabel, setSublabel] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading) {
      setLabel(get(KEYS.label, "Download Company Profile"));
      setSublabel(get(KEYS.sublabel, "PDF • 2026 Edition"));
    }
  }, [loading, get]);

  const currentUrl = get(KEYS.url);
  const currentFilename = get(KEYS.filename, "company-profile.pdf");

  const upsert = async (key: string, value: string) => {
    const { error } = await supabase
      .from("site_content")
      .upsert({ key, value, content_type: "text", page: "footer", label: key }, { onConflict: "key" });
    if (error) throw error;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({ title: "Invalid file", description: "Please upload a PDF file.", variant: "destructive" });
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      toast({ title: "File too large", description: "PDF must be 25MB or smaller.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const storagePath = `documents/${Date.now()}-${safeName}`;
      const { error: upErr } = await supabase.storage
        .from("project-images")
        .upload(storagePath, file, { contentType: "application/pdf", upsert: false });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from("project-images").getPublicUrl(storagePath);
      const publicUrl = pub.publicUrl;

      await upsert(KEYS.url, publicUrl);
      await upsert(KEYS.filename, safeName);
      invalidate();

      toast({ title: "PDF uploaded", description: "The company profile has been updated." });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveLabels = async () => {
    setSaving(true);
    try {
      await upsert(KEYS.label, label);
      await upsert(KEYS.sublabel, sublabel);
      invalidate();
      toast({ title: "Saved", description: "Button labels updated." });
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-poppins">Documents</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage the downloadable company profile PDF shown in the website footer.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4" /> Current Company Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentUrl ? (
              <div className="flex items-center justify-between gap-4 p-4 rounded-lg border bg-muted/40">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{currentFilename}</p>
                    <p className="text-xs text-muted-foreground truncate">{currentUrl}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button asChild variant="outline" size="sm">
                    <a href={currentUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> View
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a href={currentUrl} download={currentFilename}>
                      <Download className="w-3.5 h-3.5 mr-1.5" /> Download
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No company profile uploaded yet.</p>
            )}

            <div>
              <Label htmlFor="pdf-upload" className="text-sm">Replace PDF</Label>
              <div className="mt-2 flex gap-2">
                <Input
                  id="pdf-upload"
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                {uploading && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                PDF only, up to 25MB. The footer download link updates immediately after upload.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Footer Button Labels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="label" className="text-sm">Primary label</Label>
              <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="sublabel" className="text-sm">Subtitle</Label>
              <Input id="sublabel" value={sublabel} onChange={(e) => setSublabel(e.target.value)} className="mt-2" />
            </div>
            <Button onClick={handleSaveLabels} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              Save Labels
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
