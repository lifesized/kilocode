import { render } from "@testing-library/react"
import { AnimatedDots } from "../AnimatedDots"

describe("AnimatedDots", () => {
	it("renders three animated dots", () => {
		const { container } = render(<AnimatedDots />)

		// Check that three dots are rendered by looking for spans with specific styling
		const dots = container.querySelectorAll("span span")
		expect(dots).toHaveLength(3)
	})

	it("applies custom className", () => {
		const { container } = render(<AnimatedDots className="custom-class" />)

		const dotsContainer = container.firstChild as HTMLElement
		expect(dotsContainer).toHaveClass("custom-class")
	})

	it("uses custom dot color", () => {
		const customColor = "#ff0000"
		const { container } = render(<AnimatedDots dotColor={customColor} />)

		const dots = container.querySelectorAll("span span")
		dots.forEach((dot) => {
			expect(dot).toHaveStyle({ backgroundColor: customColor })
		})
	})

	it("applies different animation delays to each dot", () => {
		const { container } = render(<AnimatedDots />)

		const dots = container.querySelectorAll("span span")
		expect(dots[0]).toHaveStyle({ animationDelay: "0ms" })
		expect(dots[1]).toHaveStyle({ animationDelay: "200ms" })
		expect(dots[2]).toHaveStyle({ animationDelay: "400ms" })
	})

	it("uses default foreground color when no color is specified", () => {
		const { container } = render(<AnimatedDots />)

		const dots = container.querySelectorAll("span span")
		dots.forEach((dot) => {
			expect(dot).toHaveStyle({ backgroundColor: "var(--vscode-foreground)" })
		})
	})
})
