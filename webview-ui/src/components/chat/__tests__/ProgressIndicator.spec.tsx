import { render, screen } from "@testing-library/react"
import { vi } from "vitest"
import { ProgressIndicator } from "../ProgressIndicator"
import { useExtensionState } from "@src/context/ExtensionStateContext"
import { EXPERIMENT_IDS } from "@src/core/config/experiments"

// Mock the extension state context
vi.mock("@src/context/ExtensionStateContext")
const mockUseExtensionState = vi.mocked(useExtensionState)

// Mock the VSCodeProgressRing component
vi.mock("@vscode/webview-ui-toolkit/react", () => ({
	VSCodeProgressRing: () => <div data-testid="vscode-progress-ring" />,
}))

// Mock the AnimatedDots component
vi.mock("../AnimatedDots", () => ({
	AnimatedDots: () => <div data-testid="animated-dots" />,
}))

describe("ProgressIndicator", () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it("renders VSCodeProgressRing when UI_ANIMATION_DOTS experiment is disabled", () => {
		mockUseExtensionState.mockReturnValue({
			experiments: {
				[EXPERIMENT_IDS.UI_ANIMATION_DOTS]: false,
			},
		} as any)

		render(<ProgressIndicator />)

		expect(screen.getByTestId("vscode-progress-ring")).toBeInTheDocument()
		expect(screen.queryByTestId("animated-dots")).not.toBeInTheDocument()
	})

	it("renders AnimatedDots when UI_ANIMATION_DOTS experiment is enabled", () => {
		mockUseExtensionState.mockReturnValue({
			experiments: {
				[EXPERIMENT_IDS.UI_ANIMATION_DOTS]: true,
			},
		} as any)

		render(<ProgressIndicator />)

		expect(screen.getByTestId("animated-dots")).toBeInTheDocument()
		expect(screen.queryByTestId("vscode-progress-ring")).not.toBeInTheDocument()
	})

	it("renders VSCodeProgressRing when experiments is undefined", () => {
		mockUseExtensionState.mockReturnValue({
			experiments: undefined,
		} as any)

		render(<ProgressIndicator />)

		expect(screen.getByTestId("vscode-progress-ring")).toBeInTheDocument()
		expect(screen.queryByTestId("animated-dots")).not.toBeInTheDocument()
	})

	it("renders VSCodeProgressRing when UI_ANIMATION_DOTS experiment is not set", () => {
		mockUseExtensionState.mockReturnValue({
			experiments: {},
		} as any)

		render(<ProgressIndicator />)

		expect(screen.getByTestId("vscode-progress-ring")).toBeInTheDocument()
		expect(screen.queryByTestId("animated-dots")).not.toBeInTheDocument()
	})

	it("has correct container styling", () => {
		mockUseExtensionState.mockReturnValue({
			experiments: {
				[EXPERIMENT_IDS.UI_ANIMATION_DOTS]: false,
			},
		} as any)

		const { container } = render(<ProgressIndicator />)
		const progressContainer = container.firstChild as HTMLElement

		expect(progressContainer).toHaveStyle({
			width: "16px",
			height: "16px",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
		})
	})
})
