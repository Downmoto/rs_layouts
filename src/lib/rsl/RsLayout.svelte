<script lang="ts">
	import Grid from './Grid.svelte';
	import type { GridOptions } from './helpers/options/girdOptions.js';
	import { VirtualGrid } from './helpers/virtualGrid.js';
	import WindowManager from './WindowManager.svelte';

	let {
		gridOptions
	}: {
		gridOptions: GridOptions;
	} = $props();

	let virtualGrid: VirtualGrid = $state.raw(
		new VirtualGrid({
			rows: gridOptions.rows,
		    columns: gridOptions.columns,
			gap: gridOptions.gap
		})
	);
</script>

<div class="rs">
    <WindowManager />
	<Grid options={gridOptions} grid={virtualGrid} />
</div>
