<script lang="ts">
	import type { WindowConfig } from '$lib/rsl/config/windowConfig.js';
	import type { WindowManagerConfig } from '$lib/rsl/config/windowManagerConfig.js';
	import { setWindowManagerState } from '$lib/rsl/state/windowManagerState.svelte.js';
	import RsLayout from '$lib/rsl/RsLayout.svelte';

	let windowConfig: WindowConfig = {
		minWidth: 100,
		minHeight: 100,
		resizingZoneOverflow: 4
	};

	let windowManagerConfig: WindowManagerConfig = {
		windowSpawnPoint: { x: 600, y: 100 }
	};

	let windowManager = setWindowManagerState(windowConfig, windowManagerConfig);
</script>

<main>
	<div class="container">
		<button onclick={() => windowManager.createWindow()} style:position="absolute">
			click me
		</button>
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
