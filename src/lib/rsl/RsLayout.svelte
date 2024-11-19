<script lang="ts">
	import type { GridConfig } from './helpers/config/girdConfig.js';
	import type { WindowManagerConfig } from './helpers/config/windowManagerConfig.js';
	import type { WindowConfig } from './helpers/config/windowConfig.js';
	import type { WindowData } from './helpers/types/WindowData.js';
	import { setVirtualGridState } from './helpers/state/virtualGridState.svelte.js';
	import { setWindowManagerState } from './helpers/state/windowManagerState.svelte.js';
	import Grid from './Grid.svelte';
	import Window from './Window.svelte';

	let {
		gridConfig,
		windowConfig,
		windowManagerConfig
	}: {
		gridConfig: GridConfig;
		windowConfig: WindowConfig;
		windowManagerConfig: WindowManagerConfig;
	} = $props();

	// Initial grid with no w & h made and passed to Grid for onMount re-initialization
	setVirtualGridState(gridConfig.rows, gridConfig.columns, gridConfig.gap);
	let windowManager = setWindowManagerState(windowConfig, windowManagerConfig);
	let windows: WindowData[] = $derived(windowManager.getWindows())
</script>

<div class="rs">
	<button onclick={() => windowManager.createWindow()}> click me </button>
	<Grid config={gridConfig} />
	<div class="window-manager">
		{#each windows as w, index (w.id)}
			<Window 
			{windowConfig}
			bind:win={windows[index]}
			onRemove={() => windowManager.removeWindow(w.id)}
			onClick={() => windowManager.bringWindowToFront(w.id)}
			/>
		{/each}
	</div>
</div>
