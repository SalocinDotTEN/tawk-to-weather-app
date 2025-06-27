<template>
  <div>
    <router-view />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  onMounted(() => {
    // Redirect to weather page
    router.push('/weather')
  })
</script>
