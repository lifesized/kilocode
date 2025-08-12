import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { MinimalTasksView } from "../MinimalTasksView"
import type { HistoryItem } from "@roo-code/types"

// Mock vscode
vi.mock("@/utils/vscode", () => ({
	vscode: {
		postMessage: vi.fn(),
	},
}))

// Mock date-fns
vi.mock("date-fns", () => ({
	formatDistanceToNow: vi.fn(() => "2 days ago"),
}))

describe("MinimalTasksView", () => {
	const mockItems: HistoryItem[] = [
		{
			id: "task-1",
			number: 1,
			task: "Create a new feature",
			ts: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
			tokensIn: 1000,
			tokensOut: 500,
			totalCost: 0.05,
		},
		{
			id: "task-2",
			number: 2,
			task: "Fix a bug in the authentication system",
			ts: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
			tokensIn: 800,
			tokensOut: 400,
			totalCost: 0.04,
		},
		{
			id: "task-3",
			number: 3,
			task: "Update documentation",
			ts: Date.now() - 1000 * 60 * 60 * 24 * 7, // 1 week ago
			tokensIn: 600,
			tokensOut: 300,
			totalCost: 0.03,
		},
	]

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it("renders no tasks message when items array is empty", () => {
		render(<MinimalTasksView items={[]} />)
		expect(screen.getByText("No task history yet")).toBeInTheDocument()
	})

	it("renders tasks grouped by time periods", () => {
		render(<MinimalTasksView items={mockItems} />)

		// Should show time group headers
		expect(screen.getByText("TODAY")).toBeInTheDocument()
		expect(screen.getByText("THIS WEEK")).toBeInTheDocument()

		// Should show task titles
		expect(screen.getByText("Create a new feature")).toBeInTheDocument()
		expect(screen.getByText("Fix a bug in the authentication system")).toBeInTheDocument()
		expect(screen.getByText("Update documentation")).toBeInTheDocument()
	})

	it("displays token usage for each task", () => {
		render(<MinimalTasksView items={mockItems} />)

		// Should show formatted token usage
		expect(screen.getByText("2k/200k")).toBeInTheDocument() // 1000 + 500 = 1500 ≈ 2k
		const tokenUsageElements = screen.getAllByText("1k/200k") // 800 + 400 = 1200 ≈ 1k and 600 + 300 = 900 ≈ 1k
		expect(tokenUsageElements).toHaveLength(2)
	})

	it("handles task click and sends message to vscode", async () => {
		render(<MinimalTasksView items={mockItems} />)

		const taskElement = screen.getByText("Create a new feature")
		fireEvent.click(taskElement)

		const { vscode } = await import("@/utils/vscode")
		expect(vscode.postMessage).toHaveBeenCalledWith({
			type: "showTaskWithId",
			text: "task-1",
		})
	})

	it("shows collapsed view when isExpanded is false", () => {
		const mockToggle = vi.fn()
		render(<MinimalTasksView items={mockItems} isExpanded={false} onToggleExpanded={mockToggle} />)

		// Should NOT show the time group header when collapsed
		expect(screen.queryByText("TODAY")).not.toBeInTheDocument()

		// Should show eye-closed icon
		expect(screen.getByTitle("Show tasks")).toBeInTheDocument()

		// Should not show task details
		expect(screen.queryByText("Create a new feature")).not.toBeInTheDocument()
	})

	it("shows expanded view when isExpanded is true", () => {
		const mockToggle = vi.fn()
		render(<MinimalTasksView items={mockItems} isExpanded={true} onToggleExpanded={mockToggle} />)

		// Should show eye icon for hiding
		expect(screen.getByTitle("Hide tasks")).toBeInTheDocument()

		// Should show all task details
		expect(screen.getByText("Create a new feature")).toBeInTheDocument()
		expect(screen.getByText("Fix a bug in the authentication system")).toBeInTheDocument()
		expect(screen.getByText("Update documentation")).toBeInTheDocument()
	})

	it("calls onToggleExpanded when eye button is clicked", () => {
		const mockToggle = vi.fn()
		render(<MinimalTasksView items={mockItems} isExpanded={true} onToggleExpanded={mockToggle} />)

		const eyeButton = screen.getByTitle("Hide tasks")
		fireEvent.click(eyeButton)

		expect(mockToggle).toHaveBeenCalledTimes(1)
	})

	it("limits tasks to 5 items and sorts by newest first", () => {
		// Create 10 mock items
		const manyItems: HistoryItem[] = Array.from({ length: 10 }, (_, i) => ({
			id: `task-${i}`,
			number: i + 1,
			task: `Task ${i}`,
			ts: Date.now() - i * 1000 * 60 * 60, // Each task 1 hour older
			tokensIn: 100,
			tokensOut: 50,
			totalCost: 0.01,
		}))

		render(<MinimalTasksView items={manyItems} />)

		// Should show newest tasks (0-4)
		expect(screen.getByText("Task 0")).toBeInTheDocument()
		expect(screen.getByText("Task 4")).toBeInTheDocument()

		// Should not show older tasks (5+)
		expect(screen.queryByText("Task 5")).not.toBeInTheDocument()
		expect(screen.queryByText("Task 9")).not.toBeInTheDocument()
	})

	it("groups tasks correctly by time periods", () => {
		const now = Date.now()
		const testItems: HistoryItem[] = [
			{
				id: "today-task",
				number: 1,
				task: "Today's task",
				ts: now - 1000 * 60 * 60, // 1 hour ago
				tokensIn: 100,
				tokensOut: 50,
				totalCost: 0.01,
			},
			{
				id: "yesterday-task",
				number: 2,
				task: "Yesterday's task",
				ts: now - 1000 * 60 * 60 * 25, // 25 hours ago
				tokensIn: 100,
				tokensOut: 50,
				totalCost: 0.01,
			},
			{
				id: "week-task",
				number: 3,
				task: "This week's task",
				ts: now - 1000 * 60 * 60 * 24 * 3, // 3 days ago
				tokensIn: 100,
				tokensOut: 50,
				totalCost: 0.01,
			},
		]

		render(<MinimalTasksView items={testItems} />)

		// Should show appropriate time group headers
		expect(screen.getByText("TODAY")).toBeInTheDocument()
		expect(screen.getByText("THIS WEEK")).toBeInTheDocument()
	})
})
