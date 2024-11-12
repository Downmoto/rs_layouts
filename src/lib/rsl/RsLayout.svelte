<script lang="ts">
	import type { GridOptions } from './helpers/options/girdOptions.js';
	import type { WindowManagerOptions } from './helpers/options/windowManagerOptions.js';
	import type { WindowOptions } from './helpers/options/windowOptions.js';
	import { VirtualGrid } from './helpers/virtualGrid.js';
	import WindowManager from './WindowManager.svelte';
	import Grid from './Grid.svelte';

	let {
		gridOptions,
		windowOptions,
		windowManagerOptions
	}: {
		gridOptions: GridOptions;
		windowOptions: WindowOptions;
		windowManagerOptions: WindowManagerOptions;
	} = $props();

	let virtualGrid: VirtualGrid = $state.raw(
		new VirtualGrid(
			gridOptions.rows,
			gridOptions.columns,
			gridOptions.gap,
		)
	);
</script>

<div class="rs">
	<WindowManager winOptions={windowOptions} winManOptions={windowManagerOptions} />
	<Grid options={gridOptions} grid={virtualGrid} />
</div>
