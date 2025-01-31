<script lang="ts">
    let N = 5; // Change this to set the grid size
    let cells = Array.from({ length: N * N }); // Creates an array of N*N elements
</script>

<div class="rs-grid-container" style="grid-template-columns: repeat({N}, 1fr); grid-template-rows: repeat({N}, 1fr);">
    {#each cells as _}
        <div class="rs-grid-cell"></div>
    {/each}
</div>

<style>
    .rs-grid-container {
        width: 100%;
        height: 100%;
        display: grid;
        gap: 2px; /* Optional: Adds spacing between cells */
    }

    .rs-grid-cell {
        opacity: 0;
        background-color: black;
        aspect-ratio: 1; /* Ensures square shape */
    }

    .rs-grid-cell:hover {
        opacity: 1;
    }
</style>
