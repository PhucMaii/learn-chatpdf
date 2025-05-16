export const getAICheckColor = (percentage: number) => {
    if (percentage <= 10) return "#22c55e" // green-500
    if (percentage <= 50) return "#eab308" // yellow-500
    return "#ef4444" // red-500
}
