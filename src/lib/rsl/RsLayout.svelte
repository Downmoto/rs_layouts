<script lang="ts">
	import type { WindowConfig } from './helpers/config/windowConfig.js';
	import type { WindowData } from './helpers/types/WindowData.js';
	import { getWindowManagerState } from './helpers/state/windowManagerState.svelte.js';
	import Window from './Window.svelte';

	let {
		windowConfig
	}: {
		windowConfig: WindowConfig;
	} = $props();

	let containerDiv: HTMLElement | undefined = $state()
	// Initial grid with no w & h made and passed to Grid for onMount re-initialization
	let windowManager = getWindowManagerState();
	let windows: WindowData[] = $derived(windowManager.getWindows());
</script>

<div class="rs" bind:this={containerDiv}>
	{#each windows as w, index (w.id)}
		<Window
			{windowConfig}
			bind:win={windows[index]}
			onRemove={() => windowManager.removeWindow(w.id)}
			onClick={() => windowManager.bringWindowToFront(w.id)}
			parentWidthConstraint={containerDiv.offsetWidth}
			parentHeightConstraint={containerDiv.offsetHeight}
		/>
	{/each}
</div>

<style>
	.rs {
		width: 100%;
		height: 100%;
	}
</style>
