<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import type { WindowData } from './helpers/types/WindowData.js';
	import Window from './Window.svelte';

	let windows: WindowData[] = $state([]);
	let maxZIndex = 0;

	function createWindow() {
		windows.push({
			id: uuidv4(),
			panes: [],
			topLeft: { x: 0, y: 0 },
			botRight: { x: 100, y: 100 }, // minimum value for a window size
			zIndex: ++maxZIndex
		});
	}

	function removeWindow(id: string) {
		windows.filter((value, index) => {
			if (value.id === id) {
				windows.splice(index, 1);
				return true;
			}
			return false;
		});
	}

	function bringToFront(id: string) {
		const window = windows.find((w) => w.id === id);
		if (window) {
			window.zIndex = ++maxZIndex;
		}
	}
</script>

<div class="window-manager">
	{#each windows as w, index (w.id)}
		<Window bind:win={windows[index]} onRemove={removeWindow} onClick={bringToFront} />
	{/each}
</div>
<button onclick={createWindow}>click me</button>

<style>
	button {
		position: absolute;
	}

</style>
