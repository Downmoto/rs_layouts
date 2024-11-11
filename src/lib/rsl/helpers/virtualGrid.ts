import type { GridOptions } from './options/girdOptions.js';
import type { Cell } from './types/_Cell.js';
import type { Point } from './types/WindowData.js';

export class virtualGrid {
	private cells: Cell[] = [];
	private rows: number;
	private columns: number;
	private gap: number;
	private cellWidth: number;
	private cellHeight: number;

	constructor(opts: GridOptions) {
		this.rows = opts.rows;
		this.columns = opts.columns;
		this.gap = opts.gap;

		// Calculate cell dimensions based on screen size, gaps, and grid dimensions
		this.cellWidth = (opts.screenWidth - (opts.columns - 1) * this.gap) / opts.columns;
		this.cellHeight = (opts.screenHeight - (opts.rows - 1) * this.gap) / opts.rows;

		this.validateDimensions();
		this.initializeGrid();
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

	public getCells(): Cell[] {
		return this.cells;
	}
}
