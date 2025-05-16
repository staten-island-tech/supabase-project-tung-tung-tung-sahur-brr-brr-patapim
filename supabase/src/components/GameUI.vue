<script lang="ts" setup></script>
<template>
  <div class="justify-center align-middle">
    <div class="background">
      <div class="buttons-container">
        <button>
          <img src="/buttons/Start.png" alt="" class="rounded-3xl" />
        </button>
        <button><img src="/buttons/Credits.png" alt="" class="rounded-3xl" /></button>
        <button><img src="/buttons/Settings.png" alt="" class="rounded-3xl" /></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.background {
  background-image: url('/Rome.webp');
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.buttons-container {
  display: flex;
  flex-direction: column;
  align-items: center;

  transform: scale(0.3); /* Makes the container and its contents smaller */
}

.buttons-container button {
  margin: 40px;
  cursor: pointer;
}
</style>
