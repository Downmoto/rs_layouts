import type { Point } from './WindowData.js';

export type Cell = {
	topLeft: Point;
	botRight: Point;
	width: number;
	height: number;
	row: number;
	col: number;
};
