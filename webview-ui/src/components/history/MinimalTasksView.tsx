// kilocode_change - new file
import React, { useMemo } from "react"
import type { HistoryItem } from "@roo-code/types"
import { formatDistanceToNow } from "date-fns"
import { vscode } from "@/utils/vscode"

interface MinimalTasksViewProps {
	items: HistoryItem[]
	isExpanded?: boolean
	onToggleExpanded?: () => void
}

const getTimeGroup = (timestamp: number): string => {
	const now = Date.now()
	const diff = now - timestamp
	const days = Math.floor(diff / (1000 * 60 * 60 * 24))

	if (days === 0) return "TODAY"
	if (days === 1) return "YESTERDAY"
	if (days <= 7) return "THIS WEEK"
	if (days <= 14) return "LAST WEEK"
	if (days <= 30) return "THIS MONTH"
	if (days <= 60) return "LAST MONTH"
	return formatDistanceToNow(new Date(timestamp), { addSuffix: true }).toUpperCase()
}

const formatTokenUsage = (tokensIn: number, tokensOut: number): string => {
	const totalTokens = tokensIn + tokensOut
	const totalK = Math.round(totalTokens / 1000)
	// Assuming 200k context window as default
	return `${totalK}k/200k`
}

export const MinimalTasksView: React.FC<MinimalTasksViewProps> = ({ items, isExpanded = true, onToggleExpanded }) => {
	const handleTaskClick = (taskId: string) => {
		vscode.postMessage({ type: "showTaskWithId", text: taskId })
	}

	const groupedTasks = useMemo(() => {
		// Sort by newest first and take only the first 5 for better coverage
		const sortedItems = [...items].sort((a, b) => b.ts - a.ts).slice(0, 5)

		// Group tasks by time period
		const groups: Record<string, HistoryItem[]> = {}
		const groupOrder: string[] = []

		sortedItems.forEach((item) => {
			const group = getTimeGroup(item.ts)
			if (!groups[group]) {
				groups[group] = []
				groupOrder.push(group)
			}
			groups[group].push(item)
		})

		return { groups, groupOrder }
	}, [items])

	// No tasks message when no tasks exist
	if (items.length === 0) {
		return (
			<div className="text-center text-vscode-descriptionForeground py-8">
				<p>No task history yet</p>
			</div>
		)
	}

	// When collapsed, show only the eye button without time title
	if (!isExpanded && groupedTasks.groupOrder.length > 0) {
		return (
			<div className="flex items-center justify-end py-2 h-4">
				{onToggleExpanded && (
					<button
						onClick={onToggleExpanded}
						className="flex items-center cursor-pointer hover:text-vscode-foreground transition-colors"
						title="Show tasks">
						<span className="codicon codicon-eye-closed scale-90" />
					</button>
				)}
			</div>
		)
	}

	// When expanded, show all groups with tasks in minimal design
	return (
		<div className="flex flex-col w-full">
			{groupedTasks.groupOrder.map((timeGroup, index) => (
				<div key={timeGroup} className="mb-1">
					<div className="flex items-center justify-between mb-1 h-4">
						<h2 className="text-xs font-medium ml-1 text-vscode-descriptionForeground uppercase tracking-wider">
							{timeGroup}
						</h2>
						{/* Show eye button only on the first group */}
						{index === 0 && onToggleExpanded && (
							<button
								onClick={onToggleExpanded}
								className="flex items-center cursor-pointer  hover:text-vscode-foreground transition-colors"
								title="Hide tasks">
								<span className="codicon codicon-eye scale-90" />
							</button>
						)}
					</div>
					<div className="space-y-0">
						{groupedTasks.groups[timeGroup].map((task) => (
							<div
								key={task.id}
								onClick={() => handleTaskClick(task.id)}
								className="flex items-center justify-between  cursor-pointer hover:bg-vscode-list-hoverBackground rounded-sm transition-all group leading-none h-5">
								<div className="flex-1 min-w-0 mr-4">
									<p className="text-sm text-vscode-foreground truncate group-hover:text-vscode-list-hoverForeground ml-1 mr-3 leading-tight">
										{task.task}
									</p>
								</div>
								<div className="flex-shrink-0">
									<span className="text-xs text-vscode-descriptionForeground font-mono leading-tight">
										{formatTokenUsage(task.tokensIn || 0, task.tokensOut || 0)}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	)
}
