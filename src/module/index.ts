import { defineAsyncComponent } from "vue";
import db from "../store/db";
import { saveAs } from 'file-saver';

// 导出格式化时间函数
export const formatTime = (date: Date, format: string): string => {
    const year: number = date.getFullYear();
    const month: string = String(date.getMonth() + 1).padStart(2, '0');
    const day: string = String(date.getDate()).padStart(2, '0');
    const hour: string = String(date.getHours()).padStart(2, '0');
    const minute: string = String(date.getMinutes()).padStart(2, '0');
    const second: string = String(date.getSeconds()).padStart(2, '0');
    const replacements: Record<string, string> = { 'YYYY': String(year), 'MM': month, 'DD': day, 'HH': hour, 'mm': minute, 'ss': second };
    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => replacements[match]);
};

// 导出数据库数据文件
export const fileExport = async (keywords: string, all?: boolean) => {
    const isEmpty = await db.vocabularys.count() === 0;
    if (isEmpty) return;
    try {
        if (!all) {
            const verbData = await db.vocabularys.where('name').equals(keywords).toArray();
            const jsonData = JSON.stringify(verbData, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            saveAs(blob, `词汇表${formatTime(new Date(), 'YYYY-MM-DD HH:mm:ss')}.json`);
            return;
        };
        const uniqueNames = await db.vocabularys.orderBy('name').uniqueKeys(async (keys) => keys);
        uniqueNames.forEach(async (item) => {
            const verbData = await db.vocabularys.where('name').equals(item).toArray();
            const jsonData = JSON.stringify(verbData, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            saveAs(blob, `词汇表-${item}-${formatTime(new Date(), 'YYYY-MM-DD HH:mm:ss')}.json`);
        });
    } catch (error) { console.error(error); };
};

// 导出全部数据
export const allFilesExported = async () => {
    const isEmpty = await db.vocabularys.count() === 0;
    if (isEmpty) return;
    try {
        const data = await db.vocabularys.toArray();
        const jsonData = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        saveAs(blob, `全部单词词汇表${new Date().toLocaleString()}.json`);
    } catch (error) { console.error(error); };
};

// 监听滚动条
export const handleScroll = (element: HTMLElement, fun: () => void) => {
    const container = element;
    if (!container) return;
    const documentHeight: number = container.scrollHeight;
    const windowHeight: number = container.clientHeight;
    const scrollTop: number = container.scrollTop;
    if (scrollTop + 200 + windowHeight >= documentHeight) { fun(); };
};

// 读音
export const speakWork = (text: string): void => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = /[\u4e00-\u9fa5]/.test(text) ? 'zh-CN' : 'en-US';
    utterance.pitch = 0.8; // 降低音调
    utterance.rate = 0.8; // 减缓语速
    utterance.volume = 2; // 增加音量
    window.speechSynthesis.speak(utterance);
};

// 默认词汇表
import highSchoolData from '../module/highSchool';
import juniorHighSchoolData from '../module/juniorHighSchool';
import elementarySchoolData from '../module/elementarySchool';

export const defaultVocabulary = async () => {
    await db.close();
    await db.delete();
    await db.open();
    const dataArr = [highSchoolData, juniorHighSchoolData, elementarySchoolData];
    for (const data of dataArr) { await db.vocabularys.bulkAdd(data); };
    localStorage.setItem('version', '1.1.1');
};
