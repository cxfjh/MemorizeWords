<template>
    <div id="TopNavigationbar">
        <ul>
            <li @click="router.go(-1)">
                <svg-icon :name="props.navStyle1.icon" :width="props.navStyle1.width"
                    :height="props.navStyle1.height"></svg-icon>
            </li>
            <li><span>{{ props.navStyle1.title }}</span></li>
            <li><svg-icon :name="props.navStyle2.icon" :width="props.navStyle2.width"
                    :height="props.navStyle2.height"></svg-icon></li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
    navStyle1: {
        type: Object as PropType<{ [key: string]: string }>,
        default: () => ({ icon: 'Return', width: '2.5rem', height: '2.5rem', title: '创建词汇' })
    },
    navStyle2: {
        type: Object as PropType<{ [key: string]: string }>,
        default: () => ({ icon: 'More', width: '2.5rem', height: '2.5rem' })
    }
});
</script>

<style scoped>
#TopNavigationbar>ul {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 3rem;
    font-size: 2rem;
    list-style: none;
    padding: 1.2rem 2rem;
}

#TopNavigationbar>ul>li {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>