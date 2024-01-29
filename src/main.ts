import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
const pinia = createPinia();

import svgIcon from './assets/icons/index.vue';
import 'virtual:svg-icons-register';

import router from './router';
import FeatureCards from './components/FeatureCards.vue';
import TopNavigationbar from './components/TopNavigationbar.vue';
import PopUps from './components/PopUps.vue';

const app = createApp(App);
app.component('svg-icon', svgIcon);
app.use(pinia);
pinia.use(piniaPluginPersistedstate);
app.use(router);
app.component('FeatureCards', FeatureCards);
app.component('TopNavigationbar', TopNavigationbar);
app.component('PopUps', PopUps);
app.mount('#app');
