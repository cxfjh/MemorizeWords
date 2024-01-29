import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

import Word from '../views/Word.vue';
import Training from '../views/Training.vue';
import User from '../views/User.vue';

import CreateVocabulary from '../views/word/CreateVocabulary.vue';
import MemorizeWords from '../views/training/MemorizeWords.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/Word' },
  {
    path: '/Word', component: Word,
    children: [{ path: 'CreateVocabulary', component: CreateVocabulary, },]
  },
  {
    path: '/Training', component: Training,
    children: [{ path: 'MemorizeWords', component: MemorizeWords, }]
  },
  { path: "/User", component: User, }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

