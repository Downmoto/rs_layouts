<script lang="ts">
	import type { WindowConfig } from './configs/WindowConfig.js';

	let {
		windowConfig
	}: {
		windowConfig: WindowConfig;
	} = $props();
</script>

<div
	class="window-container"
	style="
    --borderRadius: {windowConfig.style.borderRadius}px;
    --backgroundColour: {windowConfig.style.backgroundColour}
    "
>
<div class="window-drag-zone"></div>

<div class="window-resize-zone"></div>

<div class="window-content-zone"></div>
</div>

<style>
	.window-container {
        position: relative;
		height: 100%;
		width: 100%;
		background-color: var(--backgroundColour);
		border-radius: var(--borderRadius);
	}

    .window-resize-zone {
        position: absolute;
        bottom: 0;
        right: 0;
        height: 30px;
        width: 30px;
        background-color: aqua;
    }

    .window-drag-zone {
        position: absolute;
        height: 30px;
        width: 30px;
        background-color:aliceblue;
    }
</style>
