<script lang="ts">
	let {gridSize} = $props<{gridSize: number}>();
	let zones: number[] = [];

    $effect(() => {
        zones = Array.from({ length: gridSize * gridSize }, (_, i) => i);
    })
</script>

<div class="grid" style="--grid-size: {gridSize}">
	{#each zones as zone}
		<div class="zone">
			{zone + 1}
		</div>
	{/each}
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(var(--grid-size), 1fr);
		grid-template-rows: repeat(var(--grid-size), 1fr);
		width: 100%;
		height: 100%;
		gap: 2px;
		background-color: #333;
		padding: 2px;
	}

	.zone {
		background-color: #fff;
		border: 1px solid #ddd;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.8em;
		color: #666;
	}
</style>