<template>
    <div id="FeatureCards">
        <div v-for="(itemStyle, index) in cardsStyleDefaults" :key="index">
            <div class="operate" ref="operateClass">
                <span>词表名词：{{ props.info[0] }}</span>
                <span>词汇数量：{{ props.info[1] }}</span>
                <span>建立日期：{{ props.info[2] }}</span>
                <div>
                    <button @click="operationalData(index, 'deletes')">删除</button>
                    <button @click="operationalData(index, 'exportFile')">导出</button>
                    <button @click="shutDown(index)">关闭</button>
                </div>
            </div>
            <div class="enter" @click="handleCardClick(index)"
                @touchstart="itemStyle.touchstart == '1' ? operate(index) : ''"
                @touchend="itemStyle.touchstart == '1' ? endPress() : ''" :style="{
                    backgroundImage: `url('${itemStyle.backgroundImage}')`,
                    backgroundColor: itemStyle.backgroundColor
                }">
                <span>{{ itemStyle.text }}</span>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { PropType, Ref, ref, watch } from 'vue';

const operateClass: Ref<Array<HTMLElement | null>> = ref([]);
const pressTimer: Ref<any> = ref(null); // 长按时间
const cardsStyleDefaults: Ref<{ [key: string]: string }[]> = ref([]); // 收集父组件传过来的样式
const emit = defineEmits<{ operate: [string], info: [{ [key: string]: string }] }>(); // 发送点击卡片事件交给父组件操作

// 定义 CardsStyle 接口和从父组件接收 props
interface CardsStyle { text?: string, backgroundColor?: string, operate?: string, backgroundImage?: string, touchstart?: '' };
const props = defineProps({
    cardsStyle: { type: Object as PropType<CardsStyle[]> }, // 样式
    info: { type: Object as PropType<string[]>, default: () => (['', '', '']) } // 卡片信息
});

// 定义默认的卡片样式
const defaultCardsStyle: CardsStyle = { text: "词汇", backgroundColor: "#02d5c9", backgroundImage: "public/image/vocabulary-background.svg" };
cardsStyleDefaults.value = props.cardsStyle.map(style => ({ ...defaultCardsStyle, ...style }));

// 监听是否有新数据导入数据库并重新渲染
watch(() => props.cardsStyle, () => {
    cardsStyleDefaults.value = props.cardsStyle.map(style => ({ ...defaultCardsStyle, ...style }));
    operateClass.value.forEach((div) => { div.style.display = 'none'; });
});

// 点击某个卡片发生数据给父组件
const handleCardClick = (index: number): void => { emit('operate', cardsStyleDefaults.value[index].operate); };

// 长按卡片操作
const operate = (index: number): void => {
    operateClass.value.forEach((div) => { div.style.display = 'none'; });
    pressTimer.value = window.setTimeout(() => { operationalData(index, 'name'); }, 500);
    pressTimer.value = window.setTimeout(() => { operateClass.value[index].style.display = 'flex'; }, 700);
};

// 取消长按操作
const endPress = (): void => { if (pressTimer.value !== null) { clearTimeout(pressTimer.value); pressTimer.value = null; }; };

// 改变信息卡片
const shutDown = (index: number): void => {
    const div: HTMLElement = document.querySelectorAll('.operate')[index] as HTMLElement;
    div.style.display = 'none';
};

// 操作数据
const operationalData = (index: number, operates: string): void => { emit('info', { operate: operates, name: cardsStyleDefaults.value[index].text }); }
</script>
  
<style scoped>
#FeatureCards {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}

.enter {
    width: 30rem;
    height: 15rem;
    background-color: #02d5c9;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 2.5rem;
    border-radius: 1rem;
    font-weight: 800;
    background-image: url('../assets/image/newlyBuilt-background.svg');
    background-size: auto 100%;
    background-repeat: no-repeat;
    margin-bottom: 3rem;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
}

.operate {
    width: 30rem;
    height: 15rem;
    background-color: black;
    box-sizing: border-box;
    opacity: 0.7;
    padding: 1rem 2rem;
    display: none;
    align-items: center;
    justify-content: center;
    color: white;
    border-radius: 1rem;
    flex-direction: column;
    justify-content: space-around;
    font-size: 1.5rem;
    align-items: baseline;
    margin-bottom: 3rem;
    position: absolute;
}

.operate>div {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.operate>div>button {
    height: 3rem;
    width: 8rem;
    font-size: 1.5rem;
    text-align: center;
    background-color: #409eff;
    color: white;
    border: none;
    outline: none;
    cursor: pointer;
    border-radius: 0.5rem;
}

.operate>div>button:nth-child(1) {
    background-color: #f56c6c;
}
</style>