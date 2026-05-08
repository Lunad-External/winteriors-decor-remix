import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { invalidateSiteContent } from "@/hooks/useSiteContent";
import { Pencil, Check, X, Undo2 } from "lucide-react";
import { toast } from "sonner";

interface EditableTextProps {
  contentKey: string;
  fallback: string;
  value?: string;
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "span" | "div";
  className?: string;
  multiline?: boolean;
  page?: string;
  label?: string;
}

/**
 * Inline-editable text component.
 * When an admin is logged in, hovering shows an edit icon.
 * Clicking enables contentEditable, and saving pushes to site_content.
 * 
 * Non-tech-friendly features:
 * - Toast notifications on save/error
 * - Undo after save (10s window)
 * - Click-to-edit (not just double-click)
 * - Visual "editing" indicator with pulsing border
 * - Auto-save on blur (click away = save)
 * - Empty text protection
 */
export function EditableText({
  contentKey,
  fallback,
  value,
  as: Tag = "span",
  className = "",
  multiline = false,
  page = "global",
  label,
}: EditableTextProps) {
  const { isAdmin } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hovered, setHovered] = useState(false);
  const editRef = useRef<HTMLElement>(null);
  const originalValue = useRef("");
  const blurSaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const displayValue = value || fallback;

  const startEdit = useCallback((e?: React.MouseEvent) => {
    if (!isAdmin) return;
    e?.preventDefault();
    e?.stopPropagation();
    originalValue.current = displayValue;
    setEditing(true);
    setTimeout(() => {
      if (editRef.current) {
        editRef.current.focus();
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(editRef.current);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }, 0);
  }, [isAdmin, displayValue]);

  const cancelEdit = useCallback(() => {
    if (editRef.current) {
      editRef.current.textContent = originalValue.current;
    }
    setEditing(false);
  }, []);

  const saveEdit = useCallback(async (showToast = true) => {
    if (!editRef.current) return;
    let newValue = editRef.current.textContent?.trim() || "";
    
    // Protect against empty text — restore original
    if (!newValue) {
      newValue = originalValue.current;
      editRef.current.textContent = originalValue.current;
      if (showToast) {
        toast.warning("Empty text not allowed — restored previous value.");
      }
      setEditing(false);
      return;
    }

    if (newValue === originalValue.current) {
      setEditing(false);
      return;
    }

    setSaving(true);
    const prevValue = originalValue.current;

    try {
      const { data: existing } = await supabase
        .from("site_content")
        .select("id")
        .eq("key", contentKey)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("site_content")
          .update({ value: newValue, updated_at: new Date().toISOString() } as any)
          .eq("key", contentKey);
      } else {
        await supabase.from("site_content").insert({
          key: contentKey,
          value: newValue,
          page,
          label: label || contentKey,
          content_type: multiline ? "textarea" : "text",
        } as any);
      }

      invalidateSiteContent();
      setSaving(false);
      setEditing(false);

      if (showToast) {
        toast.success("Saved!", {
          description: `"${(label || contentKey)}" updated successfully.`,
          action: {
            label: "Undo",
            onClick: async () => {
              // Undo: restore previous value
              await supabase
                .from("site_content")
                .update({ value: prevValue, updated_at: new Date().toISOString() } as any)
                .eq("key", contentKey);
              invalidateSiteContent();
              if (editRef.current) editRef.current.textContent = prevValue;
              toast.info("Change undone.");
            },
          },
          duration: 10000,
        });
      }
    } catch (err) {
      setSaving(false);
      setEditing(false);
      toast.error("Failed to save", {
        description: "Something went wrong. Please try again.",
      });
    }
  }, [contentKey, page, label, multiline]);

  // Handle keyboard
  useEffect(() => {
    if (!editing) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") cancelEdit();
      if (e.key === "Enter" && !multiline) {
        e.preventDefault();
        saveEdit();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [editing, cancelEdit, saveEdit, multiline]);

  // Auto-save on blur (click away)
  const handleBlur = useCallback(() => {
    if (!editing) return;
    // Small delay to allow save/cancel button clicks to register first
    blurSaveTimeout.current = setTimeout(() => {
      if (editing) saveEdit(true);
    }, 200);
  }, [editing, saveEdit]);

  const handleFocus = useCallback(() => {
    if (blurSaveTimeout.current) {
      clearTimeout(blurSaveTimeout.current);
      blurSaveTimeout.current = null;
    }
  }, []);

  if (!isAdmin) {
    return <Tag className={className}>{displayValue}</Tag>;
  }

  return (
    <span
      className="relative inline-block group/editable"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Tag
        ref={editRef as any}
        className={`${className} ${editing ? "outline outline-2 outline-primary/60 rounded px-1 -mx-1 bg-primary/5 min-w-[40px]" : ""} ${!editing && isAdmin ? "cursor-pointer hover:bg-primary/5 rounded transition-colors duration-200" : ""}`}
        contentEditable={editing}
        suppressContentEditableWarning
        onClick={(e: React.MouseEvent) => {
          if (!editing) startEdit(e);
        }}
        onBlur={handleBlur}
        onFocus={handleFocus}
      >
        {displayValue}
      </Tag>

      {/* Helpful tooltip on hover */}
      {!editing && hovered && (
        <>
          <button
            onClick={startEdit}
            className="absolute -top-2 -right-2 z-50 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            title="Click to edit this text"
          >
            <Pencil className="w-3 h-3" />
          </button>
          <span className="absolute -bottom-6 left-0 z-50 text-[10px] bg-foreground text-background px-2 py-0.5 rounded whitespace-nowrap shadow-lg pointer-events-none">
            Click to edit
          </span>
        </>
      )}

      {/* Save/Cancel controls */}
      {editing && (
        <span className="absolute -bottom-9 left-0 z-50 flex gap-1.5 items-center">
          <button
            onClick={() => { handleFocus(); saveEdit(); }}
            disabled={saving}
            className="h-7 px-3 bg-primary text-primary-foreground rounded-md text-xs flex items-center gap-1.5 shadow-lg hover:bg-primary/90 disabled:opacity-50 font-medium"
          >
            <Check className="w-3 h-3" /> {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => { handleFocus(); cancelEdit(); }}
            className="h-7 px-3 bg-muted text-muted-foreground rounded-md text-xs flex items-center gap-1.5 shadow hover:bg-muted/80"
          >
            <X className="w-3 h-3" /> Cancel
          </button>
          <span className="text-[10px] text-muted-foreground ml-1 hidden sm:inline">
            Enter to save · Esc to cancel
          </span>
        </span>
      )}
    </span>
  );
}
