<template>
  <footer class="bg-blue flex justify-center w-full fixed bottom-0">
    <p class="p-2 text-xs text-gray-800 uppercase">
      {{ `© ${new Date().getFullYear()} E-com` }}
    </p>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
}
</script>

<style lang="scss" scoped>
 .link {
   @apply hover:underline;
   @apply hover:opacity-75;
 }

 footer {
   margin-top: auto;
 }
</style>
