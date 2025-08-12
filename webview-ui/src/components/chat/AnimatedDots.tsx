import React from "react"

interface AnimatedDotsProps {
	className?: string
	dotColor?: string
}

export const AnimatedDots: React.FC<AnimatedDotsProps> = ({
	className = "",
	dotColor = "var(--vscode-foreground)",
}) => {
	return (
		<span className={`inline-flex items-center gap-0.5 ${className}`}>
			<span
				className="w-0.5 h-0.5 rounded-full animate-pulse"
				style={{
					backgroundColor: dotColor,
					animationDelay: "0ms",
					animationDuration: "1.4s",
				}}
			/>
			<span
				className="w-0.5 h-0.5 rounded-full animate-pulse"
				style={{
					backgroundColor: dotColor,
					animationDelay: "200ms",
					animationDuration: "1.4s",
				}}
			/>
			<span
				className="w-0.5 h-0.5 rounded-full animate-pulse"
				style={{
					backgroundColor: dotColor,
					animationDelay: "400ms",
					animationDuration: "1.4s",
				}}
			/>
		</span>
	)
}
