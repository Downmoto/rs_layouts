<script lang="ts">
	import type { Cell } from './helpers/types/_Cell.js';
	import type { GridOptions } from './helpers/options/girdOptions.js';
	import { VirtualGrid } from './helpers/virtualGrid.js';
	import { onMount } from 'svelte';
	import { on } from 'svelte/events';
	import { showGrid } from './helpers/state/showGrid.svelte.js';
	import { fade } from 'svelte/transition';

	let { options, grid }: { options: GridOptions; grid: VirtualGrid } = $props();

	let cells: Cell[] = $derived(grid.getCells());

	// Function to initialize or update grid
	function updateGrid() {
		grid = new VirtualGrid(
			options.rows,
			options.columns,
			options.gap,
			window.innerWidth,	// safe as first call is onMount with access to window obj
			window.innerHeight  // safe as first call is onMount with access to window obj
		);
	}

	// Update grid on window resize
	onMount(() => {
		updateGrid();
		let destroy = on(window, 'resize', updateGrid);
		return () => destroy();
	});
</script>

{#if showGrid.show}
	<div
		transition:fade={{ duration: options.transitionDuration }}
		class="grid-container"
		style="
		--gap: {options.gap}px; 
		grid-template-columns: repeat({options.columns}, 1fr);
	"
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
{/if}

<style>
	.grid-container {
		display: grid;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		gap: var(--gap);
		overflow: hidden;
		user-select: none;
	}

	.cell {
		background-color: lightgray;
		border: 1px solid #ccc; /* Optional for visual separation */
		box-sizing: border-box;
		overflow: hidden;
	}
</style>
