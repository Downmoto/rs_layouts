<script lang="ts">
	import type { WindowData } from './helpers/types/WindowData.js';
	import type { Cell } from './helpers/types/Cell.js';
	import type { WindowConfig } from './helpers/config/windowConfig.js';
	import CloseSvg from './helpers/svgs/CloseSVG.svelte';
	import { getVirtualGridState } from './helpers/state/virtualGridState.svelte.js';

	let {
		win = $bindable(),
		windowConfig,
		onRemove,
		onClick,
		parentWidthConstraint,
		parentHeightConstraint
	}: {
		win: WindowData;
		windowConfig: WindowConfig;
		onRemove: Function;
		onClick: Function;
		parentWidthConstraint: number;
		parentHeightConstraint: number;
	} = $props();

	let snapping = $state(windowConfig.snapOnByDefault);
	let moving = $state(false);
	let resizing = $state(false);
	let grid = getVirtualGridState();
	let cells: Cell[] = $derived(grid.getCells());

	let startX = 0;
	let startY = 0;
	let initialTopLeft = { x: 0, y: 0 };
	let initialBotRight = { x: 0, y: 0 };
	let initialWidth = 0;
	let initialHeight = 0;
	let resizeDirection: string | null = null;
	let positions: string[] = [
		'bottom',
		'bottom-right',
		'bottom-left',
		'left',
		'right',
		'top',
		'top-right',
		'top-left'
	];

	function onMouseDownHeader(e: MouseEvent) {
		onClick(win.id);
		e.stopPropagation();
		moving = true;
		grid.show = true;
		startX = e.clientX;
		startY = e.clientY;
		initialTopLeft = { ...win.topLeft };
		initialWidth = win.botRight.x - win.topLeft.x;
		initialHeight = win.botRight.y - win.topLeft.y;
	}

	function startResize(direction: string) {
		return (e: MouseEvent) => {
			e.stopPropagation();
			resizing = true;
			grid.show = true;
			resizeDirection = direction;
			startX = e.clientX;
			startY = e.clientY;
			initialTopLeft = { ...win.topLeft };
			initialBotRight = { ...win.botRight };
		};
	}

	function onMouseMove(e: MouseEvent) {
		const cellWidth: number = snapping ? cells[0].width + grid.gap : 1;
		const cellHeight: number = snapping ? cells[0].height + grid.gap : 1;
		if (moving) {
			const deltaX = e.clientX - startX;
			const deltaY = e.clientY - startY;
			// Update both topLeft and botRight to maintain size
			win.topLeft.x = initialTopLeft.x + Math.round(deltaX / cellWidth) * cellWidth;
			win.topLeft.y = initialTopLeft.y + Math.round(deltaY / cellHeight) * cellHeight;
			win.botRight.x = win.topLeft.x + initialWidth;
			win.botRight.y = win.topLeft.y + initialHeight;
		}

		if (resizing) {
			const deltaX = e.clientX - startX;
			const deltaY = e.clientY - startY;

			// Get grid cell dimensions for snapping

			// Adjust resizing based on direction
			if (
				resizeDirection === 'right' ||
				resizeDirection === 'bottom-right' ||
				resizeDirection === 'top-right'
			) {
				win.botRight.x = snapping
					? initialBotRight.x + Math.round(deltaX / cellWidth) * cellWidth
					: initialBotRight.x + deltaX;
			}
			if (
				resizeDirection === 'left' ||
				resizeDirection === 'bottom-left' ||
				resizeDirection === 'top-left'
			) {
				const newWidth = snapping
					? Math.round((initialBotRight.x - (initialTopLeft.x + deltaX)) / cellWidth) * cellWidth
					: initialBotRight.x - (initialTopLeft.x + deltaX);

				if (newWidth >= windowConfig.minWidth) {
					win.topLeft.x = snapping ? initialBotRight.x - newWidth : initialTopLeft.x + deltaX;
				} else {
					win.topLeft.x = initialBotRight.x - windowConfig.minWidth;
				}
			}
			if (
				resizeDirection === 'bottom' ||
				resizeDirection === 'bottom-right' ||
				resizeDirection === 'bottom-left'
			) {
				win.botRight.y = snapping
					? initialBotRight.y + Math.round(deltaY / cellHeight) * cellHeight
					: initialBotRight.y + deltaY;
			}
			if (
				resizeDirection === 'top' ||
				resizeDirection === 'top-right' ||
				resizeDirection === 'top-left'
			) {
				const newHeight = snapping
					? Math.round((initialBotRight.y - (initialTopLeft.y + deltaY)) / cellHeight) * cellHeight
					: initialBotRight.y - (initialTopLeft.y + deltaY);

				if (newHeight >= windowConfig.minHeight) {
					win.topLeft.y = snapping ? initialBotRight.y - newHeight : initialTopLeft.y + deltaY;
				} else {
					win.topLeft.y = initialBotRight.y - windowConfig.minHeight;
				}
			}

			// Enforce minimum size constraints
			if (win.botRight.x - win.topLeft.x < windowConfig.minWidth) {
				win.botRight.x = win.topLeft.x + windowConfig.minWidth;
			}
			if (win.botRight.y - win.topLeft.y < windowConfig.minHeight) {
				win.botRight.y = win.topLeft.y + windowConfig.minHeight;
			}
		}
	}

	function onMouseUp(e: MouseEvent) {
		const width = win.botRight.x - win.topLeft.x;
		const height = win.botRight.y - win.topLeft.y;

		// Constrain within parent boundaries
		if (win.topLeft.x < 0) {
			win.topLeft.x = 0;
			win.botRight.x = width; // Maintain width
		} else if (win.botRight.x > parentWidthConstraint) {
			win.botRight.x = parentWidthConstraint;
			win.topLeft.x = parentWidthConstraint - width; // Maintain width
		}

		if (win.topLeft.y < 0) {
			win.topLeft.y = 0;
			win.botRight.y = height; // Maintain height
		} else if (win.botRight.y > parentHeightConstraint) {
			win.botRight.y = parentHeightConstraint;
			win.topLeft.y = parentHeightConstraint - height; // Maintain height
		}

		// TODO:
		// Get the grid cells that the topLeft and botRight points are snapping to
		if (snapping) {
			let nearestTopLeftCell = grid.getNearestCell(win.topLeft);
			if (nearestTopLeftCell) {
				const newTopLeft = nearestTopLeftCell.topLeft;

				win.topLeft.x = newTopLeft.x;
				win.topLeft.y = newTopLeft.y;

				win.botRight.x = win.topLeft.x + width;
				win.botRight.y = win.topLeft.y + height;

				let nearestBotRightCell = grid.getNearestCell(win.botRight);
				if (nearestBotRightCell) {
					win.botRight.x = nearestBotRightCell.botRight.x;
					win.botRight.y = nearestBotRightCell.botRight.y;
				}
			}
		}

		moving = false;
		resizing = false;
		// grid.show = false;
	}
