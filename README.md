# Tiptap Interactive Tutorial Editor

A custom Tiptap-based WYSIWYG editor for creating interactive Grafana tutorials. This prototype demonstrates how to use Tiptap/ProseMirror to author tutorial content with special interactive markup.

## Features

- **Compact Google Docs-Style Toolbar**: Single-row toolbar following familiar design conventions
- **Rich Text Editing**: Full WYSIWYG editor with formatting options (bold, italic, headings, lists, etc.)
- **Interactive Markup**: Specialized forms for each interactive action type:
  - **7 Action Types**: Button, Highlight, Form Fill, Navigate, Hover, Multistep, Sequence
  - **Dedicated Forms**: Each action type has its own configuration component
  - **Popover Interface**: Clean, non-intrusive UI for setting attributes
  - **Interactive Comments & Spans**: Special marks for tutorial hints and inline actions

- **Extensible Architecture**: Easy to add new interactive action types
- **Live HTML Preview**: Split-screen view with formatted HTML output
- **Custom Extensions**: Tiptap extensions that preserve all interactive attributes

For detailed toolbar usage, see [TOOLBAR_GUIDE.md](TOOLBAR_GUIDE.md)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open the URL shown in your terminal (typically `http://localhost:5173`)

## Usage

### Basic Editing

1. Use the **Heading** dropdown to set text style (Normal, H1-H4)
2. Use **Format** dropdown for code, blockquote, or horizontal rules
3. Click **B** (Bold) or **I** (Italic) for text formatting
4. Use the **List** dropdown (•) to create bullet or numbered lists

### Adding Interactive Actions

1. Create or select a list item
2. Click the **⚡ (lightning bolt)** button
3. Choose an action type from the popover:
   - 🔘 **Button** - Click a button
   - ✨ **Highlight** - Highlight an element
   - 📝 **Form Fill** - Fill an input
   - 🧭 **Navigate** - Go to a page
   - 👆 **Hover** - Reveal on hover
   - 📋 **Multistep** - Multiple actions
   - 📑 **Sequence** - Section with steps
4. Fill in the form fields (selector, requirements, etc.)
5. Click **Apply**

### Interactive Comments and Spans

- **💬 Comment**: Select text and click to add hints/explanations
- **🏷️ Span**: Select text and click to create inline interactive elements

### HTML Output

The right panel shows the formatted HTML output with proper indentation. Click "Copy HTML" to copy it to your clipboard for use in tutorial files.

## Project Structure

```
src/
├── components/
│   ├── TiptapEditor.tsx                # Main editor component
│   ├── TiptapEditor.css                # Editor styling
│   ├── Toolbar.tsx                     # Compact Google Docs-style toolbar
│   ├── Toolbar.css                     # Toolbar styling
│   ├── InteractiveSettingsPopover.tsx  # Popover for interactive settings
│   ├── dropdowns/                      # Reusable dropdown components
│   │   ├── DropdownMenu.tsx            # Generic dropdown wrapper
│   │   ├── HeadingDropdown.tsx         # Heading selection
│   │   ├── FormatDropdown.tsx          # Format options
│   │   └── ListDropdown.tsx            # List type selection
│   └── interactive-forms/              # Forms for each action type
│       ├── types.ts                    # Shared TypeScript interfaces
│       ├── ButtonActionForm.tsx        # Button click configuration
│       ├── HighlightActionForm.tsx     # Element highlight configuration
│       ├── FormFillActionForm.tsx      # Form fill configuration
│       ├── NavigateActionForm.tsx      # Navigation configuration
│       ├── HoverActionForm.tsx         # Hover action configuration
│       ├── MultistepActionForm.tsx     # Multistep configuration
│       └── SequenceActionForm.tsx      # Sequence/section configuration
├── extensions/
│   ├── InteractiveListItem.ts          # Custom list item with data-* attributes
│   ├── InteractiveSpan.ts              # Custom span mark for interactive elements
│   └── InteractiveComment.ts           # Custom mark for interactive comments
├── App.tsx                             # Main app with two-column layout
├── App.css                             # App layout styling
└── main.tsx                            # App entry point
```

## Technical Details

### Custom Tiptap Extensions

This project includes three custom Tiptap extensions:

1. **InteractiveListItem**: Extends the default ListItem node to support:
   - `class` attribute (for "interactive" class)
   - `data-targetaction`
   - `data-reftarget`
   - `data-requirements`
   - `data-doit`

2. **InteractiveSpan**: A custom mark that renders as `<span class="interactive">` with support for:
   - `id` attribute
   - `data-targetaction`
   - `data-reftarget`
   - `data-requirements`

3. **InteractiveComment**: A simple mark that renders as `<span class="interactive-comment">`

### Interactive Tutorial Markup

Based on the [Grafana Interactive Tutorials](https://github.com/grafana/interactive-tutorials) system, this editor supports:

- **Action Types**: button, highlight, formfill, navigate, hover, multistep, sequence
- **Requirements**: exists-reftarget, navmenu-open, on-page:path, etc.
- **Show-only Mode**: `data-doit="false"` for educational explanations
- **Interactive Comments**: Hints and explanations within tutorial steps

## Technologies Used

- **React** + **TypeScript**: UI framework
- **Vite**: Build tool and dev server
- **Tiptap**: Rich text editor framework
- **ProseMirror**: Underlying editor engine

## License

MIT
