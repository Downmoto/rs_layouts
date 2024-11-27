<script lang="ts">
	import type { GridConfig } from '$lib/rsl/helpers/config/girdConfig.js';
	import type { WindowConfig } from '$lib/rsl/helpers/config/windowConfig.js';
	import type { WindowManagerConfig } from '$lib/rsl/helpers/config/windowManagerConfig.js';
	import { setVirtualGridState } from '$lib/rsl/helpers/state/virtualGridState.svelte.js';
	import {
		setWindowManagerState,
		WindowManager
	} from '$lib/rsl/helpers/state/windowManagerState.svelte.js';
    import Grid from '$lib/rsl/Grid.svelte';
	import RsLayout from '$lib/rsl/RsLayout.svelte';

	let gridConfig: GridConfig = {
		rows: 3,
		columns: 5,
		gap: 10,
		transitionDuration: 500
	};

	let windowConfig: WindowConfig = {
		minWidth: 100,
		minHeight: 100,
		resizingZoneOverflow: 4,
		snapOnByDefault: true,
		snapThreshold: 30
	};

	let windowManagerConfig: WindowManagerConfig = {
		windowSpawnPoint: { x: 600, y: 100 }
	};

	setVirtualGridState(gridConfig.rows, gridConfig.columns, gridConfig.gap);
	let windowManager: WindowManager = setWindowManagerState(windowConfig, windowManagerConfig);
</script>

<main>
	<div class="container">
		<button onclick={() => windowManager.createWindow()} style:position="absolute">
			click me
		</button>
		<Grid config={gridConfig} />
		<RsLayout {windowConfig} />
	</div>
</main>

<style>
	main {
		height: 100vh;
	}

	:global(body) {
		margin: 0;
		overflow: hidden;
	}

	.container {
		height: 100%;
		width: 100%;
	}
</style>
