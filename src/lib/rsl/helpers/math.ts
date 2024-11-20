import type { Cell } from './types/Cell.js';
import type { Point, WindowData } from './types/WindowData.js';

export function calculateCoveragePercentage(rectA: Cell, rectB: WindowData) {
	// Calculate the top-left and bottom-right points of the overlapping area
	const xMax = Math.max(rectA.topLeft.x, rectB.topLeft.x);
	const yMax = Math.max(rectA.topLeft.y, rectB.topLeft.y);
	const xMin = Math.min(rectA.botRight.x, rectB.botRight.x);
	const yMin = Math.min(rectA.botRight.y, rectB.botRight.y);

	// Calculate the width and height of the overlapping area
	const overlapWidth = Math.max(0, xMin - xMax);
	const overlapHeight = Math.max(0, yMin - yMax);

	// Calculate the area of overlap
	const overlapArea = overlapWidth * overlapHeight;

	// Calculate the area of Rectangle A
	const areaA = (rectA.botRight.x - rectA.topLeft.x) * (rectA.botRight.y - rectA.topLeft.y);

	// If areaA is zero, return 0 to avoid division by zero
	if (areaA === 0) {
		return 0;
	}

	// Calculate the percentage of Rectangle A covered by Rectangle B
	const coveragePercentage = (overlapArea / areaA) * 100;

	return coveragePercentage;
}
