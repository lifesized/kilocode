import { z } from "zod"

import type { Keys, Equals, AssertEqual } from "./type-fu.js"

/**
 * ExperimentId
 */

const kilocodeExperimentIds = [
	"morphFastApply",
	"inlineAssist",
	"autocomplete",
	"uiImprovements",
	"uiAnimationDots",
	"uiDynamicWords",
	"executionVisibility",
	"minimalTasks",
] as const // kilocode_change
export const experimentIds = ["powerSteering", "multiFileApplyDiff", "preventFocusDisruption"] as const

export const experimentIdsSchema = z.enum([...experimentIds, ...kilocodeExperimentIds])

export type ExperimentId = z.infer<typeof experimentIdsSchema>

/**
 * Experiments
 */

export const experimentsSchema = z.object({
	morphFastApply: z.boolean().optional(), // kilocode_change
	powerSteering: z.boolean().optional(),
	multiFileApplyDiff: z.boolean().optional(),
	inlineAssist: z.boolean().optional(), // kilocode_change
	preventFocusDisruption: z.boolean().optional(),
	autocomplete: z.boolean().optional(), // kilocode_change
	uiImprovements: z.boolean().optional(), // kilocode_change
	uiAnimationDots: z.boolean().optional(), // kilocode_change
	uiDynamicWords: z.boolean().optional(), // kilocode_change
	executionVisibility: z.boolean().optional(), // kilocode_change
	minimalTasks: z.boolean().optional(), // kilocode_change
})

export type Experiments = z.infer<typeof experimentsSchema>

type _AssertExperiments = AssertEqual<Equals<ExperimentId, Keys<Experiments>>>
