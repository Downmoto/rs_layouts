<script lang="ts">
	import { onMount } from 'svelte';
	import { VirtualGrid } from './helpers/virtualGrid.js';
	import type { Cell } from './helpers/types/_Cell.js';
	import type { GridOptions } from './helpers/options/girdOptions.js';

	let { options, grid }: { options: GridOptions; grid: VirtualGrid } = $props();

	let cells: Cell[] = $derived(grid.getCells());

	// Function to initialize or update grid
	function updateGrid() {
		grid = new VirtualGrid({
			rows: options.rows,
			columns: options.columns,
			gap: options.gap,
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight
		});
	}

	// Update grid on window resize
	onMount(() => {
		updateGrid();
		window.addEventListener('resize', updateGrid);
		return () => window.removeEventListener('resize', updateGrid);
	});
</script>

<div
	class="grid-container"
	style="--gap: {options.gap}px; grid-template-columns: repeat({options.columns}, 1fr);"
>
	{#each cells as cell}
		<div
			class="cell"
			style="
				width: {cell.botRight.x - cell.topLeft.x}px;
				height: {cell.botRight.y - cell.topLeft.y}px;
			"
		></div>
	{/each}
</div>

<!-- <svelte:window bind:innerWidth={options.screenWidth} bind:innerHeight={options.screenHeight} /> -->

<style>
	.grid-container {
		display: grid;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		gap: var(--gap);
		overflow: hidden;
	}

	.cell {
		background-color: lightgray;
		border: 1px solid #ccc; /* Optional for visual separation */
		box-sizing: border-box;
		overflow: hidden;
	}
</style>
