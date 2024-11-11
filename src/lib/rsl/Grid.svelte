<script lang="ts">
	import { onMount } from 'svelte';
	import { virtualGrid } from './helpers/virtualGrid.js';
	import type { Cell } from './helpers/types/_Cell.js';

	let cells: Cell[] = [];

	// Define grid parameters
	const rows = 10; // adjust as needed
	const columns = 10; // adjust as needed
	let gap = 10; // gap between cells in pixels, adjust as needed
	let innerWidth: number; // responsive screen width
	let innerHeight: number; // screen height in pixels (or make this responsive too if needed)

	let grid: virtualGrid;

	// Function to initialize or update grid
	function updateGrid() {
		grid = new virtualGrid({
			rows,
			columns,
			gap,
			screenWidth: innerWidth,
			screenHeight: innerHeight
		});
		cells = grid.getCells();
	}

	// Update grid on window resize
	onMount(() => {
		updateGrid();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});

	function handleResize() {
		updateGrid();
	}
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<div class="grid-container" style="--gap: {gap}px; grid-template-columns: repeat({columns}, 1fr);">
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

<style>
	.grid-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(0, 1fr));
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		gap: var(--gap);
		padding-bottom: var(--gap); /* Adds consistent padding around the entire grid */
		padding-right: var(--gap); /* Adds consistent padding around the entire grid */
		/* overflow: hidden; */
	}

	.cell {
		background-color: lightgray;
		border: 1px solid #ccc; /* Optional for visual separation */
		box-sizing: border-box;
		overflow: hidden;
	}
</style>
