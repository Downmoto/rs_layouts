<script lang="ts">
	import type { Cell } from './helpers/types/Cell.js';
	import type { GridConfig } from './helpers/config/girdConfig.js';
	import { getVirtualGridState, VirtualGrid } from './helpers/state/virtualGridState.svelte.js';
	import { onMount } from 'svelte';
	import { on } from 'svelte/events';

	let { config }: { config: GridConfig } = $props();

	let grid: VirtualGrid = getVirtualGridState();
	let cells: Cell[] = $derived(grid.getCells());

	// svelte-ignore non_reactive_update
	let containerDiv: HTMLElement;
	function updateGrid(w: number, h: number) {
		grid.updateGrid(config.rows, config.columns, config.gap, w, h);
	}

	onMount(() => {
		updateGrid(containerDiv.offsetWidth, containerDiv.offsetHeight);
		let destroy = on(window, 'resize', () => {
			updateGrid(containerDiv.offsetWidth, containerDiv.offsetHeight);
		});
		return () => destroy();
	});

	$effect(() => {
		console.log($state.snapshot(cells))
	})
</script>

<div
	bind:this={containerDiv}
	class="grid-container"
	style="
		--gap: {config.gap}px; 
		grid-template-columns: repeat({config.columns}, 1fr);
	"
>
	{#if grid.show}
		{#each cells as cell}
			<div
				class="cell"
				style="
				width: {cell.botRight.x - cell.topLeft.x}px;
				height: {cell.botRight.y - cell.topLeft.y}px;
			"
			></div>
		{/each}
	{/if}
</div>

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
		border-radius: 5px;
		background-color: lightgray;
		border: 1px solid #ccc;
		box-sizing: border-box;
		overflow: hidden;
	}
</style>
