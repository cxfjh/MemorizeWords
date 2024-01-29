<template>
    <div>
        <ul id="NavigationBar">
            <li v-for="(navItem, index) in props.navArr" :key="index">
                <router-link :to="navItem.path" exact-active-class="active">
                    <svg-icon :name="navItem.icon" :width="props.navStyle.width" :height="props.navStyle.height" :color="props.navStyle.defaultColor"></svg-icon>
                    <span :style="{ color: props.navStyle.defaultColor, fontSize: props.navStyle.fontSize }">{{ navItem.text }}</span>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

const props = defineProps({
    navArr: {
        type: Array as PropType<{ [key: string]: string }[]>,
        default: () => [
            { path: 'Word', icon: 'Word', text: '词汇' },
            { path: 'Training', icon: 'Training', text: '训练' },
            { path: 'User', icon: 'User', text: '我的' },
        ]
    },
    navStyle: {
        type: Object as PropType<{ [key: string]: string }>,
        default: () => ({ width: '3rem', height: 'auto', defaultColor: 'black', fontSize: '1.3rem', activationColor: '#4f73fb' })
    }
});

document.documentElement.style.setProperty('--color', props.navStyle.activationColor); // 图标和字体激活颜色
</script>

<style scoped>
#NavigationBar {
    width: 100%;
    height: 100%;
    position: absolute;
    list-style: none;
    padding: 0;
    display: flex;
    justify-content: space-between;
}

#NavigationBar>li {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex: 1;
    font-size: 15px;
}

#NavigationBar>li>a {
    height: 100%;
    width: 100%;
    outline: none;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

:root {
    --color: #4f73fb;
}

#NavigationBar>li>a:active {
    -webkit-tap-highlight-color: transparent !important;
    color: var(--color) !important;
}

#NavigationBar>li>a:hover {
    -webkit-tap-highlight-color: transparent !important;
}

#NavigationBar>li>.active>svg,
#NavigationBar>li>.active>span {
    color: var(--color) !important;
}

#NavigationBar>li>a>span {
    margin: 3px;
}

#NavigationBar>li>a>svg {
    margin-top: 3px;
}
</style>

