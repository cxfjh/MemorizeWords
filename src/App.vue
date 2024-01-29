<template>
  <div id="app">

    <!-- 路由界面 -->
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>

    <!-- 底部导航栏 -->
    <nav class="bottomNav"><navigation-bar></navigation-bar></nav>

  </div>
</template>

<script setup lang="ts">
import NavigationBar from './components/NavigationBar.vue'; // 导入导航栏组件
import { defaultVocabulary } from './module/index';
import statusInformation from './store/index';
const store = statusInformation();

const allowedHashes = ['#/Word', '#/Word/CreateVocabulary', '#/', '/'];
if (allowedHashes.includes(window.location.hash)) { store.renderState = 1; };
if (localStorage.getItem('version') == null) { defaultVocabulary(); };
</script>

<style scoped>
.bottomNav {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 5.5rem;
  background-color: white;
  border-top: 1px solid #dcdfe6;
  z-index: 1;
}
</style>