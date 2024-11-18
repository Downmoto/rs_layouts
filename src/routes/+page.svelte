<script lang="ts">
	import Grid from '$lib/rsl/Grid.svelte';
	import type { GridConfig } from '$lib/rsl/helpers/config/girdConfig.js';
	import type { WindowConfig } from '$lib/rsl/helpers/config/windowConfig.js';
	import type { WindowManagerConfig } from '$lib/rsl/helpers/config/windowManagerConfig.js';
	import RsLayout from '$lib/rsl/RsLayout.svelte';

	let gridConfig: GridConfig = {
		rows: 20,
		columns: 20,
		gap: 3,
		transitionDuration: 500,

	};

	let windowConfig: WindowConfig = {
		minWidth: 100,
		minHeight: 100,
		resizingZoneOverflow: 5
	}

	let windowManagerConfig: WindowManagerConfig = {
		windowSpawnPoint: {x: 100, y: 200}
	}


</script>

<main>
	<RsLayout {gridConfig} {windowConfig} {windowManagerConfig}/>
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
