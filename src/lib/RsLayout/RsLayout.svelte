<script lang="ts">
	import Grid from "../Grid/Grid.svelte";

    let {gridSize} = $props<{gridSize: number}>();

</script>


<div class="container">
    <Grid {gridSize}>

    </Grid>
</div>


<style>
.container {
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
    display: flex;
}
</style>