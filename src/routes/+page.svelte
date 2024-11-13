<script lang="ts">
	import type { GridOptions } from '$lib/rsl/helpers/options/girdOptions.js';
	import type { WindowOptions } from '$lib/rsl/helpers/options/windowOptions.js';
	import type { WindowManagerOptions } from '$lib/rsl/helpers/options/windowManagerOptions.js';
	import RsLayout from '$lib/rsl/RsLayout.svelte';

	let gridOptions: GridOptions = {
		rows: 5,
		columns: 20,
		gap: 14,
		transitionDuration: 100,

	};

	let windowOptions: WindowOptions = {
		minWidth: 100,
		minHeight: 100
	}

	let windowManagerOptions: WindowManagerOptions = {
		windowSpawnPoint: {x: 100, y: 200}
	}


</script>

<main>
	<RsLayout {gridOptions} {windowOptions} {windowManagerOptions}/>
</main>

<style>
	main {
		height: 100vh;
	}

	:global(body) {
		margin: 0;
		overflow: hidden;
	}
</style>
