<script lang="ts">
	import Grid from '$lib/rsl/Grid.svelte';
	import Window from '$lib/rsl/Window.svelte';
	import WindowManager from '$lib/rsl/WindowManager.svelte';
</script>

<main>
	<Grid />
</main>

<style>
	main {
		height: 100vh;
	}

	:global(body) {
		margin: 0;
	}
</style>
