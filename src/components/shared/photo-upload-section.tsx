"use client";

import { useState, useRef } from "react";
import { X, GripVertical, Upload, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updateCompanionPhotosAction } from "@/app/actions/companion-profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  companionId: string;
  initialPhotos: string[];
}

export function PhotoUploadSection({ companionId, initialPhotos }: Props) {
  const [photos, setPhotos]     = useState<string[]>(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [saved, setSaved]       = useState(false);
  const fileInputRef            = useRef<HTMLInputElement>(null);

  // ── Drag-to-reorder state ──
  const dragIndex = useRef<number | null>(null);

  function onDragStart(i: number) {
    dragIndex.current = i;
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault(); // allow drop
  }

  function onDrop(e: React.DragEvent, targetIndex: number) {
    e.preventDefault();
    const from = dragIndex.current;
    if (from === null || from === targetIndex) return;
    const next = [...photos];
    const [item] = next.splice(from, 1);
    next.splice(targetIndex, 0, item);
    setPhotos(next);
    dragIndex.current = null;
    setSaved(false);
  }

  // ── Upload ──
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const remaining = 5 - photos.length;
    const toUpload = files.slice(0, remaining);

    setUploading(true);
    setError(null);
    setSaved(false);

    const supabase = createClient();
    const newUrls: string[] = [];

    for (const file of toUpload) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${companionId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("companion-photos")
        .upload(path, file, { upsert: false });

      if (uploadError) {
        setError(`Upload failed: ${uploadError.message}`);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage
        .from("companion-photos")
        .getPublicUrl(path);

      newUrls.push(data.publicUrl);
    }

    setPhotos((prev) => [...prev, ...newUrls]);
    setUploading(false);

    // Reset input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ── Save ──
  async function handleSave() {
    setSaving(true);
    setError(null);
    const result = await updateCompanionPhotosAction(companionId, photos);
    setSaving(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSaved(true);
    }
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setSaved(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Photos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Upload up to 5 photos. The first photo is your cover image. Drag to reorder.
        </p>

        {/* Photo grid */}
        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((url, i) => (
              <div
                key={url}
                draggable
                onDragStart={() => onDragStart(i)}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, i)}
                className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted group cursor-grab active:cursor-grabbing"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />

                {/* Cover label */}
                {i === 0 && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-lg bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white whitespace-nowrap">
                    Cover
                  </span>
                )}

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 h-6 w-6 rounded-lg bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove photo"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                {/* Drag handle hint */}
                <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-60 transition-opacity pointer-events-none">
                  <GripVertical className="h-4 w-4 text-white" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload button */}
        {photos.length < 5 && (
          <label
            className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border",
              "py-8 text-sm text-muted-foreground cursor-pointer transition-colors",
              "hover:border-foreground/30 hover:text-foreground",
              uploading && "pointer-events-none opacity-50"
            )}
          >
            {uploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                {photos.length === 0
                  ? "Add photos (up to 5)"
                  : `Add more (${5 - photos.length} remaining)`}
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        )}

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-md p-3">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3">
          <Button
            onClick={handleSave}
            disabled={saving || uploading}
            className="flex-1"
          >
            {saving ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving…</>
            ) : (
              "Save photos"
            )}
          </Button>
          {saved && (
            <span className="text-sm text-green-600 font-medium">Saved ✓</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
