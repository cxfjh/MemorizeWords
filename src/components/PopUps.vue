<template>
    <div id="PopUps">
        <dialog ref="dialog">
            <span>{{ title }}</span>
            <input type="text" v-model.lazy="inputValue" :placeholder="prompt">
            <div><a @click="cancel">取消</a><a @click="confirm">确认</a></div>
        </dialog>
    </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';

const inputValue: Ref<string> = ref(null);
const dialog: Ref<any> = ref(null);
const confirmStatus: Ref<boolean> = ref(false);
const title: Ref<string> = ref('熊猫提示');
const prompt: Ref<string> = ref(null);
const emit = defineEmits<{ confirm: [object], cancel: [string] }>();

// 显示弹窗
const popUps = (value: string, starus: boolean): void => {
    confirmStatus.value = starus;
    dialog.value.showModal();
    dialog.value.classList.add('dialog');
    prompt.value = value;
};

// 取消
const cancel = (): void => {
    emit('cancel', 'cancel');
    dialog.value.close();
    dialog.value.classList.remove('dialog');
    inputValue.value = '';
};

// 确定
const confirm = (): void => {
    if (!confirmStatus.value) return cancel();
    const info: { value: string, starus: boolean } = { value: inputValue.value, starus: confirmStatus.value };
    emit('confirm', info);
};

const input = (): void => {
    inputValue.value = '';
    prompt.value = '名词已重复，请重新命名';
};

defineExpose({ popUps, cancel, input });
</script>

<style scoped>
#PopUps {
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: #ffffff;
    top: 0;
    left: 0;
    z-index: -1;
}

.dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 23rem;
    height: 15rem;
    font-size: 1.8rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border-radius: 1rem;
    border: 1px solid #dfdfe0;
    z-index: -2;
}

#PopUps>dialog>div {
    width: 100%;
    display: flex;
    justify-content: space-around;
}

#PopUps>dialog>input {
    border: 1px solid #e5e5e5;
    height: 3rem;
    width: 18rem;
    font-size: 1.5rem;
    padding-left: 1rem;
    border-radius: 0.5rem;
}

#PopUps>dialog>input:focus {
    outline: none;
}

#PopUps>dialog>div>a {
    width: 7rem;
    height: 3.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #67c23a;
    color: white;
    border: none;
    outline: none;
    cursor: pointer;
    border-radius: 0.5rem;
}

#PopUps>dialog>div>a:nth-child(2) {
    background-color: #409eff;
}
</style>