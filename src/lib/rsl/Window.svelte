<script lang="ts">
	import type { WindowData } from './helpers/types/WindowData.js';
	import type { WindowOptions } from './helpers/options/windowOptions.js';
	import CloseSvg from './helpers/svgs/CloseSVG.svelte';
	import { showGrid } from './helpers/state/showGrid.svelte.js';

	let {
		win = $bindable(),
		winOptions,
		onRemove,
		onClick
	}: {
		win: WindowData;
		winOptions: WindowOptions;
		onRemove: Function;
		onClick: Function;
	} = $props();

	let moving = $state(false);
	let resizing = $state(false);
	let resizeDirection: string | null = null;

	let startX = 0;
	let startY = 0;
	let initialTopLeft = { x: 0, y: 0 };
	let initialBotRight = { x: 0, y: 0 };
	let initialWidth = 0;
	let initialHeight = 0;

	function handleOnRemove() {
		onRemove(win.id);
	}

	function handleOnClick() {
		onClick(win.id);
	}

	function onMouseDownHeader(e: MouseEvent) {
		onClick(win.id)
		e.stopPropagation();
		moving = true;
		showGrid.show = true;
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
			showGrid.show = true;
			resizeDirection = direction;
			startX = e.clientX;
			startY = e.clientY;
			initialTopLeft = { ...win.topLeft };
			initialBotRight = { ...win.botRight };
		};
	}

	function onMouseMove(e: MouseEvent) {
		if (moving) {
			const deltaX = e.clientX - startX;
			const deltaY = e.clientY - startY;
			// Update both topLeft and botRight to maintain size
			win.topLeft.x = initialTopLeft.x + deltaX;
			win.topLeft.y = initialTopLeft.y + deltaY;
			win.botRight.x = win.topLeft.x + initialWidth;
			win.botRight.y = win.topLeft.y + initialHeight;
		}
		if (resizing) {
			const deltaX = e.clientX - startX;
			const deltaY = e.clientY - startY;

			// Adjust resizing based on direction
			if (
				resizeDirection === 'right' ||
				resizeDirection === 'bottom-right' ||
				resizeDirection === 'top-right'
			) {
				win.botRight.x = initialBotRight.x + deltaX;
			}
			if (
				resizeDirection === 'left' ||
				resizeDirection === 'bottom-left' ||
				resizeDirection === 'top-left'
			) {
				win.topLeft.x = initialTopLeft.x + deltaX;
			}
			if (
				resizeDirection === 'bottom' ||
				resizeDirection === 'bottom-right' ||
				resizeDirection === 'bottom-left'
			) {
				win.botRight.y = initialBotRight.y + deltaY;
			}
			if (
				resizeDirection === 'top' ||
				resizeDirection === 'top-right' ||
				resizeDirection === 'top-left'
			) {
				win.topLeft.y = initialTopLeft.y + deltaY;
			}

			// Minimum size constraints
			if (win.botRight.x - win.topLeft.x < winOptions.minWidth) {
				win.botRight.x = win.topLeft.x + winOptions.minWidth;
			}
			if (win.botRight.y - win.topLeft.y < winOptions.minHeight) {
				win.botRight.y = win.topLeft.y + winOptions.minHeight;
			}
		}
	}

	function onMouseUp() {
		moving = false;
		resizing = false;
		showGrid.show = false;
	}
</script>

<div
	class="window {resizing || moving ? 'no-select' : ''}"
	style="
		left: {win.topLeft.x}px; 
		top: {win.topLeft.y}px; 
		width: {win.botRight.x - win.topLeft.x}px; 
		height: {win.botRight.y - win.topLeft.y}px; 
		z-index: {win.zIndex};
		
		--resizeOverflow: {winOptions.resizingZoneOverflow}px;
		"
	onmousedown={handleOnClick}
	role="none"
	tabindex="-1"
>
	<!-- HEADER -->
	<div class="window-header" onmousedown={onMouseDownHeader} role="none" tabindex="-1">
		<div class="panes"></div>
		<div class="window-controls">
			<button class="close-btn" onclick={handleOnRemove}>
				<CloseSvg />
			</button>
		</div>
	</div>
	<!-- CONTENT -->
	<div class="window-content">
		<h1>hi</h1>
	</div>
	<!-- RESIZE HANDLES -->
	<div
		class="resize-handle right"
		onmousedown={startResize('right')}
		role="button"
		aria-label="Resize right"
		tabindex="0"
	></div>

	<div
		class="resize-handle bottom"
		onmousedown={startResize('bottom')}
		role="button"
		aria-label="Resize bottom"
		tabindex="0"
	></div>

	<div
		class="resize-handle bottom-right"
		onmousedown={startResize('bottom-right')}
		role="button"
		aria-label="Resize bottom right corner"
		tabindex="0"
	></div>

	<div
		class="resize-handle left"
		onmousedown={startResize('left')}
		role="button"
		aria-label="Resize left"
		tabindex="0"
	></div>

	<div
		class="resize-handle top"
		onmousedown={startResize('top')}
		role="button"
		aria-label="Resize top"
		tabindex="0"
	></div>

	<div
		class="resize-handle top-right"
		onmousedown={startResize('top-right')}
		role="button"
		aria-label="Resize top right corner"
		tabindex="0"
	></div>

	<div
		class="resize-handle top-left"
		onmousedown={startResize('top-left')}
		role="button"
		aria-label="Resize top left corner"
		tabindex="0"
	></div>

	<div
		class="resize-handle bottom-left"
		onmousedown={startResize('bottom-left')}
		role="button"
		aria-label="Resize bottom left corner"
		tabindex="0"
	></div>
</div>
<svelte:window onmouseup={onMouseUp} onmousemove={onMouseMove} />

<style>
	.no-select {
		user-select: none;
	}

	.window {
		background-color: lightgrey;
		border: 2px solid #333;
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
