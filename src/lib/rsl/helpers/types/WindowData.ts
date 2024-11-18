import type { Cell } from "./_Cell.js";

export type WindowData = {
	id: string;
	panes: string[];
	topLeft: Point;
	botRight: Point;
	zIndex: number;
	cells?: [Cell, Cell]
};

export type Point = {
	x: number;
	y: number;
};
