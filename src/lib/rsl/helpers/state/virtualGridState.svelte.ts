import type { Cell } from '../types/Cell.js';
import type { Point } from '../types/WindowData.js';
import { getContext, setContext } from 'svelte';
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

	public getNearestCell(point: Point): Cell | null {
		let closestCell: Cell | null = null;
		let minDistance = Infinity;

		for (const cell of this.cells) {
			const isWithinCell =
				point.x >= cell.topLeft.x &&
				point.x <= cell.botRight.x &&
				point.y >= cell.topLeft.y &&
				point.y <= cell.botRight.y;

			if (isWithinCell) {
				return cell; // Return immediately if the point is within this cell
			}

			// Calculate the distance to the center of the cell
			const cellCenter: Point = {
				x: (cell.topLeft.x + cell.botRight.x) / 2,
				y: (cell.topLeft.y + cell.botRight.y) / 2,
			};
			const distance = Math.sqrt(
				Math.pow(cellCenter.x - point.x, 2) + Math.pow(cellCenter.y - point.y, 2)
			);

			// Update the closest cell if this one is closer
			if (distance < minDistance) {
				minDistance = distance;
				closestCell = cell;
			}
		}

		return closestCell;
	}
}

const VIRTUAL_GRID_KEY = Symbol('virtualGrid');

export function setVirtualGridState(row: number, col: number, gap: number) {
	return setContext(VIRTUAL_GRID_KEY, new VirtualGrid(row, col, gap));
}

export function getVirtualGridState() {
	return getContext<ReturnType<typeof setVirtualGridState>>(VIRTUAL_GRID_KEY);
}
