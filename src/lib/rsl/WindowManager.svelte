<script lang="ts">
	import type { WindowData } from './helpers/types/WindowData.js';
	import type { WindowOptions } from './helpers/options/windowOptions.js';
	import type { WindowManagerOptions } from './helpers/options/windowManagerOptions.js';
	import type { VirtualGrid } from './helpers/virtualGrid.js';
	import { v4 as uuidv4 } from 'uuid';
	import Window from './Window.svelte';

	let {
		winOptions,
		winManOptions,
		virtualGrid
	}: {
		winOptions: WindowOptions;
		winManOptions: WindowManagerOptions;
		virtualGrid: VirtualGrid
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
<button onclick={createWindow}>click me</button>

<style>
	button {
		position: absolute;
	}
</style>
