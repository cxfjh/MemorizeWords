<template>
    <div id="MemorizeWords">
        <nav class="topNav"><top-navigationbar :navStyle1=navStyle></top-navigationbar></nav>
        <article class="article">
            <span :style="{ color: store.choiceFeatures[1] == '听写词汇' ? 'white' : 'black' }">
                {{ menu.vocabulary ? menu.vocabulary : '训练结束' }}
                <a>{{ menu.phoneticSymbol ? menu.phoneticSymbol : '' }}</a>
            </span>
            <div>
                <input :placeholder="menu.checkWord" v-model.lazy="menu.content" />
                <button @click="submit(menu.content)">确认词汇</button>
            </div>
        </article>
        <footer class="footer">
            <span @click="examine(menu.vocabulary)">检查词汇</span>
            <span @click="speakWork(extractVocabulary.english)">词汇读音</span>
            <span @click="savingErrorProne">保存易错</span>
            <span @click="menu.vocabulary = englishRandom();">跳过词汇</span>
        </footer>
        <pop-ups ref="confirmBox" @confirm="confirm"></pop-ups>
    </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from 'vue';
import statusInformation from '../../store/index';
import { speakWork } from '../../module/index';
import db from '../../store/db';
import { formatTime } from '../../module/index';

const store = statusInformation();
const confirmBox: Ref<any> = ref(null);
const extractVocabulary: Ref<{ [key: string]: string }> = ref(null);
const errorProne: Ref<{ [key: string]: string }[]> = ref([]);
const contentIndex: Ref<number> = ref(0);
const menu: Ref<{ [key: string]: string }> = ref({ language: '', vocabulary: '', checkWord: '根据提示写出相对应的词汇', content: '', phoneticSymbol: '' });
const navStyle: { [key: string]: string } = { icon: 'Return', width: '2.5rem', height: '2.5rem', title: '词汇训练' };
const multiMeaning: Ref<Array<string>> = ref([]);
const render: Ref<number> = ref(null);

// 选择语言
const selectLanguage = (): string => {
    let language: string;
    if (store.choiceFeatures[0] === '英文词汇') { language = 'english'; }
    else if (store.choiceFeatures[0] === '中文词汇') { language = 'chinese'; }
    else { language = ['english', 'chinese'][Math.floor(Math.random() * ['english', 'chinese'].length)]; }
    return language;
};

// 选择的抽取顺序
const randomTables = (): void => {
    contentIndex.value = 0;
    if (store.choiceFeatures[3] === '随机词汇') { store.glossary.sort(() => Math.random() - 0.5); }
    else if (store.choiceFeatures[3] === '倒序词汇') { store.glossary.reverse(); };
};

// 选择是否重复词汇
const duplicate = (): { [key: string]: string } => {
    let content: { [key: string]: string };
    if (store.choiceFeatures[2] === '不重复词汇') { content = store.glossary[0]; store.glossary.shift(); }
    else { content = store.glossary[contentIndex.value]; contentIndex.value += 1; };
    if (store.choiceFeatures[2] === '重复词汇' && contentIndex.value === store.glossary.length && store.choiceFeatures[3] === '随机词汇') { store.glossary.sort(() => Math.random() - 0.5); };
    if (contentIndex.value === store.glossary.length) { contentIndex.value = 0; };
    return content;
};

// 开始训练
const englishRandom = (): string => {
    if (store.glossary.length == 0) { return menu.value.vocabulary = '训练结束' }; // 判断是否为空
    menu.value.checkWord = '根据提示写出相对应的词汇';
    extractVocabulary.value = duplicate(); // 获取词汇内容
    multiMeaning.value = extractVocabulary.value['chinese'].trim().split("；").filter(item => item !== "");
    menu.value.phoneticSymbol = extractVocabulary.value['phoneticSymbol'];
    let selectVocabulary: string = extractVocabulary.value[selectLanguage()]; // 选择需要的词汇
    if (/[\u4e00-\u9fa5]/.test(selectVocabulary)) { selectVocabulary = multiMeaning.value[Math.floor(Math.random() * multiMeaning.value.length)]; };
    store.choiceFeatures[1] == '听写词汇' ? speakWork(selectVocabulary) : ''; // 是否选择听写
    return selectVocabulary;
};

