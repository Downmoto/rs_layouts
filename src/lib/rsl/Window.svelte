<script lang="ts">
	import type { WindowData } from './helpers/types/WindowDataInterface.js';
	import CloseSvg from './helpers/types/svgs/CloseSVG.svelte';
	import ResizeSvg from './helpers/types/svgs/ResizeSVG.svelte';

	// dummy data
	let window: WindowData = $state({
		id: '1',
		panes: [],
		topLeft: { x: 100, y: 100 },
		botRight: { x: 200, y: 200 }
	});

	let moving = false;
	let resizing = false;

	let startX = 0;
	let startY = 0;
	let initialTopLeft = { x: 0, y: 0 };
	let initialBotRight = { x: 0, y: 0 };
	let initialWidth = 0;
	let initialHeight = 0;

	function onMouseDownHeader(e: MouseEvent) {
		moving = true;
		startX = e.clientX;
		startY = e.clientY;
		initialTopLeft = { ...window.topLeft };
		initialWidth = window.botRight.x - window.topLeft.x;
		initialHeight = window.botRight.y - window.topLeft.y;
	}

	function onMouseDownResize(e: MouseEvent) {
		resizing = true;
		startX = e.clientX;
		startY = e.clientY;
		initialBotRight = { ...window.botRight };
	}

	function onMouseMove(e: MouseEvent) {
		if (moving) {
			const deltaX = e.clientX - startX;
			const deltaY = e.clientY - startY;

			// Update both topLeft and botRight to maintain size
			window.topLeft.x = initialTopLeft.x + deltaX;
			window.topLeft.y = initialTopLeft.y + deltaY;
			window.botRight.x = window.topLeft.x + initialWidth;
			window.botRight.y = window.topLeft.y + initialHeight;
		}
		if (resizing) {
			const deltaX = e.clientX - startX;
			const deltaY = e.clientY - startY;

			window.botRight.x = initialBotRight.x + deltaX;
			window.botRight.y = initialBotRight.y + deltaY;

			// Minimum size constraints
			if (window.botRight.x - window.topLeft.x < 100) {
				window.botRight.x = window.topLeft.x + 100;
			}
			if (window.botRight.y - window.topLeft.y < 100) {
				window.botRight.y = window.topLeft.y + 100;
			}
		}
	}

	function onMouseUp() {
		moving = false;
		resizing = false;
	}
</script>

<div
	class="window"
	style="left: {window.topLeft.x}px; top: {window.topLeft.y}px; width: {window.botRight.x -
		window.topLeft.x}px; height: {window.botRight.y - window.topLeft.y}px;"
>
	<!-- HEADER -->
	<div
		class="window-header"
		onmousedown={onMouseDownHeader}
		aria-label="window header"
		role="toolbar"
		tabindex="-1"
	>
		<div class="panes"></div>
		<div class="window-controls">
			<div class="close-btn">
				<CloseSvg />
			</div>
		</div>
	</div>
	<!-- CONTENT -->
	<div class="content"></div>
	<!-- RESIZE -->
	<div
		class="resize"
		onmousedown={onMouseDownResize}
		aria-label="window resize"
		role="toolbar"
		tabindex="-1"
	>
		<ResizeSvg />
	</div>
</div>
<svelte:window onmouseup={onMouseUp} onmousemove={onMouseMove} />

<style>
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

	.resize {
		width: 15px;
		height: 15px;
		padding: 0px 2px 2px 0px;
		position: absolute;
		bottom: 0;
		right: 0;
		cursor: se-resize; /* Shows a diagonal resize cursor */
	}
</style>
