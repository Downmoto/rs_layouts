<script lang="ts">
	import type { WindowData } from './helpers/types/WindowData.js';
	import CloseSvg from './helpers/svgs/CloseSVG.svelte';
	import ResizeSvg from './helpers/svgs/ResizeSVG.svelte';

	let {
		win = $bindable(),
		onRemove,
		onClick
	}: {
		win: WindowData;
		onRemove: Function;
		onClick: Function;
	} = $props();

	let moving = false;
	let resizing = false;

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
		moving = true;
		startX = e.clientX;
		startY = e.clientY;
		initialTopLeft = { ...win.topLeft };
		initialWidth = win.botRight.x - win.topLeft.x;
		initialHeight = win.botRight.y - win.topLeft.y;
	}

	function onMouseDownResize(e: MouseEvent) {
		resizing = true;
		startX = e.clientX;
		startY = e.clientY;
		initialBotRight = { ...win.botRight };
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

			win.botRight.x = initialBotRight.x + deltaX;
			win.botRight.y = initialBotRight.y + deltaY;

			// Minimum size constraints
			if (win.botRight.x - win.topLeft.x < 100) {
				win.botRight.x = win.topLeft.x + 100;
			}
			if (win.botRight.y - win.topLeft.y < 100) {
				win.botRight.y = win.topLeft.y + 100;
			}
		}
	}

	function onMouseUp() {
		moving = false;
		resizing = false;
	}
</script>

<div
	class="wi"
	style="
		left: {win.topLeft.x}px; 
		top: {win.topLeft.y}px; 
		width: {win.botRight.x - win.topLeft.x}px; 
		height: {win.botRight.y - win.topLeft.y}px; 
		z-index: {win.zIndex};"
	onmousedown={handleOnClick}
	role="none"
	tabindex="-1"
>
	<!-- HEADER -->
	<div class="wi-header" onmousedown={onMouseDownHeader} role="none" tabindex="-1">
		<div class="panes"></div>
		<div class="window-controls">
			<button class="close-btn" onclick={handleOnRemove}>
				<CloseSvg />
			</button>
		</div>
	</div>
	<!-- CONTENT -->
	<div class="content">
		<h1>hi</h1>
	</div>
	<!-- RESIZE -->
	<div class="resize" onmousedown={onMouseDownResize} role="none" tabindex="-1">
		<ResizeSvg />
	</div>
</div>
<svelte:window onmouseup={onMouseUp} onmousemove={onMouseMove} />

<style>
	.wi {
		background-color: lightgrey;
		border: 2px solid #333;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		position: absolute;
		min-height: 100px;
		min-width: 100px;
	}

	.wi-header {
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

	.resize {
		width: 15px;
		height: 15px;
		padding: 0px 2px 2px 0px;
		position: absolute;
		bottom: 0;
		right: 0;
		cursor: se-resize;
	}
</style>
