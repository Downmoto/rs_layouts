import type { Cell } from '../types/Cell.js';
import type { Point } from '../types/WindowData.js';
import { getContext, setContext } from 'svelte';
// TODO: right now it defaults to screen height, make it work if layout is nested
export class VirtualGrid {
	private cells: Cell[] = $state([]);
	private rows!: number;
	private columns!: number;
	private gap!: number;
	private cellWidth!: number;
	private cellHeight!: number;
	
    public show:boolean = $state(true);

	constructor(
		rows: number,
		columns: number,
		gap: number,
		screenWidth?: number,
		screenHeight?: number
	) {
		this.updateGrid(rows, columns, gap, screenWidth, screenHeight);
	}

	private validateDimensions() {
		if (this.cellWidth <= 0 || this.cellHeight <= 0) {
			throw new Error(
				`Invalid cell dimensions: cellWidth = ${this.cellWidth}, cellHeight = ${this.cellHeight}. ` +
					`Check the screen size, grid size, and gaps to ensure positive, non-zero cell dimensions.`
			);
		}
	}

	private initializeGrid() {
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.columns; col++) {
				const topLeft: Point = {
					x: col * (this.cellWidth + this.gap),
					y: row * (this.cellHeight + this.gap)
				};
				const botRight: Point = {
					x: topLeft.x + this.cellWidth,
					y: topLeft.y + this.cellHeight
				};
				this.cells.push({ topLeft, botRight });
			}
		}
	}

	public updateGrid(
		rows: number,
		columns: number,
		gap: number,
		screenWidth?: number,
		screenHeight?: number
	) {
		this.rows = rows;
		this.columns = columns;
		this.gap = gap;

		if (screenHeight !== undefined && screenWidth !== undefined) {
			this.cells = []
			// Calculate cell dimensions based on screen size, gaps, and grid dimensions
			this.cellWidth = (screenWidth - (columns - 1) * gap) / columns;
			this.cellHeight = (screenHeight - (rows - 1) * gap) / rows;

			this.validateDimensions();
			this.initializeGrid();
		}
	}

	public getCells(): Cell[] {
		return this.cells;
	}
}

const VIRTUAL_GRID_KEY = Symbol('virtualGrid');

export function setVirtualGridState(row: number, col: number, gap: number) {
	return setContext(VIRTUAL_GRID_KEY, new VirtualGrid(row, col, gap));
}

export function getVirtualGridState() {
	return getContext<ReturnType<typeof setVirtualGridState>>(VIRTUAL_GRID_KEY);
}
