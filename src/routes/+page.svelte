<script lang="ts">
	import Grid from '$lib/rsl/Grid.svelte';
	import type { GridOptions } from '$lib/rsl/helpers/options/girdOptions.js';
	import RsLayout from '$lib/rsl/RsLayout.svelte';
	import Window from '$lib/rsl/Window.svelte';
	import WindowManager from '$lib/rsl/WindowManager.svelte';
	import { onMount } from 'svelte';

	let gridOptions: GridOptions = {
		rows: 10,
		columns: 10,
		gap: 10
	};

	onMount(() => {
		console.log(devicePixelRatio);
	});
</script>

<main>
	<RsLayout {gridOptions} />
</main>

<style>
	main {
		height: 100vh;
	}

	:global(body) {
		margin: 0;
	}
</style>
