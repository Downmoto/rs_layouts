<script lang="ts">
	import { Window } from '$lib/index.js';
	import { WindowDefaultConfig, type WindowConfig } from '$lib/rsl/configs/WindowConfig.js';

	let windowConfig: WindowConfig = {
		style: {
			borderRadius: 30,
			backgroundColour: "lavender"
		}
	};
</script>

<main>
	<div class="container">
		<div class="window-wrapper">
			<Window {windowConfig} />
		</div>
		<div class="window-wrapper">
			<Window windowConfig={WindowDefaultConfig} />
		</div>
	</div>
	<a href="/grid"><button>grid</button></a>
</main>

<style>
	main {
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	:global(body) {
		margin: 0;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	.container {
		display: flex;
		flex-direction: column; /* stack items vertically */
		justify-content: center;
		align-items: center;
		gap: 20px; /* space between stacked windows */
		height: auto;
	}

	.window-wrapper {
		width: 200px; /* square size */
		height: 200px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
