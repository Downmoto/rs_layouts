<script lang="ts">
	import type { WindowData } from './helpers/types/WindowData.js';
	import type { WindowOptions } from './helpers/options/windowOptions.js';
	import type { WindowManagerOptions } from './helpers/options/windowManagerOptions.js';
	import type { VirtualGrid } from './helpers/virtualGrid.js';
	import { v4 as uuidv4 } from 'uuid';
	import Window from './Window.svelte';
	import Grid from './Grid.svelte';
	import type { GridOptions } from './helpers/options/girdOptions.js';
	import type { Cell } from './helpers/types/_Cell.js';

	let {
		winOptions,
		winManOptions,
		virtualGrid,
		gridOptions
	}: {
		winOptions: WindowOptions;
		winManOptions: WindowManagerOptions;
		virtualGrid: VirtualGrid;
		gridOptions: GridOptions
	} = $props();

	let windows: WindowData[] = $state([]);
	let maxZIndex = 0;

	function createWindow() {
		windows.push({
			id: uuidv4(),
			panes: [],
			topLeft: winManOptions.windowSpawnPoint,
			botRight: {
				x: winOptions.minWidth + winManOptions.windowSpawnPoint.x,
				y: winOptions.minHeight + winManOptions.windowSpawnPoint.y
			}, // minimum value for a window size
			zIndex: ++maxZIndex
		});
	}

	function EventRemoveWindow(id: string) {
		windows.filter((value, index) => {
			if (value.id === id) {
				windows.splice(index, 1);
				return true;
			}
			return false;
		});
	}

	function EventBringToFront(id: string) {
		const window = windows.find((w) => w.id === id);
		if (window) {
			window.zIndex = ++maxZIndex;
		}
	}
</script>

<button onclick={createWindow}>click me</button>
<Grid options={gridOptions} grid={virtualGrid} />
<div class="window-manager">
	{#each windows as w, index (w.id)}
		<Window
			{winOptions}
			bind:win={windows[index]}
			onRemove={EventRemoveWindow}
			onClick={EventBringToFront}
		/>
	{/each}
</div>

<style>
	button {
		position: absolute;
	}
</style>
