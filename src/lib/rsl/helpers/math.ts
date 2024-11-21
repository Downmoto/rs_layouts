import type { Cell } from './types/Cell.js';
import type { Point, WindowData } from './types/WindowData.js';

type Rectangle = {
	topLeft: Point;
	botRight: Point;
};

export type CoverageResult = {
	topLeft: boolean;
	topRight: boolean;
	botLeft: boolean;
	botRight: boolean;
};

export function calculateCoveragePercentage(
	rectA: Cell,
	rectB: WindowData,
	threshold: number
): CoverageResult {
	// Split Rectangle A into 4 sections
	const midX = (rectA.topLeft.x + rectA.botRight.x) / 2;
	const midY = (rectA.topLeft.y + rectA.botRight.y) / 2;

	const sections: Rectangle[] = [
		// Top-left section
		{ topLeft: rectA.topLeft, botRight: { x: midX, y: midY } },
		// Top-right section
		{ topLeft: { x: midX, y: rectA.topLeft.y }, botRight: { x: rectA.botRight.x, y: midY } },
		// Bottom-left section
		{ topLeft: { x: rectA.topLeft.x, y: midY }, botRight: { x: midX, y: rectA.botRight.y } },
		// Bottom-right section
		{ topLeft: { x: midX, y: midY }, botRight: rectA.botRight }
	];

	function calculateOverlapArea(section: Rectangle, rectB: Rectangle): number {
		// Calculate the top-left and bottom-right points of the overlapping area
		const xMax = Math.max(section.topLeft.x, rectB.topLeft.x);
		const yMax = Math.max(section.topLeft.y, rectB.topLeft.y);
		const xMin = Math.min(section.botRight.x, rectB.botRight.x);
		const yMin = Math.min(section.botRight.y, rectB.botRight.y);

		// Calculate the width and height of the overlapping area
		const overlapWidth = Math.max(0, xMin - xMax);
		const overlapHeight = Math.max(0, yMin - yMax);

		// Calculate the area of overlap
		return overlapWidth * overlapHeight;
	}

	function calculateArea(rect: Rectangle): number {
		return (rect.botRight.x - rect.topLeft.x) * (rect.botRight.y - rect.topLeft.y);
	}

	// Calculate the percentage coverage for each section and return boolean based on threshold
	const coverageBooleans: boolean[] = sections.map((section) => {
		const overlapArea = calculateOverlapArea(section, rectB);
		const areaSection = calculateArea(section);
		if (areaSection === 0) {
			return false;
		}
		const coveragePercentage = (overlapArea / areaSection) * 100;
		return coveragePercentage >= threshold;
	});

	// Return the results in an object with named properties for each section
	return {
		topLeft: coverageBooleans[0],
		topRight: coverageBooleans[1],
		botLeft: coverageBooleans[2],
		botRight: coverageBooleans[3]
	};
}
