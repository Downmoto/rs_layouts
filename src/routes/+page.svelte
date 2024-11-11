<script lang="ts">
    import Window from '$lib/rsl/Window.svelte'
	import WindowManager from '$lib/rsl/WindowManager.svelte';
</script>

<main>
    <WindowManager />
</main>

<style>
    main {
        height: 100vh; 
    }

    :global(body) {
        margin: 0;
    }
</style>