<script lang="ts">
	import type { WindowData } from './helpers/WindowDataInterface.js';

	// dummy data
	let window: WindowData = $state({
		id: '1',
		panes: [],
		topLeft: { x: 100, y: 100 },
		botRight: { x: 200, y: 200 }
	});

	let moving = false;
	let resizing = false;

	function onMouseDownHeader() {
		moving = true;
	}

	function onMouseDownResize() {
		resizing = true;
	}

	function onMouseMove(e: MouseEvent) {
		if (moving) {
			window.topLeft.x += e.movementX;
			window.topLeft.y += e.movementY;
		}
    if (resizing) {
      window.botRight.x += e.movementX;
      window.botRight.y += e.movementY;

      if (window.botRight.x < 100) {
        window.botRight.x = 100
      }
      if (window.botRight.y < 100) {
        window.botRight.y = 100
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
	style="left: {window.topLeft.x}px; top: {window.topLeft.y}px; width: {window.topLeft.x +
		(window.botRight.x - window.topLeft.x)}px; height: {window.topLeft.y +
		(window.botRight.y - window.topLeft.y)}px"
>
	<!-- HEADER -->
	<div
		class="window-header"
		onmousedown={onMouseDownHeader}
		aria-label="window header"
		role="toolbar"
		tabindex="-1"
	></div>
	<!-- CONTENT -->
	<div class="content"></div>
	<!-- RESIZE -->
	<div
		class="resize"
		onmousedown={onMouseDownResize}
		aria-label="window resize"
		role="toolbar"
		tabindex="-1"
	></div>
</div>
<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

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

	.resize {
		width: 15px;
		height: 15px;
		background-color: #333;
		position: absolute;
		bottom: 0;
		right: 0;
		cursor: se-resize; /* Shows a diagonal resize cursor */
	}
</style>
