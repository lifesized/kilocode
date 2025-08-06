# Kilocode UI Architecture Mind Map

## 🎯 Core Structure

```
webview-ui/
├── 🚀 src/
│   ├── 📦 components/           [UI Components]
│   │   ├── 💬 chat/            [Main Chat Interface]
│   │   ├── 📜 history/         [Task History Views]
│   │   ├── ⚙️  settings/        [Settings & Experiments]
│   │   ├── 🧩 common/          [Reusable Components]
│   │   └── 🎨 ui/              [Base UI Components]
│   │
│   ├── 🎣 hooks/               [Custom React Hooks]
│   ├── 🌍 i18n/                [Internationalization]
│   ├── 🔧 lib/                 [Utilities & Helpers]
│   ├── 🏪 store/               [State Management]
│   └── 📡 utils/               [VSCode Communication]
```

## 🔗 Key Relationships

### 1. **Component Dependencies**

```
ChatView (Main Interface)
    ├── uses → ExtensionState (experiments, settings)
    ├── imports → HistoryPreview OR MinimalTasksView
    ├── imports → ExecutionStatusPanel (if experiment enabled)
    └── communicates → vscode.postMessage()

HistoryPreview (Default)
    ├── uses → useTaskSearch hook
    ├── renders → TaskItem components
    └── navigates → HistoryView (full page)

MinimalTasksView (Experimental)
    ├── controlled by → experiments.MINIMAL_TASKS
    ├── alternative to → HistoryPreview
    └── marked as → // kilocode_change
```

### 2. **Experiment Flow**

```
Settings UI
    └── ExperimentalSettings
        └── uiImprovements (parent toggle)
            ├── MINIMAL_TASKS → MinimalTasksView
            ├── EXECUTION_VISIBILITY → ExecutionStatusPanel
            ├── UI_ANIMATION_DOTS → Streaming animations
            └── UI_DYNAMIC_WORDS → Dynamic text effects
```

### 3. **Data Flow**

```
VSCode Extension
    ↓ (messages)
ExtensionStateContext
    ├── provides → experiments state
    ├── provides → settings
    └── provides → task history
         ↓
    Components (consume via hooks)
```

### 4. **File Organization Pattern**

```
Feature Folder/
    ├── Component.tsx        [Main component]
    ├── SubComponent.tsx     [Child components]
    ├── useFeature.ts        [Custom hooks]
    └── __tests__/           [Test files]
        └── Component.spec.tsx
```

## 🏗️ Building New UI Features

### Step-by-Step Process:

```
1. Define Experiment (if needed)
   └── packages/types/src/experiment.ts
       └── Add to kilocodeExperimentIds // kilocode_change

2. Create Component Structure
   └── webview-ui/src/components/[feature]/
       ├── MainComponent.tsx
       ├── Supporting components
       └── __tests__/

3. Wire Up Experiment Check
   └── In component: experiments?.[EXPERIMENT_IDS.YOUR_FEATURE]

4. Add to Parent Component
   └── Import and conditionally render based on experiment

5. Update Settings UI
   └── Add to ExperimentalSettings if user-configurable
```

## 📊 Key Patterns

### Component Communication:

```
User Action → Component → vscode.postMessage() → Extension
                ↑                                      ↓
            ExtensionState ← Message Handler ← Response
```

### Experiment Pattern:

```
if (experiments?.YOUR_EXPERIMENT) {
    return <ExperimentalComponent />
} else {
    return <DefaultComponent />
}
```

### Kilocode Change Marking:

```
// Single line
const feature = true // kilocode_change

// Multi-line
// kilocode_change start
function newFeature() {
    // implementation
}
// kilocode_change end

// New file
// kilocode_change - new file
```

## 🎯 Important Folders for UI Work

- **`/chat`** - Core chat interface and messages
- **`/history`** - Task history and alternative views
- **`/settings`** - Configuration and experiments
- **`/common`** - Shared components (buttons, dialogs)
- **`/ui`** - Base UI primitives (from shadcn/ui)

## 🔍 Finding Things

- **Experiments**: `packages/types/src/experiment.ts`
- **VSCode Communication**: `utils/vscode.ts`
- **State Management**: `context/ExtensionStateContext.tsx`
- **Translations**: `i18n/locales/`
- **Tests**: `__tests__/` folders next to components
