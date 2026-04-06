import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Trash2, Copy, Image as ImageIcon, FileText, Film,
  Grid3X3, List, Search, Loader2, X, Download, Check
} from "lucide-react";

interface MediaFile {
  name: string;
  id: string;
  created_at: string;
  metadata: { size?: number; mimetype?: string };
  url: string;
}

const BUCKET = "media";

const MediaLibraryPanel = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => { fetchFiles(); }, []);

  const fetchFiles = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage.from(BUCKET).list("", {
      limit: 200, sortBy: { column: "created_at", order: "desc" },
    });
    if (data) {
      const mapped = data
        .filter(f => f.name !== ".emptyFolderPlaceholder")
        .map(f => ({
          ...f,
          url: supabase.storage.from(BUCKET).getPublicUrl(f.name).data.publicUrl,
        }));
      setFiles(mapped as MediaFile[]);
    }
    if (error) toast({ title: "Error loading files", description: error.message, variant: "destructive" });
    setLoading(false);
  };

  const uploadFiles = useCallback(async (fileList: FileList) => {
    setUploading(true);
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "application/pdf", "video/mp4"];
    const maxSize = 20 * 1024 * 1024;

    for (const file of Array.from(fileList)) {
      if (!allowed.includes(file.type)) {
        toast({ title: `Unsupported: ${file.name}`, variant: "destructive" });
        continue;
      }
      if (file.size > maxSize) {
        toast({ title: `Too large: ${file.name} (max 20MB)`, variant: "destructive" });
        continue;
      }
      const ext = file.name.split(".").pop();
      const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(name, file, {
        contentType: file.type,
      });
      if (error) toast({ title: `Upload failed: ${file.name}`, description: error.message, variant: "destructive" });
    }
    toast({ title: "Upload complete" });
    setUploading(false);
    fetchFiles();
  }, [toast]);

  const deleteFile = async (name: string) => {
    const { error } = await supabase.storage.from(BUCKET).remove([name]);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else {
      toast({ title: "File deleted" });
      if (selectedFile?.name === name) setSelectedFile(null);
      fetchFiles();
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "URL copied!" });
  };

  const isImage = (name: string) => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(name);
  const isVideo = (name: string) => /\.(mp4|webm)$/i.test(name);

  const filtered = files.filter(f => !search || f.name.toLowerCase().includes(search.toLowerCase()));

  const formatSize = (bytes?: number) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Media Library</h2>
          <p className="text-xs text-muted-foreground">{files.length} files</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border/30 overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Upload
          </motion.button>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*,application/pdf,video/mp4"
            className="hidden"
            onChange={e => e.target.files && uploadFiles(e.target.files)}
          />
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search files..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/40 border border-border/30 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
        />
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          dragOver ? "border-primary/60 bg-primary/5" : "border-border/30 hover:border-border/50"
        }`}
      >
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Drag & drop files here</p>
        <p className="text-[10px] text-muted-foreground mt-1">JPG, PNG, WebP, SVG, PDF, MP4 • Max 20MB</p>
      </div>

      {/* File Preview Modal */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-2xl border border-border/30 bg-card/80 backdrop-blur-xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground truncate flex-1">{selectedFile.name}</h3>
              <button onClick={() => setSelectedFile(null)} className="text-muted-foreground hover:text-foreground ml-2">
                <X className="w-4 h-4" />
              </button>
            </div>
            {isImage(selectedFile.name) && (
              <img src={selectedFile.url} alt={selectedFile.name} className="max-h-64 rounded-xl object-contain mx-auto" />
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyUrl(selectedFile.url, selectedFile.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/40 text-xs text-foreground hover:bg-secondary/60 transition-colors"
              >
                {copiedId === selectedFile.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                Copy URL
              </button>
              <a
                href={selectedFile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/40 text-xs text-foreground hover:bg-secondary/60 transition-colors"
              >
                <Download className="w-3 h-3" /> Open
              </a>
              <button
                onClick={() => deleteFile(selectedFile.name)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-destructive hover:bg-destructive/10 transition-colors ml-auto"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Files Grid / List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-muted-foreground text-sm py-16">
          {search ? "No matching files" : "No files yet — upload some!"}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map(file => (
            <motion.div
              key={file.id}
              whileHover={{ y: -3, scale: 1.02 }}
              onClick={() => setSelectedFile(file)}
              className={`group rounded-xl border bg-card/60 backdrop-blur-xl overflow-hidden cursor-pointer transition-all ${
                selectedFile?.id === file.id ? "border-primary/50 ring-1 ring-primary/20" : "border-border/30 hover:border-border/50"
              }`}
            >
              <div className="aspect-square bg-secondary/30 flex items-center justify-center overflow-hidden">
                {isImage(file.name) ? (
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                ) : isVideo(file.name) ? (
                  <Film className="w-8 h-8 text-muted-foreground" />
                ) : (
                  <FileText className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="p-2.5">
                <p className="text-[11px] text-foreground truncate">{file.name}</p>
                <p className="text-[9px] text-muted-foreground">{formatSize(file.metadata?.size)}</p>
              </div>
              {/* Quick actions on hover */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button
                  onClick={e => { e.stopPropagation(); copyUrl(file.url, file.id); }}
                  className="p-1 rounded-md bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary/20"
                >
                  {copiedId === file.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
                <button
                  onClick={e => { e.stopPropagation(); deleteFile(file.name); }}
                  className="p-1 rounded-md bg-background/80 backdrop-blur-sm text-destructive hover:bg-destructive/20"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/30">
              <tr className="text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">File</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Type</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Size</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {filtered.map(file => (
                <tr
                  key={file.id}
                  onClick={() => setSelectedFile(file)}
                  className="hover:bg-primary/5 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary/40 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {isImage(file.name) ? (
                          <img src={file.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <FileText className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <span className="text-foreground text-xs truncate max-w-[200px]">{file.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">
                    {file.metadata?.mimetype || "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">
                    {formatSize(file.metadata?.size)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={e => { e.stopPropagation(); copyUrl(file.url, file.id); }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        {copiedId === file.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); deleteFile(file.name); }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MediaLibraryPanel;