// 检查词汇
const examine = (value: string): string => {
    if (menu.value.vocabulary === '训练结束') return;
    menu.value.content = '';
    if (!(/^[^\u4e00-\u9fa5]*$/.test(value))) { return menu.value.checkWord = extractVocabulary.value[('english')]; };
    menu.value.checkWord = multiMeaning.value.sort(() => Math.random() - 0.5).slice(0, 3).join(';');
    return '';
};

// 判断是否对错
const submit = (value: string): void => {
    if (menu.value.vocabulary === '训练结束' || !value) return;
    menu.value.content = '';
    menu.value.checkWord = '根据提示写出相对应的词汇';
    if (examine(menu.value.vocabulary) === value || (!examine(menu.value.vocabulary) && multiMeaning.value.includes(value))) { menu.value.vocabulary = englishRandom(); }
    else { menu.value.checkWord = '错误，请重新写' };
    errorProne.value.push(extractVocabulary.value);
};

// 保存易错词汇
const savingErrorProne = (): void => {
    if (errorProne.value.length == 0) return;
    confirmBox.value.popUps('词汇表命名', true);
};

// 确认按钮并插入数据
const confirm = async (data: { value: string, starus: boolean }) => {
    if (!data.value) return;
    const uniqueNames = await db.vocabularys.orderBy('name').uniqueKeys(async (keys) => keys);
    if (uniqueNames.includes(data.value)) { confirmBox.value.input(); }
    else {
        interface Vocabulary { name: string; english: string; chinese: string; date: string; };
        const errorWords: Vocabulary[] = errorProne.value.map((item: { english: string; chinese: string; }) => ({ ...item, name: data.value, date: formatTime(new Date(), 'YYYY-MM-DD HH:mm:ss') }));
        await db.vocabularys.bulkAdd(errorWords);
        confirmBox.value.cancel();
        store.databaseStatus = !store.databaseStatus;
    };
};

watch(() => store.glossary, () => {
    if (store.renderState === 1) { render.value = 2; return store.renderState = 2; };
    if (store.renderState === 2 && render.value === 0) return render.value = 2;
    randomTables();
    menu.value.vocabulary = englishRandom();
    render.value = 0;
}, { immediate: true }); // 侦听词汇是否发生变化
</script>

<style scoped> #MemorizeWords {
     width: 100%;
     height: 100%;
     position: fixed;
     top: 0;
     background-color: #ffffff;
     display: flex;
     flex-direction: column;
     z-index: 2;
 }

 .topNav {
     width: 100%;
     position: absolute;
     top: 0;
     left: 0;
     background: white;
     border-bottom: 1px solid #dcdfe6;
     z-index: 1;
 }

 .article {
     display: flex;
     flex-direction: column;
     align-items: center;
     margin-top: 5.4rem;
     height: 35rem;
     justify-content: center;
 }

 .article>span {
     font-size: 4rem;
     font-weight: 800;
     margin-bottom: 5rem;
     display: flex;
     flex-direction: column;
     align-items: center;
     justify-content: center;
 }

 .article>span>a {
     font-size: 2rem;
     font-weight: normal;
 }

 .article>div {
     display: flex;
     flex-direction: column;
     align-items: center;
 }

 .article>div>input {
     width: 25rem;
     height: 4rem;
     font-size: 2rem;
     text-align: center;
     border: 0px;
     border-bottom: 0.1rem solid black;
     border-radius: 0.5rem;
     outline: none;
     background-color: white;
 }

 .article>div>input:focus {
     border-color: #409eff;
 }

 .article>div>button {
     width: 10rem;
     height: 5rem;
     text-align: center;
     background-color: #409eff;
     color: white;
     border: none;
     outline: none;
     cursor: pointer;
     border-radius: 0.5rem;
     margin-top: 3rem;
     font-size: 1.5rem;
 }

 .footer {
     display: flex;
     flex-wrap: wrap;
     justify-content: center;
 }

 .footer>span {
     width: 12rem;
     height: 8rem;
     background-color: #3f74ff;
     display: flex;
     justify-content: center;
     align-items: center;
     margin: 2rem 2rem 1rem 2rem;
     font-size: 2rem;
     border-radius: 1rem;
     color: white;
 }
</style>