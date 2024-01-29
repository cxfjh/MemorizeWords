<template>
    <div id="user">
        <article class="article">
            <div></div><span>熊猫背单词</span>
        </article>
        <nav class="nav">
            <p>我的工具</p>
            <ul class="ul">
                <li v-for="(item, index) in info" :key="index" @click="item.clickEvents">
                    <span>{{ item.text }}</span><svg-icon class="svg" :name="item.icon"></svg-icon>
                </li>
            </ul>
        </nav>
        <pop-ups ref="confirmBox" @confirm="confirm"></pop-ups>
    </div>
</template>
  
<script setup lang="ts">
import { Ref, ref } from 'vue';
import statusInformation from '../store/index';
import { allFilesExported, fileExport, defaultVocabulary } from '../module/index';

const store = statusInformation();
const confirmBox: Ref<any> = ref(null);

interface InfoItem {
    text: string;
    icon: string;
    clickEvents?: () => void;
};

// 清理
const clean = (state: boolean): void => {
    if (!state) { localStorage.removeItem('statusInformation'); confirmBox.value.popUps('清理缓存成功', false); }
    else { confirmBox.value.popUps('输入“确认”即可删除', true); };
    store.choose = true;
};

// 关于
const concerning = (state?: number): void => {
    if (state === 0) { window.open('https://mp-b6efc7e7-2a79-49c6-9cfa-5f337f7b3512.cdn.bspapp.com/熊猫背单词/熊猫背单词1.0.0.apk'); }
    else if (state === 1) { window.open('https://github.com/cxfjh/MemorizeWords'); }
    else { location.href = 'mqqwpa://im/chat?chat_type=wpa&uin=2449579731&version=1&src_type=web&web_src=http:://wpa.b.qq.com'; }
};

const info: InfoItem[] = [
    { text: '分类导出', icon: 'CategoryExport', clickEvents: () => fileExport('0', true) },
    { text: '全部导出', icon: 'ExportAll', clickEvents: allFilesExported },
    { text: '清理缓存', icon: 'CleanCache', clickEvents: () => clean(false) },
    { text: '清空数据', icon: 'CleanData', clickEvents: () => clean(true) },

    // { text: '关于我们', icon: 'OfflineVersion', clickEvents: concerning },
    // { text: '开源项目', icon: 'OpenProjects', clickEvents: concerning },

    { text: '离线版包', icon: 'OfflineVersion', clickEvents: () => concerning(0) },
    { text: '开源项目', icon: 'OpenProjects', clickEvents: () => concerning(1) },

    { text: '联系我们', icon: 'ContactUs', clickEvents: concerning },
    { text: '版本1.0.0', icon: 'VersionNumber' },
];

const confirm = async (data: { value: string, starus: boolean }) => {
    if (!data.starus) return;
    if (data.value !== '确认') return;
    localStorage.clear();
    await defaultVocabulary();
    confirmBox.value.cancel();
    store.databaseStatus = true;
};
</script>
  
<style scoped>
#user {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
}

.article {
    display: flex;
    align-items: center;
}

.article>div {
    width: 8rem;
    height: 8rem;
    background-image: url(/public/image/192x192.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    border-radius: 100%;
    border: 1px solid #cfcfe2;
    margin: 6rem 1rem 5rem 2rem;
}

.article>span {
    font-size: 1.8rem;
}

.nav {
    display: flex;
    flex-direction: column;
    align-items: baseline;
    background-color: white;
    background-color: white;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
    border: 1px solid white;
    border-radius: 1rem;
    padding: 1rem;
    margin: 2rem;
}

.nav>p {
    font-size: 1.6rem;
    padding: 1rem;
}

.ul {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.ul>li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.4rem;
    border-radius: 0.5rem;
    flex-direction: column-reverse;
    width: 25%;
    padding: 1rem 0 0.5rem;
}

.ul>li>span {
    padding: 1rem 0;
}

.svg {
    width: 2.5rem !important;
    height: 2.5rem !important;
    padding-top: 1rem;
    color: black;
}
</style>