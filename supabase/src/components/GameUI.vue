<script lang="ts" setup></script>
<template>
  <div class="background">
    <div class="buttons-container">
      <button>PLAY</button>
      <button>ABOUT</button>
      <button>SETTINGS</button>
    </div>
  </div>
</template>

<style scoped>
.background {
  background-image: url('/pixel.png');
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
}
.buttons-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.buttons-container button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  color: white;
}
</style>
