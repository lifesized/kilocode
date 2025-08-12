// kilocode_change - new file
import React, { useState, useEffect } from "react"
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import { useTranslation } from "react-i18next"
import type { ClineMessage } from "@roo-code/types"
import { StandardTooltip } from "../ui"
import { useExtensionState } from "@src/context/ExtensionStateContext"
import { EXPERIMENT_IDS } from "@src/core/config/experiments"
import { AnimatedDots } from "./AnimatedDots"

interface ExecutionStatusPanelProps {
	isStreaming: boolean
	isPaused?: boolean
	currentTool?: string
	messages: ClineMessage[]
	onToggle?: () => void
	hasTask?: boolean // Whether we have a loaded task that can be resumed
}

export const ExecutionStatusPanel: React.FC<ExecutionStatusPanelProps> = ({
	isStreaming,
	isPaused = false,
	currentTool,
	messages,
	onToggle,
	hasTask = false,
}) => {
	const { t } = useTranslation()
	const { experiments } = useExtensionState()
	const [currentAction, setCurrentAction] = useState<string>("")
	const useAnimatedDots = experiments?.[EXPERIMENT_IDS.UI_ANIMATION_DOTS] ?? false

	// Determine the current action based on messages
	useEffect(() => {
		if (!isStreaming) {
			setCurrentAction("")
			return
		}

		// Find the latest tool or action message
		const lastToolMessage = messages.findLast(
			(msg) =>
				msg.ask === "tool" ||
				msg.say === "command_output" ||
				msg.say === "browser_action" ||
				msg.say === "mcp_server_request_started",
		)

		if (lastToolMessage) {
			if (lastToolMessage.ask === "tool") {
				if (lastToolMessage.text) {
					try {
						const toolData = JSON.parse(lastToolMessage.text)
						setCurrentAction(toolData.tool || "Working")
					} catch {
						setCurrentAction("Working")
					}
				}
			} else {
				switch (lastToolMessage.say) {
					case "command_output":
						setCurrentAction("Executing command")
						break
					case "browser_action":
						setCurrentAction("Browser action")
						break
					case "mcp_server_request_started":
						setCurrentAction("MCP server request")
						break
					default:
						setCurrentAction("Processing")
				}
			}
		} else {
			// Default to generating if no specific tool found
			setCurrentAction(t("chat:apiRequest.streaming"))
		}
	}, [messages, isStreaming, t])

	// Show panel when streaming OR when paused OR when we have a resumable task
	if (!isStreaming && !isPaused && !hasTask) {
		return null
	}

	return (
		<div className="flex items-center justify-between px-4 py-2 bg-vscode-editor-background border-b border-vscode-panel-border">
			<div className="flex items-center gap-3">
				{/* Status text with dots directly after */}
				<div className="flex items-center gap-1">
					{isPaused ? (
						<span className="text-vscode-foreground font-medium">{t("chat:paused", "Paused")}</span>
					) : isStreaming ? (
						<span className="text-vscode-foreground font-medium inline-flex items-center gap-1">
							{currentAction || t("chat:apiRequest.streaming")}
							{useAnimatedDots && <AnimatedDots />}
						</span>
					) : (
						<span className="text-vscode-foreground font-medium">{t("chat:ready", "Ready to resume")}</span>
					)}
				</div>

				{/* Current tool indicator */}
				{currentTool && <span className="text-vscode-descriptionForeground text-sm">{currentTool}</span>}
			</div>

			{/* Control button */}
			<div className="flex items-center">
				{onToggle && (
					<StandardTooltip
						content={isPaused ? t("chat:resume.tooltip") + " (Esc)" : t("chat:pause.tooltip") + " (Esc)"}>
						<VSCodeButton
							appearance="icon"
							onClick={onToggle}
							className="hover:bg-vscode-button-hoverBackground rounded">
							<span className={`codicon ${isPaused ? "codicon-play" : "codicon-debug-stop"}`}></span>
						</VSCodeButton>
					</StandardTooltip>
				)}
			</div>
		</div>
	)
}
