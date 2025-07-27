// kilocode_change - new file
import React, { useMemo } from "react"
import type { HistoryItem } from "@roo-code/types"
import { formatDistanceToNow } from "date-fns"
import { vscode } from "@/utils/vscode"

interface MinimalTasksViewProps {
	items: HistoryItem[]
}

interface GroupedTask {
	task: HistoryItem
	timeGroup: string
}

const getTimeGroup = (timestamp: number): string => {
	const now = Date.now()
	const diff = now - timestamp
	const days = Math.floor(diff / (1000 * 60 * 60 * 24))

	if (days === 0) return "Today"
	if (days === 1) return "Yesterday"
	if (days <= 7) return "This week"
	if (days <= 14) return "Last week"
	if (days <= 30) return "This month"
	if (days <= 60) return "Last month"
	return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
}

const formatTokenUsage = (tokensIn: number, tokensOut: number): string => {
	const totalTokens = tokensIn + tokensOut
	const totalK = Math.round(totalTokens / 1000)
	// Assuming 200k context window as default
	return `${totalK}k/200k`
}

export const MinimalTasksView: React.FC<MinimalTasksViewProps> = ({ items }) => {
	const handleTaskClick = (taskId: string) => {
		vscode.postMessage({ type: "showTaskWithId", text: taskId })
	}

	const groupedTasks = useMemo(() => {
		// Sort by newest first and take only the first 5
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

	if (items.length === 0) {
		return (
			<div className="text-center text-vscode-descriptionForeground py-8">
				<p>No task history yet</p>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-4 py-4">
			{groupedTasks.groupOrder.map((timeGroup) => (
				<div key={timeGroup} className="flex flex-col gap-2">
					<h3 className="text-xs font-medium text-vscode-descriptionForeground uppercase tracking-wider">
						{timeGroup}
					</h3>
					<div className="flex flex-col gap-1">
						{groupedTasks.groups[timeGroup].map((task) => (
							<div
								key={task.id}
								onClick={() => handleTaskClick(task.id)}
								className="flex items-center justify-between h-4 px-3 py-2 rounded-sm bg-vscode-sideBar-background hover:bg-vscode-list-hoverBackground active:bg-vscode-list-activeSelectionBackground cursor-pointer transition-all duration-200 border border-transparent hover:border-vscode-focusBorder">
								<div className="flex-1 min-w-0 mr-3">
									<p className="text-sm text-vscode-foreground truncate">{task.task}</p>
								</div>
								<div className="flex-shrink-0">
									<span className="text-xs text-vscode-descriptionForeground font-mono">
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
