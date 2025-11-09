# Usage Guide - Interactive Tutorial Editor

This guide explains how to use the Tiptap-based editor to create interactive tutorials.

## Running the Application

Start the development server:

```bash
npm run dev
```

Open your browser to the URL shown (typically `http://localhost:5173`)

## Interface Overview

The application has a two-column layout:

- **Left Column**: Rich text editor with custom toolbar
- **Right Column**: Live HTML output with copy button

## Creating Interactive Tutorials

### Step 1: Basic Content

1. Type or paste your tutorial content
2. Use the basic formatting tools:
   - **Bold**, *Italic*, `Code`
   - Headings (H1-H4)
   - Bullet lists and numbered lists

### Step 2: Making Elements Interactive

To create an interactive tutorial step:

1. **Create a list item** (bullet or numbered)
2. Place your cursor in the list item
3. Click **"⚡ Interactive"** in the toolbar
   - This adds `class="interactive"` to the list item
   - The item will be highlighted in yellow in the editor

### Step 3: Configure Interactive Attributes

With your cursor in an interactive list item:

1. **Target Action** - Select the action type from the dropdown:
   - `button` - Click a button with specific text
   - `highlight` - Highlight an element
   - `formfill` - Fill a form field
   - `navigate` - Navigate to a page
   - `hover` - Hover over an element
   - `multistep` - Multiple actions in sequence
   - `sequence` - A section containing multiple steps

2. **Ref Target** - Enter the selector or button text:
   - For buttons: enter the button text (e.g., "Save", "Create Dashboard")
   - For DOM elements: enter a CSS selector (e.g., `[data-testid="save-button"]`)

3. **Requirements** - Enter comma-separated requirements:
   - `exists-reftarget` - Wait for the target element to exist
   - `navmenu-open` - Navigation menu is open
   - `on-page:/path` - User is on a specific page
   - `section-completed:id` - Previous section is completed

4. **Show-only** - Check this box to add `data-doit="false"`:
   - Creates a "show-only" step that explains without interaction
   - Useful for educational content

### Step 4: Adding Comments and Spans

**Interactive Comments** (hints and explanations):
1. Select text you want to mark as a hint
2. Click **"💬 Comment"**
3. The text will be wrapped in `<span class="interactive-comment">`

**Interactive Spans** (for inline interactive elements):
1. Select text
2. Click **"🏷️ Span"**
3. The text will be wrapped in `<span class="interactive">`
4. You can then set attributes on the span using the toolbar

### Step 5: Export HTML

1. View the formatted HTML in the right panel
2. Click **"Copy HTML"** to copy it to your clipboard
3. Paste into your tutorial markdown file

## Example Tutorial Structure

```html
<h2>Create a Dashboard</h2>
<ul>
  <li class="interactive" data-targetaction="button" data-reftarget="New Dashboard" data-requirements="exists-reftarget">
    Click the "New Dashboard" button
  </li>
  <li class="interactive" data-targetaction="formfill" data-reftarget='input[name="title"]' data-requirements="exists-reftarget">
    Enter a title for your dashboard
  </li>
  <li class="interactive" data-targetaction="button" data-reftarget="Save" data-requirements="exists-reftarget">
    Click "Save" to create the dashboard
  </li>
</ul>
```

## Tips

- **Visual Feedback**: Interactive list items are highlighted in yellow in the editor
- **Attribute Persistence**: All `data-*` attributes are preserved when copying HTML
- **Undo/Redo**: Use the undo/redo buttons or Ctrl+Z / Ctrl+Shift+Z
- **Multiple Interactive Elements**: You can have multiple interactive items in a list
- **Nested Lists**: Interactive attributes work with nested lists too

## Common Patterns

### Basic Click Action
```html
<li class="interactive" data-targetaction="button" data-reftarget="Save" data-requirements="exists-reftarget">
  Click the Save button
</li>
```

### Form Fill
```html
<li class="interactive" data-targetaction="formfill" data-reftarget='input[name="query"]' data-requirements="exists-reftarget">
  Enter a query in the search box
</li>
```

### Navigation
```html
<li class="interactive" data-targetaction="navigate" data-reftarget="/dashboards" data-requirements="on-page:/dashboards">
  Navigate to the Dashboards page
</li>
```

### Show-Only (Educational)
```html
<li class="interactive" data-targetaction="highlight" data-reftarget=".panel" data-doit="false">
  <span class="interactive-comment">This panel displays your metrics</span>
  Notice the panel on the right
</li>
```

### Section with Multiple Steps
```html
<span id="setup" class="interactive" data-targetaction="sequence" data-reftarget="span#setup">
  <h3>Setup</h3>
  <ul>
    <li class="interactive" data-targetaction="button" data-reftarget="Configure">
      Click Configure
    </li>
    <li class="interactive" data-targetaction="formfill" data-reftarget='input[name="apiKey"]'>
      Enter your API key
    </li>
  </ul>
</span>
```

## Troubleshooting

**List item not getting interactive attributes?**
- Make sure your cursor is inside the list item when clicking toolbar buttons
- The "⚡ Interactive" button only works on list items

**Attributes not appearing in HTML output?**
- Check that you're using the toolbar controls after making an item interactive
- Verify the right panel shows the updated HTML

**Can't select text for comments/spans?**
- Make sure you select the text first, then click the button
- These work on inline text, not on block elements

## Next Steps

Once you're comfortable with the editor:
1. Create tutorial content
2. Copy the HTML output
3. Integrate it into your Grafana interactive tutorials repository
4. Test the interactive functionality in the tutorial viewer

For more information about the interactive tutorial system, see:
https://github.com/grafana/interactive-tutorials

