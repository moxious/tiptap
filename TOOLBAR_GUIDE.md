# Compact Toolbar Guide

## Overview

The toolbar has been redesigned with a Google Docs-style compact single-row layout. This guide explains how to use the new toolbar and how to extend it with additional interactive action types.

## Toolbar Layout

```
┌────────────────────────────────────────────────────────────┐
│ ▼Heading  ▼Format  [B] [I]  • ▼List  │  ⚡ 💬 🏷️  │  ↶ ↷  │
└────────────────────────────────────────────────────────────┘
```

### Button Groups (left to right):

1. **Structure** - Heading and Format dropdowns
2. **Basic Formatting** - Bold, Italic buttons
3. **Lists** - List type dropdown
4. **Interactive Features** - Lightning bolt (interactive actions), Comment, Span
5. **Edit** - Undo, Redo

## Using the Interactive Actions

### Step 1: Create Interactive Element

1. Create a list item or select text
2. Click the **⚡ (lightning bolt)** button
3. A popover will appear with action type options

### Step 2: Choose Action Type

Select from 7 action types:

- **🔘 Button** - Click a button with specific text
- **✨ Highlight** - Highlight a UI element
- **📝 Form Fill** - Fill an input field
- **🧭 Navigate** - Navigate to a page
- **👆 Hover** - Reveal hover-hidden UI
- **📋 Multistep** - Multiple sequential actions
- **📑 Sequence** - Section containing multiple steps

### Step 3: Configure Attributes

Each action type has its own form with relevant fields:
- Target selector or button text
- Requirements (e.g., `exists-reftarget`, `navmenu-open`)
- Additional options (e.g., show-only mode for highlights)

### Step 4: Apply

Click **Apply** to add the interactive attributes to your element.

## Architecture

### Component Structure

```
src/components/
├── Toolbar.tsx                    # Main compact toolbar
├── Toolbar.css                    # Google Docs-style CSS
├── dropdowns/                     # Reusable dropdown menus
│   ├── DropdownMenu.tsx           # Generic dropdown wrapper
│   ├── HeadingDropdown.tsx        # Heading selection
│   ├── FormatDropdown.tsx         # Format options
│   └── ListDropdown.tsx           # List type selection
├── interactive-forms/             # Interactive action forms
│   ├── types.ts                   # Shared TypeScript interfaces
│   ├── ButtonActionForm.tsx       # Button click configuration
│   ├── HighlightActionForm.tsx    # Element highlight configuration
│   ├── FormFillActionForm.tsx     # Form fill configuration
│   ├── NavigateActionForm.tsx     # Navigation configuration
│   ├── HoverActionForm.tsx        # Hover action configuration
│   ├── MultistepActionForm.tsx    # Multistep configuration
│   ├── SequenceActionForm.tsx     # Sequence/section configuration
│   └── InteractiveForm.css        # Shared form styles
└── InteractiveSettingsPopover.tsx # Popover that shows forms
```

### Design Principles

1. **Separation of Concerns** - Each action type has its own component
2. **Extensibility** - Easy to add new action types
3. **Reusability** - Dropdown components can be used elsewhere
4. **Clean Interface** - Each form component has a consistent API

## Adding a New Interactive Action Type

To add a new action type (e.g., "Wait"):

### 1. Create the Form Component

Create `src/components/interactive-forms/WaitActionForm.tsx`:

```typescript
import { useState } from 'react'
import { InteractiveFormProps } from './types'
import './InteractiveForm.css'

const WaitActionForm = ({ editor, onApply, onCancel, initialValues }: InteractiveFormProps) => {
  const [duration, setDuration] = useState('')
  
  const handleApply = () => {
    onApply({
      'data-targetaction': 'wait',
      'data-reftarget': duration,
      'data-requirements': 'exists-reftarget',
      class: 'interactive',
    })
  }

  return (
    <div className="interactive-form">
      <h4>Wait Action</h4>
      <p className="form-description">Wait for a specific duration</p>
      
      <div className="form-field">
        <label htmlFor="duration">Duration (ms):</label>
        <input
          id="duration"
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="e.g., 1000"
          autoFocus
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
        <button type="button" onClick={handleApply} className="btn-apply" disabled={!duration}>
          Apply
        </button>
      </div>
    </div>
  )
}

export default WaitActionForm
```

### 2. Update the Types

Add 'wait' to the ActionType in `types.ts`:

```typescript
export type ActionType = 
  | 'button'
  | 'highlight'
  | 'formfill'
  | 'navigate'
  | 'hover'
  | 'multistep'
  | 'sequence'
  | 'wait'  // Add this
```

### 3. Update the Popover

In `InteractiveSettingsPopover.tsx`:

1. Import your new form:
```typescript
import WaitActionForm from './interactive-forms/WaitActionForm'
```

2. Add it to the switch statement in `renderForm()`:
```typescript
case 'wait':
  return <WaitActionForm {...formProps} />
```

3. Add it to the action selector grid:
```typescript
<button
  className="action-option"
  onClick={() => setSelectedAction('wait')}
>
  <span className="action-icon">⏱️</span>
  <span className="action-name">Wait</span>
  <span className="action-desc">Pause for duration</span>
</button>
```

That's it! Your new action type is now available in the toolbar.

## Styling Guidelines

### Toolbar Buttons

- Height: 32px
- Min-width: 32px
- Border-radius: 4px
- Hover: `#f1f3f4` background
- Active: `#e8f0fe` background with `#1a73e8` color

### Dropdowns

- Match button styling
- Use downward arrow `▼` indicator
- Menu appears with 2px offset below trigger

### Forms

- Padding: 16px
- Max-width: 400px
- Google-style inputs with `#1a73e8` focus color
- Apply button: `#1a73e8` background
- Cancel button: transparent with `#1a73e8` text

## Keyboard Shortcuts

- **Ctrl+B** - Bold
- **Ctrl+I** - Italic
- **Ctrl+Z** - Undo
- **Ctrl+Shift+Z** - Redo
- **Escape** - Close popovers/dropdowns

## Benefits of the New Design

1. **Space Efficient** - Single row saves ~60% vertical space
2. **Familiar** - Google Docs conventions are widely recognized
3. **Scalable** - Easy to add new action types without cluttering UI
4. **Maintainable** - Each component has single responsibility
5. **Accessible** - Keyboard navigation and tooltips throughout
6. **Clean Code** - Separation between UI and business logic

## Examples

### Creating a Button Action

1. Add a list item: "Click the Save button"
2. Click ⚡
3. Select "Button"
4. Enter "Save" in Button Text
5. Keep default requirement "exists-reftarget"
6. Click Apply

Result:
```html
<li class="interactive" data-targetaction="button" data-reftarget="Save" data-requirements="exists-reftarget">
  Click the Save button
</li>
```

### Creating a Form Fill Action

1. Add a list item: "Enter your name"
2. Click ⚡
3. Select "Form Fill"
4. Enter `input[name="username"]` in Input Selector
5. Click Apply

Result:
```html
<li class="interactive" data-targetaction="formfill" data-reftarget='input[name="username"]' data-requirements="exists-reftarget">
  Enter your name
</li>
```

### Creating a Section (Sequence)

1. Add a list item with heading
2. Click ⚡
3. Select "Sequence"
4. Enter "setup" as Section ID
5. Click Apply
6. Add child list items inside

Result:
```html
<li id="setup" class="interactive" data-targetaction="sequence" data-reftarget="span#setup">
  <h3>Setup</h3>
  <ul>
    <li class="interactive" ...>Step 1</li>
    <li class="interactive" ...>Step 2</li>
  </ul>
</li>
```

