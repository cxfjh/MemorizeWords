<template>
    <div id="Training">
        <h2 class="h2">{{ store.choose ? '词汇' : '功能' }}选择</h2>

        <article class="wordChoice" v-show="store.choose">
            <FeatureCards :cardsStyle="cardsStyles" :info="infos" @operate="handleCardClick" @info="info"></FeatureCards>
        </article>

        <article class="choiceFeatures" v-show="!store.choose">
            <div v-for="(item, index) in store.choiceFeatures" :key="index" @click="wordChoice(index)"><span>{{ item
            }}</span></div>
            <div @click="store.choose = true"><span>选择词汇</span></div>
            <div @click="start"><span>开始训练</span></div>
        </article>

        <router-view v-slot="{ Component }">
            <transition name="scale-slide">
                <keep-alive>
                    <component :is="Component" />
                </keep-alive>
            </transition>
        </router-view>
    </div>
</template>
  
<script setup lang="ts">
import { Ref, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import db from '../store/db';
import statusInformation from '../store/index';
import { fileExport } from '../module/index';

const cardsStyles: Ref<{ [key: string]: string }[]> = ref([]);
const infos: Ref<string[]> = ref([]);
const store = statusInformation();
const router = useRouter();

// 渲染有关词汇表
const uniqueNames = async (): Promise<void> => {
    let info: Array<string> = await db.vocabularys.orderBy('id').reverse().toArray(records => records.map(record => record.name));
    info = Array.from(new Map(info.map(item => [item, item])).values());
    cardsStyles.value = info.map(item => ({ text: item, operate: item, touchstart: '1' } as { [key: string]: string }));
};
uniqueNames();

// 点击并获取词汇表所有信息
const handleCardClick = (information: string): void => {
    store.selectVocabulary = information;
    store.choose = !store.choose;
};

// 监听数据库变化
watch(() => store.databaseStatus, () => { uniqueNames(); }, { immediate: true });

watch(() => store.choose, (newDate) => { if (newDate) { store.choose = true; } }, { immediate: true });

// 收集信息开始背单词
const start = async () => {
    store.glossary = await db.vocabularys.where('name').equals(store.selectVocabulary).toArray(items => items.map(({ english, chinese, phoneticSymbol }) => ({ english, chinese, phoneticSymbol })));
    router.push({ path: '/Training/MemorizeWords', });
};

// 收集用户选择功能
const wordChoice = (index: number): void => {
    store.handoffText[index] = [...store.handoffText[index].slice(1), store.handoffText[index][0]];
    store.choiceFeatures[index] = store.handoffText[index][0];
};

// 增删查改操作
const info = async (value: { [key: string]: string }) => {
    switch (value['operate']) {
        case 'name':
            const result: any = await db.vocabularys.where('name').equals(value['name']).toArray();
            infos.value = [result[0].name, result.length, result[0].newDate ? result[0].newDate : result[0].date];
            break;
        case 'deletes':
            await db.vocabularys.where('name').equals(value['name']).delete();
            store.databaseStatus = !store.databaseStatus;
            break;
        default: fileExport(value['name']); break;
    };
};
</script>
  
<style scoped>
.scale-slide-enter-active,
.scale-slide-leave-active {
    position: absolute;
    transition: all 0.4s ease;
}

.scale-slide-enter-from {
    right: -100%;
}

.scale-slide-enter-to {
    right: 0%;
}

.scale-slide-leave-from {
    transform: scale(1);
}

.scale-slide-leave-to {
    transform: translateX(100%);
}

.h2 {
    padding: 2rem 2rem;
    font-size: 2.5rem;
}

.wordChoice {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    margin-bottom: 5.5rem;
}

.choiceFeatures {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    padding: 0 3rem;
    margin-bottom: 5.5rem;
}

.choiceFeatures>div {
    width: 14rem;
    height: 10rem;
    background-color: #3f74ff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2rem 0 2rem;
    ;
    font-size: 2rem;
    border-radius: 1rem;
    color: white;
    font-weight: 800;
}

.choiceFeatures>div:last-child {
    background-color: #ff9c00;
}
</style>