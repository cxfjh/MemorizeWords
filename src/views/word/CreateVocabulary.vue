<template>
    <div id="CreateVocabulary">
        <nav class="topNav"><top-navigationbar></top-navigationbar></nav>

        <div>
            <button @click="empty">清空词汇</button>
            <input :placeholder="inputPrompt" v-model.lazy="nameTable" />
            <button @click="create">创建</button>
        </div>

        <article class="article" ref="article" @scroll="handleScroll(article, addWord)">
            <div v-for="(item, index) in vocabularyList" :key="index">
                <input v-model.lazy="item.english" :placeholder="item.placeholderEnglish" />
                <span>→</span>
                <input v-model.lazy="item.chinese" :placeholder="item.placeholderChinese" />
            </div>
        </article>
    </div>
</template>
  
<script setup lang="ts">
import { Ref, ref } from 'vue';
import db from '../../store/db';
import statusInformation from '../../store/index';
import { handleScroll, formatTime } from '../../module/index';

const article: Ref<HTMLElement> = ref(null);
const nameTable: Ref<string> = ref(null);
const inputPrompt: Ref<string> = ref('为此词汇表起一个名称');
const vocabularyList: Ref<{ [key: string]: string }[]> = ref([{ name: '', english: '', chinese: '', date: '', placeholderEnglish: '英文', placeholderChinese: '中文', }]);
const store = statusInformation();
const example: Ref<{ [key: string]: string }[]> = ref([
    { placeholderEnglish: 'happy', placeholderChinese: '开心' },
    { placeholderEnglish: 'apple', placeholderChinese: '多义词可用分号隔开' },
    { placeholderEnglish: 'run', placeholderChinese: '跑步；竞选；' },
    { placeholderEnglish: 'an', placeholderChinese: '多义词可用分号结束' },
    { placeholderEnglish: 'learn', placeholderChinese: '学习；学会；' },
]);

// 教用户怎么使用
setTimeout(() => {
    for (const index in example.value) {
        vocabularyList.value[index].placeholderEnglish = example.value[index].placeholderEnglish;
        vocabularyList.value[index].placeholderChinese = example.value[index].placeholderChinese;
    };
}, 200);


// 滚动生成空位
const addWord = (): void => { for (let i = 0; i <= 10; i++) { vocabularyList.value.push({ name: '', english: '', chinese: '', date: '', placeholderEnglish: '英文', placeholderChinese: '中文', }); }; };
addWord();


// 插入数据
const create = async () => {
    if (!nameTable.value) return;
    const uniqueNames = await db.vocabularys.orderBy('name').uniqueKeys(async (keys) => keys);
    if (!uniqueNames.includes(nameTable.value)) {
        const updatedArr: any = vocabularyList.value.map(obj => { return { ...obj, name: nameTable.value, date: formatTime(new Date(), 'YYYY-MM-DD HH:mm:ss') }; });
        const filteredArr = updatedArr.filter((obj: { english: string; chinese: string; }) => obj.english !== '' && obj.chinese !== '');
        if (filteredArr.length == 0) return;
        await db.vocabularys.bulkAdd(filteredArr);
        inputPrompt.value = `新建《${nameTable.value}》表成功`;
        nameTable.value = '';
        store.databaseStatus = !store.databaseStatus;
        return;
    };
    inputPrompt.value = '名称已重复，请换个名词'; nameTable.value = '';
};

// 清空词汇
const empty = (): void => {
    vocabularyList.value = vocabularyList.value.map(obj => { return { ...obj, name: '', english: '', chinese: '', date: '' }; });
    nameTable.value = '';
    inputPrompt.value = '为此词汇表起一个名称';
};
</script>

<style scoped>
#CreateVocabulary {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
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

#CreateVocabulary>div {
    margin: 6rem 0 0.6rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 1rem 0;
    width: 100%;
}

#CreateVocabulary>div>input {
    width: 18rem;
    height: 4rem;
    text-align: center;
    border: 0.1rem solid #dcdfe6;
    border-radius: 0.5rem;
    outline: none;
    background-color: white;
    font-size: 1.3rem;
}

#CreateVocabulary>div>input:focus {
    border-color: #409eff;
}

#CreateVocabulary>div>button {
    width: 8rem;
    height: 4rem;
    text-align: center;
    background-color: #409eff;
    color: white;
    border: none;
    outline: none;
    cursor: pointer;
    border-radius: 0.5rem;
    font-size: 1.3rem;
}

.article {
    width: 100%;
    overflow-y: scroll;
}

.article>div {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 1rem 0 2rem 0;
}

.article>div>span {
    font-size: 2.5rem;
}

.article>div>input {
    height: 4.5rem;
    width: 15rem;
    text-align: center;
    border: 0.1rem solid #dcdfe6;
    border-radius: 0.5rem;
    outline: none;
    background-color: white;
    font-size: 1.3rem;
}

.article>div>input:focus {
    border-color: #409eff;
}
</style>