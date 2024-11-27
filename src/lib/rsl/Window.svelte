<script lang="ts">
	import type { WindowData } from './types/WindowData.js';
	import type { WindowConfig } from './configs/windowConfig.js';
	import type { Snippet } from 'svelte';
	import CloseSvg from './svgs/CloseSVG.svelte';

	let {
		win = $bindable(),
		windowConfig,
		onRemove,
		onClick,
		parentWidthConstraint,
		parentHeightConstraint,
		emptyWindowContent
	}: {
		win: WindowData;
		windowConfig: WindowConfig;
		onRemove: Function;
		onClick: Function;
		parentWidthConstraint: number;
		parentHeightConstraint: number;
		emptyWindowContent?: Snippet;
	} = $props();

	let moving = $state(false);
	let resizing = $state(false);

	let contentRef: HTMLDivElement;

	let startX = 0;
	let startY = 0;
	let initialTopLeft = { x: 0, y: 0 };
	let initialBotRight = { x: 0, y: 0 };
	let initialWidth = 0;
	let initialHeight = 0;
	let resizeDirection: string | null = null;
	let positions: string[] = [
		'bottom',
		'left',
		'right',
		'top',
		'top-right',
		'top-left',
		'bottom-right',
		'bottom-left'
	];

	function onMouseDownHeader(e: MouseEvent) {
		onClick(win.id);
		e.stopPropagation();
		moving = true;
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
			const contentWidth = contentRef ? contentRef.offsetWidth : 0;
			const contentHeight = contentRef ? contentRef.offsetHeight : 0;

			const deltaX = e.clientX - startX;
			const deltaY = e.clientY - startY;

			// Adjust resizing based on direction
			if (
				resizeDirection === 'right' ||
				resizeDirection === 'bottom-right' ||
				resizeDirection === 'top-right'
			) {
				win.botRight.x = Math.max(
					initialBotRight.x + deltaX,
					win.topLeft.x + Math.max(windowConfig.minWidth, contentWidth)
				);
			}
			if (
				resizeDirection === 'left' ||
				resizeDirection === 'bottom-left' ||
				resizeDirection === 'top-left'
			) {
				const newWidth = initialBotRight.x - (initialTopLeft.x + deltaX);
				if (newWidth >= Math.max(windowConfig.minWidth, contentWidth)) {
					win.topLeft.x = initialTopLeft.x + deltaX;
				} else {
					// Ensure `botRight.x` remains consistent
					win.topLeft.x = win.botRight.x - Math.max(windowConfig.minWidth, contentWidth);
				}
			}

			if (
				resizeDirection === 'bottom' ||
				resizeDirection === 'bottom-right' ||
				resizeDirection === 'bottom-left'
			) {
				win.botRight.y = Math.max(
					initialBotRight.y + deltaY,
					win.topLeft.y + Math.max(windowConfig.minHeight, contentHeight)
				);
			}
			if (
				resizeDirection === 'top' ||
				resizeDirection === 'top-right' ||
				resizeDirection === 'top-left'
			) {
				const newHeight = initialBotRight.y - (initialTopLeft.y + deltaY);
				if (newHeight >= Math.max(windowConfig.minHeight, contentHeight)) {
					win.topLeft.y = initialTopLeft.y + deltaY;
				} else {
					// Ensure `botRight.y` remains consistent
					win.topLeft.y = win.botRight.y - Math.max(windowConfig.minHeight, contentHeight);
				}
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

		moving = false;
		resizing = false;
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
		<div class="panes">
			{#each win.panes as pane}
				<div class="pane">{pane.title}</div>
			{/each}
		</div>
		<div class="window-controls">
			<button class="close-btn" onclick={() => onRemove(win.id)}>
				<CloseSvg />
			</button>
		</div>
	</div>
	<!-- CONTENT -->
	<div class="window-content" bind:this={contentRef}>
		{#if win.panes.length == 0}
			{#if emptyWindowContent}
				{@render emptyWindowContent()}
			{:else}
				<h1>No panes</h1>
			{/if}
		{:else}
			<h1>{win.panes.length}</h1>
		{/if}
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
		background-color: #efefef;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		position: absolute;
		min-height: 100px;
		min-width: 100px;
		overflow: hidden;
	}

	.window-header {
		background-color: #d0d6b3;
		height: 50px;
		user-select: none;
	}

	.window-controls {
		right: 0;
		position: absolute;
		padding-right: 2px;
	}

	.window-content {
		display: flex; /* Ensure content flows properly */
		flex-direction: column; /* Adjust content direction */
		inline-size: fit-content; /* Let the content dictate the size */
		block-size: fit-content; /* Ensure height is determined by the content */
		overflow: hidden; /* Prevent overflow from affecting the layout */
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
