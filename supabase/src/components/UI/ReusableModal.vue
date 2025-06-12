<template>
  <div>
    <!-- Button to open the modal -->
    <button
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      @click="showModal = true"
    >
      Open Modal
    </button>

    <!-- Modal container -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <!-- Modal content -->
      <div class="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
        <p class="text-lg font-medium">This is a semi-transparent modal!</p>
        <button
          class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          @click="showModal = false"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false, // Controls modal visibility
    }
  },
}
</script>

<style scoped>
/* Scoped styles (optional) */
</style>
