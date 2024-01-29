import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export default defineStore('statusInformation', () => {
    const databaseStatus: Ref<boolean> = ref(false);
    const choiceFeatures: Ref<Array<string>> = ref(['英文词汇', '看写词汇', '重复词汇', '随机词汇']);
    const handoffText: Ref<string[][]> = ref([
        ['英文词汇', '中文词汇', '中英词汇'],
        ['看写词汇', '听写词汇'],
        ['重复词汇', '不重复词汇'],
        ['随机词汇', '顺序词汇', '倒序词汇']
    ]);
    const glossary: Ref<{ [key: string]: string }[]> = ref([]);
    const choose: Ref<boolean> = ref(true);
    const selectVocabulary: Ref<string> = ref('');
    const renderState: Ref<number> = ref(0);
    return { databaseStatus, choiceFeatures, handoffText, glossary, choose, selectVocabulary, renderState }
}, { persist: true });
