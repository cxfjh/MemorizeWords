<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
    name: { type: String, required: true, },
    color: { type: String, default: 'black', },
    width: { type: String, default: '50px', },
    height: { type: String, default: 'auto', },
})
const iconName = computed(() => `#icon-${props.name}`)
const svgClass = computed(() => {
    if (props.name) return `svg-icon icon-${props.name}`
    return 'svg-icon'
});
</script>

<template>
    <svg :class="svgClass" v-bind="$attrs" :style="{ color: color, width: width, height: height }">
        <use :xlink:href="iconName"></use>
    </svg>
</template>
