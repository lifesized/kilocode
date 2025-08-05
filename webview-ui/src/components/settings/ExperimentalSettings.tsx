import { HTMLAttributes } from "react"
import { FlaskConical } from "lucide-react"

import type {
	Experiments,
	ProviderSettings, // kilocode_change
} from "@roo-code/types"

import { EXPERIMENT_IDS, experimentConfigsMap } from "@roo/experiments"

import { useAppTranslation } from "@src/i18n/TranslationContext"
import { cn } from "@src/lib/utils"

import { SetExperimentEnabled } from "./types"
import { SectionHeader } from "./SectionHeader"
import { Section } from "./Section"
import { ExperimentalFeature } from "./ExperimentalFeature"
import { MorphSettings } from "./MorphSettings" // kilocode_change

type ExperimentalSettingsProps = HTMLAttributes<HTMLDivElement> & {
	experiments: Experiments
	setExperimentEnabled: SetExperimentEnabled
	apiConfiguration: ProviderSettings // kilocode_change
	setApiConfigurationField: <K extends keyof ProviderSettings>(field: K, value: ProviderSettings[K]) => void // kilocode_change
}

export const ExperimentalSettings = ({
	experiments,
	setExperimentEnabled,
	className,
	apiConfiguration, // kilocode_change
	setApiConfigurationField, // kilocode_change
	...props
}: ExperimentalSettingsProps) => {
	const { t } = useAppTranslation()

	return (
		<div className={cn("flex flex-col gap-2", className)} {...props}>
			<SectionHeader>
				<div className="flex items-center gap-2">
					<FlaskConical className="w-4" />
					<div>{t("settings:sections.experimental")}</div>
				</div>
			</SectionHeader>

			<Section>
				{Object.entries(experimentConfigsMap)
					.filter(([key]) => key in EXPERIMENT_IDS)
					.filter((config) => config[0] !== "MARKETPLACE") // kilocode_change: we have our own market place, filter this out for now
					.filter(
						(config) =>
							![
								"UI_ANIMATION_DOTS",
								"UI_DYNAMIC_WORDS",
								"EXECUTION_VISIBILITY",
								"MINIMAL_TASKS",
							].includes(config[0]),
					) // kilocode_change: These are sub-options under UI_IMPROVEMENTS
					.map((config) => {
						if (config[0] === "MULTI_FILE_APPLY_DIFF") {
							return (
								<ExperimentalFeature
									key={config[0]}
									experimentKey={config[0]}
									enabled={experiments[EXPERIMENT_IDS.MULTI_FILE_APPLY_DIFF] ?? false}
									onChange={(enabled) =>
										setExperimentEnabled(EXPERIMENT_IDS.MULTI_FILE_APPLY_DIFF, enabled)
									}
								/>
							)
						}
						// kilocode_change start
						if (config[0] === "MORPH_FAST_APPLY") {
							const enabled =
								experiments[EXPERIMENT_IDS[config[0] as keyof typeof EXPERIMENT_IDS]] ?? false
							return (
								<>
									<ExperimentalFeature
										key={config[0]}
										experimentKey={config[0]}
										enabled={enabled}
										onChange={(enabled) =>
											setExperimentEnabled(
												EXPERIMENT_IDS[config[0] as keyof typeof EXPERIMENT_IDS],
												enabled,
											)
										}
									/>
									{enabled && (
										<MorphSettings
											apiConfiguration={apiConfiguration}
											setApiConfigurationField={setApiConfigurationField}
										/>
									)}
								</>
							)
						}
						// kilocode_change end
						if (config[0] === "UI_IMPROVEMENTS") {
							const uiImprovementsEnabled = experiments[EXPERIMENT_IDS.UI_IMPROVEMENTS] ?? false
							const uiAnimationDotsEnabled = experiments[EXPERIMENT_IDS.UI_ANIMATION_DOTS] ?? false
							const uiDynamicWordsEnabled = experiments[EXPERIMENT_IDS.UI_DYNAMIC_WORDS] ?? false
							const executionVisibilityEnabled = experiments[EXPERIMENT_IDS.EXECUTION_VISIBILITY] ?? false
							const minimalTasksEnabled = experiments[EXPERIMENT_IDS.MINIMAL_TASKS] ?? false
							return (
								<>
									<ExperimentalFeature
										key={config[0]}
										experimentKey={config[0]}
										enabled={uiImprovementsEnabled}
										onChange={(enabled) => {
											setExperimentEnabled(EXPERIMENT_IDS.UI_IMPROVEMENTS, enabled)
											if (!enabled) {
												setExperimentEnabled(EXPERIMENT_IDS.UI_ANIMATION_DOTS, false)
												setExperimentEnabled(EXPERIMENT_IDS.UI_DYNAMIC_WORDS, false)
												setExperimentEnabled(EXPERIMENT_IDS.EXECUTION_VISIBILITY, false)
												setExperimentEnabled(EXPERIMENT_IDS.MINIMAL_TASKS, false)
											}
										}}
									/>
									{uiImprovementsEnabled && (
										<div className="ml-6 mt-2 space-y-2 border-l-2 border-vscode-sideBar-background pl-4">
											<ExperimentalFeature
												key="UI_ANIMATION_DOTS"
												experimentKey="UI_ANIMATION_DOTS"
												enabled={uiAnimationDotsEnabled}
												onChange={(enabled) =>
													setExperimentEnabled(EXPERIMENT_IDS.UI_ANIMATION_DOTS, enabled)
												}
											/>
											<ExperimentalFeature
												key="UI_DYNAMIC_WORDS"
												experimentKey="UI_DYNAMIC_WORDS"
												enabled={uiDynamicWordsEnabled}
												onChange={(enabled) =>
													setExperimentEnabled(EXPERIMENT_IDS.UI_DYNAMIC_WORDS, enabled)
												}
											/>
											<ExperimentalFeature
												key="EXECUTION_VISIBILITY"
												experimentKey="EXECUTION_VISIBILITY"
												enabled={executionVisibilityEnabled}
												onChange={(enabled) =>
													setExperimentEnabled(EXPERIMENT_IDS.EXECUTION_VISIBILITY, enabled)
												}
											/>
											<ExperimentalFeature
												key="MINIMAL_TASKS"
												experimentKey="MINIMAL_TASKS"
												enabled={minimalTasksEnabled}
												onChange={(enabled) =>
													setExperimentEnabled(EXPERIMENT_IDS.MINIMAL_TASKS, enabled)
												}
											/>
										</div>
									)}
								</>
							)
						}
						return (
							<ExperimentalFeature
								key={config[0]}
								experimentKey={config[0]}
								enabled={experiments[EXPERIMENT_IDS[config[0] as keyof typeof EXPERIMENT_IDS]] ?? false}
								onChange={(enabled) =>
									setExperimentEnabled(
										EXPERIMENT_IDS[config[0] as keyof typeof EXPERIMENT_IDS],
										enabled,
									)
								}
							/>
						)
					})}
			</Section>
		</div>
	)
}
