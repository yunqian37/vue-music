<template>
  <div>
    <Header />
    <Tab />
    <router-view/>
  </div>
</template>
<script>
import Header from '@/components/header/header'
import Tab from '@/components/tab/tab.vue'
export default {
  components: {
    Header,
    Tab
  }
}
</script>
