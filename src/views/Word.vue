<template>
    <div id="Word">
        <h2 class="h2">创建词汇</h2>
        <article class="directory">
            <FeatureCards :cardsStyle="cardsStyle" @operate="handleCardClick"></FeatureCards>
            <input ref="fileInput" type="file" style="display: none;" />
        </article>

        <pop-ups ref="confirmBox" @confirm="confirm" @cancel="cancel"></pop-ups>

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
import { ref, Ref, toRaw } from 'vue';
import { useRouter } from 'vue-router';
import db from '../store/db';
import statusInformation from '../store';
import { formatTime } from '../module/index';

const router = useRouter();
const fileInput: Ref<any> = ref(null);
const confirmBox: Ref<any> = ref(null);
const store = statusInformation();

// 声明数据插入类型
interface Vocabulary {
    id?: number;
    name: string;
    english: string;
    chinese: string;
    date: string;
    newDate?: string;
};
const jsonInfo: Ref<ReadonlyArray<Vocabulary>> = ref(null);

const cardsStyle: { [key: string]: string }[] = [
    { text: '新建词汇', backgroundColor: '#02d5c9', operate: 'createVocabulary', backgroundImage: 'public/image/newlyBuilt-background.svg' },
    { text: '本地导入', backgroundColor: '#f79b22', operate: 'importFile', backgroundImage: 'public/image/import-background.svg' },
    { text: '云端导入', backgroundColor: '#3f74ff', operate: 'c', backgroundImage: 'public/image/cloudImport-background.svg' },
];

// 点击不同卡片执行不同操作
const handleCardClick = (operate: string): void => {
    switch (operate) {
        case 'createVocabulary': createVocabulary(); break;
        case 'importFile': importFile(); break;
        default: break;
    };
};

// 新建词汇
const createVocabulary = (): void => { router.push({ path: '/Word/CreateVocabulary', }); };

// 导入本地词汇
const importFile = (): void => {
    fileInput.value.value = null;
    fileInput.value.click();
    fileInput.value.addEventListener('change', handleFileSelect);
};

// 处理本地的json文件
const handleFileSelect = (event: Event): void => {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        const file: File = input.files[0];
        if (file.type !== 'application/json') { confirmBox.value.popUps('导入错误,不是json文件', false); return; };
        const reader: FileReader = new FileReader();
        reader.onload = async (e) => {
            try {
                jsonInfo.value = JSON.parse(e.target?.result as string).map(({ id, ...rest }) => ({ ...rest }));
                confirmBox.value.popUps('词汇表命名', true);
            } catch (error) { confirmBox.value.popUps('导入错误', false); }
        };
        reader.readAsText(file);
    };
};

// 确认按钮并插入数据
const confirm = async (data: { value: string, starus: boolean }) => {
    if (!data.value) return;
    const uniqueNames = await db.vocabularys.orderBy('name').uniqueKeys(async (keys) => keys);
    if (uniqueNames.includes(data.value)) { confirmBox.value.input(); }
    else {
        jsonInfo.value = jsonInfo.value.map(item => ({ ...item, name: data.value, newDate: formatTime(new Date(), 'YYYY-MM-DD HH:mm:ss') }));
        await db.vocabularys.bulkAdd(toRaw(jsonInfo.value));
        confirmBox.value.cancel();
        store.databaseStatus = !store.databaseStatus;
    };
};

// 取消按钮
const cancel = (): void => { jsonInfo.value = null; };
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

.directory {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    margin-bottom: 5.5rem;
}
</style>