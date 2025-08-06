import type { ExperimentId } from "@roo-code/types"

// Map experiment IDs to their string keys
export const EXPERIMENT_IDS: Record<string, ExperimentId> = {
	MORPH_FAST_APPLY: "morphFastApply",
	POWER_STEERING: "powerSteering",
	MULTI_FILE_APPLY_DIFF: "multiFileApplyDiff",
	INLINE_ASSIST: "inlineAssist",
	PREVENT_FOCUS_DISRUPTION: "preventFocusDisruption",
	AUTOCOMPLETE: "autocomplete",
	UI_IMPROVEMENTS: "uiImprovements",
	UI_ANIMATION_DOTS: "uiAnimationDots",
	UI_DYNAMIC_WORDS: "uiDynamicWords",
	EXECUTION_VISIBILITY: "executionVisibility",
	MINIMAL_TASKS: "minimalTasks",
} as const

// Configuration map for experiments
export const experimentConfigsMap: Record<string, { name: string; description: string }> = {
	MORPH_FAST_APPLY: {
		name: "Morph Fast Apply",
		description: "Enable fast apply for morph operations",
	},
	POWER_STEERING: {
		name: "Power Steering",
		description: "Enhanced navigation and control features",
	},
	MULTI_FILE_APPLY_DIFF: {
		name: "Multi-file Apply Diff",
		description: "Apply diffs across multiple files simultaneously",
	},
	INLINE_ASSIST: {
		name: "Inline Assist",
		description: "Inline code assistance and suggestions",
	},
	PREVENT_FOCUS_DISRUPTION: {
		name: "Prevent Focus Disruption",
		description: "Prevent focus changes during operations",
	},
	AUTOCOMPLETE: {
		name: "Autocomplete",
		description: "Enhanced autocomplete functionality",
	},
	UI_IMPROVEMENTS: {
		name: "UI Improvements",
		description: "Enhanced user interface with animations and visual improvements",
	},
	UI_ANIMATION_DOTS: {
		name: "Animation Dots",
		description: "Animated loading dots and indicators",
	},
	UI_DYNAMIC_WORDS: {
		name: "Dynamic Words",
		description: "Dynamic word animations and effects",
	},
	EXECUTION_VISIBILITY: {
		name: "Execution Visibility",
		description: "Enhanced visibility of execution progress",
	},
	MINIMAL_TASKS: {
		name: "Minimal Tasks",
		description: "Simplified task view interface",
	},
	MARKETPLACE: {
		name: "Marketplace",
		description: "Access to the extension marketplace",
	},
}
