import { VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react"
import { useExtensionState } from "@src/context/ExtensionStateContext"
import { EXPERIMENT_IDS } from "@src/core/config/experiments"
import { AnimatedDots } from "./AnimatedDots"

export const ProgressIndicator = () => {
	const { experiments } = useExtensionState()
	const useAnimatedDots = experiments?.[EXPERIMENT_IDS.UI_ANIMATION_DOTS] ?? false

	if (useAnimatedDots) {
		return (
			<div
				style={{
					width: "16px",
					height: "16px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}>
				<AnimatedDots className="scale-75" />
			</div>
		)
	}

	return (
		<div
			style={{
				width: "16px",
				height: "16px",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}>
			<div style={{ transform: "scale(0.55)", transformOrigin: "center" }}>
				<VSCodeProgressRing />
			</div>
		</div>
	)
}
