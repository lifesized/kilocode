import type { AssertEqual, Equals, Keys, Values, ExperimentId, Experiments } from "@roo-code/types"

export const EXPERIMENT_IDS = {
	MORPH_FAST_APPLY: "morphFastApply", // kilocode_change
	AUTOCOMPLETE: "autocomplete", // kilocode_change
	UI_IMPROVEMENTS: "uiImprovements", // kilocode_change
	UI_ANIMATION_DOTS: "uiAnimationDots", // kilocode_change
	UI_DYNAMIC_WORDS: "uiDynamicWords", // kilocode_change
	EXECUTION_VISIBILITY: "executionVisibility", // kilocode_change
	MINIMAL_TASKS: "minimalTasks", // kilocode_change
	MULTI_FILE_APPLY_DIFF: "multiFileApplyDiff",
	POWER_STEERING: "powerSteering",
	INLINE_ASSIST: "inlineAssist", // kilocode_change
	PREVENT_FOCUS_DISRUPTION: "preventFocusDisruption",
} as const satisfies Record<string, ExperimentId>

type _AssertExperimentIds = AssertEqual<Equals<ExperimentId, Values<typeof EXPERIMENT_IDS>>>

type ExperimentKey = Keys<typeof EXPERIMENT_IDS>

interface ExperimentConfig {
	enabled: boolean
}

export const experimentConfigsMap: Record<ExperimentKey, ExperimentConfig> = {
	MORPH_FAST_APPLY: { enabled: false }, // kilocode_change
	AUTOCOMPLETE: { enabled: false }, // kilocode_change
	UI_IMPROVEMENTS: { enabled: false }, // kilocode_change
	UI_ANIMATION_DOTS: { enabled: false }, // kilocode_change
	UI_DYNAMIC_WORDS: { enabled: false }, // kilocode_change
	EXECUTION_VISIBILITY: { enabled: false }, // kilocode_change
	MINIMAL_TASKS: { enabled: false }, // kilocode_change
	MULTI_FILE_APPLY_DIFF: { enabled: false },
	POWER_STEERING: { enabled: false },
	INLINE_ASSIST: { enabled: false }, // kilocode_change
	PREVENT_FOCUS_DISRUPTION: { enabled: false },
}

export const experimentDefault = Object.fromEntries(
	Object.entries(experimentConfigsMap).map(([_, config]) => [
		EXPERIMENT_IDS[_ as keyof typeof EXPERIMENT_IDS] as ExperimentId,
		config.enabled,
	]),
) as Record<ExperimentId, boolean>

export const experiments = {
	get: (id: ExperimentKey): ExperimentConfig | undefined => experimentConfigsMap[id],
	isEnabled: (experimentsConfig: Partial<Experiments>, id: ExperimentId) =>
		experimentsConfig[id] ?? experimentDefault[id],
} as const
