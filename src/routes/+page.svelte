<script>
	import RsLayout from '$lib/RsLayout.svelte';
</script>

<div class="layout-container">
	<RsLayout gridSize={12} />
</div>

<style>
	/* Reset default margins and make the layout container full viewport */
	:global(body, html) {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100vh;
		overflow: hidden;
	}

	.layout-container {
		width: 100%;
		height: 100vh;
	}
</style>
