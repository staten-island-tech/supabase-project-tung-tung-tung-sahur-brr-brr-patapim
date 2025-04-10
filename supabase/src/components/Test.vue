<template>
    <canvas ref="canvasRef" width="64" height="64"></canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const canvasRef = ref(null);

onMounted(() => {
    const canvas = canvasRef.value;
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.src = '../assets/!Chest.png'; // Make sure your sprite sheet is accessible
    console.log("thing")
    image.onLoad = () => {
        const tileWidth = 64;
        const tileHeight = 64;

        const col = 1; // second chest
        const row = 0; // first row
        
        ctx.drawImage(
        image,
        col * tileWidth, row * tileHeight,   // source x, y
        tileWidth, tileHeight,               // source width/height
        0, 0,                                // destination x, y
        tileWidth, tileHeight                // destination width/height
        );
    };
});
</script>