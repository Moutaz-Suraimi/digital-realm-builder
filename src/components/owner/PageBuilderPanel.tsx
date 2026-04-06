import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  GripVertical, Eye, EyeOff, Pencil, Save, X, ChevronDown, ChevronUp,
  Layout, Type, Image as ImageIcon, Link2, Loader2
} from "lucide-react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  useSortable, verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Section {
  id: string;
  section_key: string;
  display_name: string;
  display_order: number;
  is_visible: boolean;
  custom_config: Record<string, any>;
}

interface ContentBlock {
  id: string;
  section_key: string;
  content_key: string;
  content_type: string;
  value: string;
  metadata: Record<string, any>;
}

const sectionIcons: Record<string, any> = {
  hero: Layout, about: Type, solutions: Layout, services: Layout,
  portfolio: ImageIcon, packages: Layout, testimonials: Type,
  blog: Type, faq: Type, contact: Link2,
};

function SortableSection({
  section, onToggle, onEdit, isExpanded, onExpandToggle
}: {
  section: Section;
  onToggle: () => void;
  onEdit: () => void;
  isExpanded: boolean;
  onExpandToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };
  const Icon = sectionIcons[section.section_key] || Layout;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      className={`rounded-xl border bg-card/70 backdrop-blur-xl overflow-hidden transition-all ${
        isDragging ? "border-primary/50 shadow-lg shadow-primary/10 scale-[1.02]" :
        section.is_visible ? "border-border/30" : "border-border/20 opacity-60"
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-secondary/60 transition-colors"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{section.display_name}</p>
          <p className="text-[10px] text-muted-foreground">{section.section_key}</p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onToggle}
            className={`p-1.5 rounded-lg transition-colors ${
              section.is_visible
                ? "text-emerald-400 hover:bg-emerald-500/10"
                : "text-muted-foreground hover:bg-secondary/60"
            }`}
            title={section.is_visible ? "Hide section" : "Show section"}
          >
            {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            title="Edit content"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onExpandToggle}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 pt-1 border-t border-border/20">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-secondary/30">
                  <p className="text-muted-foreground mb-0.5">Order</p>
                  <p className="text-foreground font-medium">{section.display_order + 1}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-secondary/30">
                  <p className="text-muted-foreground mb-0.5">Status</p>
                  <p className={section.is_visible ? "text-emerald-400 font-medium" : "text-muted-foreground font-medium"}>
                    {section.is_visible ? "Visible" : "Hidden"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const PageBuilderPanel = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const [sectionsRes, contentRes] = await Promise.all([
      supabase.from("website_sections").select("*").order("display_order"),
      supabase.from("site_content").select("*"),
    ]);
    setSections((sectionsRes.data as Section[]) || []);
    setContentBlocks((contentRes.data as ContentBlock[]) || []);
    setLoading(false);
  };

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex(s => s.id === active.id);
    const newIndex = sections.findIndex(s => s.id === over.id);
    const newSections = arrayMove(sections, oldIndex, newIndex).map((s, i) => ({
      ...s, display_order: i
    }));
    setSections(newSections);

    // Save order to DB
    setSaving(true);
    for (const s of newSections) {
      await supabase.from("website_sections").update({ display_order: s.display_order }).eq("id", s.id);
    }
    setSaving(false);
    toast({ title: "Layout saved" });
  }, [sections, toast]);

  const toggleVisibility = async (section: Section) => {
    const newVal = !section.is_visible;
    setSections(prev => prev.map(s => s.id === section.id ? { ...s, is_visible: newVal } : s));
    await supabase.from("website_sections").update({ is_visible: newVal }).eq("id", section.id);
    toast({ title: newVal ? "Section visible" : "Section hidden" });
  };

  const startEditing = (sectionKey: string) => {
    setEditingSection(sectionKey);
    const blocks = contentBlocks.filter(b => b.section_key === sectionKey);
    const vals: Record<string, string> = {};
    blocks.forEach(b => { vals[b.content_key] = b.value; });
    // Add default fields if empty
    if (!vals["heading"]) vals["heading"] = "";
    if (!vals["subheading"]) vals["subheading"] = "";
    if (!vals["description"]) vals["description"] = "";
    setEditValues(vals);
  };

  const saveContent = async () => {
    if (!editingSection) return;
    setSaving(true);
    for (const [key, value] of Object.entries(editValues)) {
      await supabase.from("site_content").upsert({
        section_key: editingSection,
        content_key: key,
        content_type: "text",
        value,
      }, { onConflict: "section_key,content_key" });
    }
    await fetchData();
    setEditingSection(null);
    setSaving(false);
    toast({ title: "Content saved" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Page Builder</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Drag to reorder • Click eye to toggle • Pencil to edit content</p>
        </div>
        {saving && (
          <div className="flex items-center gap-2 text-xs text-primary">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Saving...
          </div>
        )}
      </div>

      {/* Content Editor */}
      <AnimatePresence>
        {editingSection && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-2xl border border-primary/20 bg-card/80 backdrop-blur-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Pencil className="w-4 h-4 text-primary" />
                Editing: {editingSection}
              </h3>
              <button onClick={() => setEditingSection(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {Object.entries(editValues).map(([key, value]) => (
                <div key={key}>
                  <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1 block">{key.replace(/_/g, " ")}</label>
                  {value.length > 100 ? (
                    <textarea
                      value={value}
                      onChange={e => setEditValues(prev => ({ ...prev, [key]: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/30 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={value}
                      onChange={e => setEditValues(prev => ({ ...prev, [key]: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/30 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                    />
                  )}
                </div>
              ))}
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => {
                    const key = prompt("Content key name (e.g. button_text, image_url):");
                    if (key) setEditValues(prev => ({ ...prev, [key.trim()]: "" }));
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  + Add field
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={saveContent}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Content
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sortable Sections */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {sections.map((section) => (
              <SortableSection
                key={section.id}
                section={section}
                onToggle={() => toggleVisibility(section)}
                onEdit={() => startEditing(section.section_key)}
                isExpanded={expandedId === section.id}
                onExpandToggle={() => setExpandedId(expandedId === section.id ? null : section.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default PageBuilderPanel;
