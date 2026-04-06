
## Phase 1: Premium UI Redesign
- Redesign OwnerSidebar with Shopify/Webflow-inspired sleek navigation (collapsible, icon+label, active states with smooth transitions)
- Add polished dark/light mode toggle with premium color tokens
- Upgrade all dashboard panels with refined card layouts, better typography, and subtle animations
- Add breadcrumb navigation and improved header bar

## Phase 2: Media Library
- Create a `media` storage bucket for uploaded assets
- Build MediaLibrary panel with grid/list view toggle
- Support drag-and-drop file upload with progress indicators
- Image preview, delete, copy URL functionality
- Filter by file type (images, documents, videos)

## Phase 3: Drag-and-Drop Page Builder
- Create a `website_sections` database table to store section order, visibility, and custom content
- Build a visual page builder panel with draggable section cards
- Each section (Hero, About, Services, Portfolio, Packages, Blog, FAQ, Contact, Footer) can be:
  - Reordered via drag-and-drop
  - Toggled visible/hidden
  - Customized (edit text, images, colors per section)
- Use `@dnd-kit` library for smooth drag interactions
- Save layout changes to database in real-time

## Phase 4: Real-Time Content Editing
- Create a `site_content` table for editable text/image content blocks
- Build inline editing UI within the page builder — click a section to edit its content
- Changes save to database and reflect on the public site dynamically
- Support editing: headings, paragraphs, images, button text, links

## Database Changes Required
- `website_sections` table (section_key, display_order, is_visible, custom_config JSONB)
- `site_content` table (section_key, content_key, content_type, value TEXT, metadata JSONB)
- `media` storage bucket with admin-only upload policies

## New Dependencies
- `@dnd-kit/core` + `@dnd-kit/sortable` for drag-and-drop