</script>

<svelte:window onmouseup={onMouseUp} onmousemove={onMouseMove} />

<div
	class="window {resizing || moving ? 'no-select' : ''}"
	style="
		left: {win.topLeft.x}px; 
		top: {win.topLeft.y}px; 
		width: {win.botRight.x - win.topLeft.x}px; 
		height: {win.botRight.y - win.topLeft.y}px; 
		z-index: {win.zIndex};
		
		--resizeOverflow: {windowConfig.resizingZoneOverflow}px;
		"
	onmousedown={() => onClick(win.id)}
	role="none"
	tabindex="-1"
>
	<!-- HEADER -->
	<div class="window-header" onmousedown={onMouseDownHeader} role="none" tabindex="-1">
		<div class="panes"></div>
		<div class="window-controls">
			<button class="close-btn" onclick={() => onRemove(win.id)}>
				<CloseSvg />
			</button>
		</div>
	</div>
	<!-- CONTENT -->
	<div class="window-content">
		<h1>hi</h1>
	</div>
	<!-- RESIZE HANDLES -->
	{#each positions as position (position)}
		{@render resizeBar(position)}
	{/each}
</div>

{#snippet resizeBar(position: string)}
	<div
		class="resize-handle {position}"
		onmousedown={startResize(position)}
		role="button"
		aria-label="Resize {position}"
		tabindex="0"
	></div>
{/snippet}

<style>
	.no-select {
		user-select: none;
	}

	.window {
		background-color: lightgrey;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		position: absolute;
		min-height: 100px;
		min-width: 100px;
	}

	.window-header {
		background-color: rgb(250, 0, 42);
		height: 30px;
		user-select: none;
	}

	.window-controls {
		right: 0;
		position: absolute;
		padding-right: 2px;
	}

	.close-btn {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.resize-handle {
		position: absolute;
		background: transparent;
		cursor: pointer;
	}

	/* Side handles */
	.right {
		top: 0;
		right: calc(-1 * var(--resizeOverflow)); /* Overflow by --resizeOverflow */
		width: 10px;
		height: 100%;
		cursor: e-resize;
	}

	.left {
		top: 0;
		left: calc(-1 * var(--resizeOverflow)); /* Overflow by --resizeOverflow */
		width: 10px;
		height: 100%;
		cursor: w-resize;
	}

	.bottom {
		bottom: calc(-1 * var(--resizeOverflow)); /* Overflow by --resizeOverflow */
		left: 0;
		width: 100%;
		height: 10px;
		cursor: s-resize;
	}

	.top {
		top: calc(-1 * var(--resizeOverflow)); /* Overflow by --resizeOverflow */
		left: 0;
		width: 100%;
		height: 10px;
		cursor: n-resize;
	}

	/* Corner handles */
	.bottom-right {
		width: 10px;
		height: 10px;
		bottom: calc(-1 * var(--resizeOverflow)); /* Overflow by --resizeOverflow */
		right: calc(-1 * var(--resizeOverflow)); /* Overflow by --resizeOverflow */
		cursor: se-resize;
	}

	.bottom-left {
		width: 10px;
		height: 10px;
		bottom: calc(-1 * var(--resizeOverflow)); /* Overflow by --resizeOverflow */
		left: calc(-1 * var(--resizeOverflow)); /* Overflow by --resizeOverflow */
		cursor: sw-resize;
	}

	.top-right {
		width: 10px;
		height: 10px;
		top: calc(-1 * var(--resizeOverflow)); /* Overflow by --resizeOverflow */
		right: calc(-1 * var(--resizeOverflow)); /* Overflow by --resizeOverflow */
		cursor: ne-resize;
	}

	.top-left {
		width: 10px;
		height: 10px;
		top: calc(-1 * var(--resizeOverflow)); /* Overflow by --resizeOverflow */
		left: calc(-1 * var(--resizeOverflow)); /* Overflow by --resizeOverflow */
		cursor: nw-resize;
	}
</style>
