import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { invalidateSiteContent } from "@/hooks/useSiteContent";
import { Check, X, Link as LinkIcon, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface EditableLinkProps {
  textKey: string;
  urlKey: string;
  fallbackText: string;
  fallbackUrl: string;
  currentText: string;
  currentUrl: string;
  className?: string;
  children: React.ReactNode;
  page?: string;
  label?: string;
}

/**
 * Wraps a <Link> so that in admin mode, clicking opens an edit popover
 * for the destination URL. Non-admin users see a normal link.
 *
 * Non-tech-friendly features:
 * - Prevents accidental navigation in edit mode
 * - Clear visual indicator (link icon badge)
 * - URL validation with friendly messages
 * - Undo after save (10s window)
 * - Keyboard shortcuts (Enter to save, Esc to cancel)
 */
export function EditableLink({
  textKey,
  urlKey,
  fallbackText,
  fallbackUrl,
  currentText,
  currentUrl,
  className = "",
  children,
  page = "global",
  label,
}: EditableLinkProps) {
  const { isAdmin } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [url, setUrl] = useState(currentUrl || fallbackUrl);
  const [hovered, setHovered] = useState(false);
  const [urlError, setUrlError] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const validateUrl = (val: string): string => {
    if (!val.trim()) return "Please enter a URL";
    // Allow relative URLs starting with / or # and absolute URLs
    if (val.startsWith("/") || val.startsWith("#") || val.startsWith("http://") || val.startsWith("https://")) {
      return "";
    }
    return "URL should start with / (for pages), # (for sections), or https://";
  };

  const startEdit = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUrl(currentUrl || fallbackUrl);
    setUrlError("");
    setEditing(true);
  }, [currentUrl, fallbackUrl]);

  const cancelEdit = useCallback(() => {
    setEditing(false);
    setUrlError("");
  }, []);

  const saveUrl = useCallback(async () => {
    const newUrl = url.trim();
    const error = validateUrl(newUrl);
    if (error) {
      setUrlError(error);
      return;
    }

    if (newUrl === (currentUrl || fallbackUrl)) {
      setEditing(false);
      return;
    }
    
    setSaving(true);
    const prevUrl = currentUrl || fallbackUrl;

    try {
      const { data: existing } = await supabase
        .from("site_content")
        .select("id")
        .eq("key", urlKey)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("site_content")
          .update({ value: newUrl, updated_at: new Date().toISOString() } as any)
          .eq("key", urlKey);
      } else {
        await supabase.from("site_content").insert({
          key: urlKey,
          value: newUrl,
          page,
          label: (label || urlKey) + " URL",
          content_type: "text",
        } as any);
      }

      invalidateSiteContent();
      setSaving(false);
      setEditing(false);

      toast.success("Link updated!", {
        description: `Now points to: ${newUrl}`,
        action: {
          label: "Undo",
          onClick: async () => {
            await supabase
              .from("site_content")
              .update({ value: prevUrl, updated_at: new Date().toISOString() } as any)
              .eq("key", urlKey);
            invalidateSiteContent();
            toast.info("Link change undone.");
          },
        },
        duration: 10000,
      });
    } catch (err) {
      setSaving(false);
      toast.error("Failed to save link", {
        description: "Something went wrong. Please try again.",
      });
    }
  }, [url, urlKey, currentUrl, fallbackUrl, page, label]);

  // Non-admin: render normal Link
  if (!isAdmin) {
    return (
      <Link to={currentUrl || fallbackUrl} className={className}>
        {children}
      </Link>
    );
  }

  // Admin mode
  return (
    <div
      ref={wrapperRef}
      className="relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`${className} cursor-pointer`}
        onClick={startEdit}
      >
        {children}
      </div>

      {/* Link edit indicator */}
      {!editing && hovered && (
        <>
          <button
            onClick={startEdit}
            className="absolute -top-2 -right-2 z-50 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            title="Click to edit where this links to"
          >
            <LinkIcon className="w-3 h-3" />
          </button>
          <span className="absolute -bottom-6 left-0 z-50 text-[10px] bg-foreground text-background px-2 py-0.5 rounded whitespace-nowrap shadow-lg pointer-events-none">
            Click to edit link → {currentUrl || fallbackUrl}
          </span>
        </>
      )}

      {/* URL editor popover */}
      {editing && (
        <>
          {/* Backdrop to catch outside clicks */}
          <div className="fixed inset-0 z-[99]" onClick={cancelEdit} />
          <div className="absolute top-full left-0 z-[100] mt-2 bg-background border border-border rounded-xl shadow-2xl p-4 min-w-[340px] max-w-[400px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <LinkIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">Edit Link Destination</div>
                <div className="text-[10px] text-muted-foreground">Where should this button/link go?</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <input
                type="text"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setUrlError(""); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveUrl();
                  if (e.key === "Escape") cancelEdit();
                }}
                className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 transition-colors ${
                  urlError ? "border-destructive focus:ring-destructive/30" : "border-border focus:ring-primary/50"
                }`}
                placeholder="/about or /services#section-name"
                autoFocus
              />
              {urlError && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  ⚠️ {urlError}
                </p>
              )}
              <div className="text-[10px] text-muted-foreground space-y-0.5">
                <p>💡 <strong>Page link:</strong> /about, /services, /projects</p>
                <p>💡 <strong>Section link:</strong> /services#interior-design</p>
                <p>💡 <strong>External:</strong> https://example.com</p>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={saveUrl}
                disabled={saving}
                className="h-8 px-4 bg-primary text-primary-foreground rounded-lg text-xs flex items-center gap-1.5 shadow hover:bg-primary/90 disabled:opacity-50 font-medium flex-1 justify-center"
              >
                <Check className="w-3 h-3" /> {saving ? "Saving..." : "Save Link"}
              </button>
              <button
                onClick={cancelEdit}
                className="h-8 px-4 bg-muted text-muted-foreground rounded-lg text-xs flex items-center gap-1.5 shadow hover:bg-muted/80"
              >
                <X className="w-3 h-3" /> Cancel
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              Press Enter to save · Esc to cancel
            </p>
          </div>
        </>
      )}
    </div>
  );
}
