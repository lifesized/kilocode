// npx vitest run src/shared/__tests__/experiments.spec.ts

import type { ExperimentId } from "@roo-code/types"

import { EXPERIMENT_IDS, experimentConfigsMap, experiments as Experiments } from "../experiments"

describe("experiments", () => {
	describe("POWER_STEERING", () => {
		it("is configured correctly", () => {
			expect(EXPERIMENT_IDS.POWER_STEERING).toBe("powerSteering")
			expect(experimentConfigsMap.POWER_STEERING).toMatchObject({
				enabled: false,
			})
		})
	})

	// kilocode_change start
	describe("AUTOCOMPLETE", () => {
		it("is configured correctly", () => {
			expect(EXPERIMENT_IDS.AUTOCOMPLETE).toBe("autocomplete")
			expect(experimentConfigsMap.AUTOCOMPLETE).toMatchObject({
				enabled: false,
			})
		})
	})

	describe("UI_IMPROVEMENTS", () => {
		it("is configured correctly", () => {
			expect(EXPERIMENT_IDS.UI_IMPROVEMENTS).toBe("uiImprovements")
			expect(experimentConfigsMap.UI_IMPROVEMENTS).toMatchObject({
				enabled: true,
			})
		})
	})

	describe("UI_ANIMATION_DOTS", () => {
		it("is configured correctly", () => {
			expect(EXPERIMENT_IDS.UI_ANIMATION_DOTS).toBe("uiAnimationDots")
			expect(experimentConfigsMap.UI_ANIMATION_DOTS).toMatchObject({
				enabled: false,
			})
		})
	})

	describe("UI_DYNAMIC_WORDS", () => {
		it("is configured correctly", () => {
			expect(EXPERIMENT_IDS.UI_DYNAMIC_WORDS).toBe("uiDynamicWords")
			expect(experimentConfigsMap.UI_DYNAMIC_WORDS).toMatchObject({
				enabled: false,
			})
		})
	})

	describe("MINIMAL_TASKS", () => {
		it("is configured correctly", () => {
			expect(EXPERIMENT_IDS.MINIMAL_TASKS).toBe("minimalTasks")
			expect(experimentConfigsMap.MINIMAL_TASKS).toMatchObject({
				enabled: false,
			})
		})
	})
	// kilocode_change end
	describe("MULTI_FILE_APPLY_DIFF", () => {
		it("is configured correctly", () => {
			expect(EXPERIMENT_IDS.MULTI_FILE_APPLY_DIFF).toBe("multiFileApplyDiff")
			expect(experimentConfigsMap.MULTI_FILE_APPLY_DIFF).toMatchObject({
				enabled: false,
			})
		})
	})

	describe("isEnabled", () => {
		it("returns false when POWER_STEERING experiment is not enabled", () => {
			const experiments: Record<ExperimentId, boolean> = {
				morphFastApply: false, // kilocode_change
				autocomplete: false,
				uiImprovements: false, // kilocode_change
				uiAnimationDots: false, // kilocode_change
				uiDynamicWords: false, // kilocode_change
				executionVisibility: false, // kilocode_change
				minimalTasks: false, // kilocode_change
				powerSteering: false,
				multiFileApplyDiff: false,
				inlineAssist: false, // kilocode_change
				preventFocusDisruption: false,
			}
			expect(Experiments.isEnabled(experiments, EXPERIMENT_IDS.POWER_STEERING)).toBe(false)
		})

		it("returns true when experiment POWER_STEERING is enabled", () => {
			const experiments: Record<ExperimentId, boolean> = {
				morphFastApply: false, // kilocode_change
				autocomplete: true,
				uiImprovements: false, // kilocode_change
				uiAnimationDots: false, // kilocode_change
				uiDynamicWords: false, // kilocode_change
				executionVisibility: false, // kilocode_change
				minimalTasks: false, // kilocode_change
				powerSteering: true,
				multiFileApplyDiff: false,
				inlineAssist: false, // kilocode_change
				preventFocusDisruption: false,
			}
			expect(Experiments.isEnabled(experiments, EXPERIMENT_IDS.POWER_STEERING)).toBe(true)
		})

		it("returns false when experiment is not present", () => {
			const experiments: Record<ExperimentId, boolean> = {
				morphFastApply: false, // kilocode_change
				autocomplete: false,
				uiImprovements: false, // kilocode_change
				uiAnimationDots: false, // kilocode_change
				uiDynamicWords: false, // kilocode_change
				executionVisibility: false, // kilocode_change
				minimalTasks: false, // kilocode_change
				powerSteering: false,
				multiFileApplyDiff: false,
				inlineAssist: false, // kilocode_change
				preventFocusDisruption: false,
			}
			expect(Experiments.isEnabled(experiments, EXPERIMENT_IDS.POWER_STEERING)).toBe(false)
		})
	})
})
