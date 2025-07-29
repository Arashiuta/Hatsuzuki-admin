<template>
    <el-dialog v-model="dialogVisible">
        <slot></slot>
        <div class="dialogFooter">
            <hz-button :size="'large'" :type="'normal'" @click="closeFunc">{{ closeText }}</hz-button>
            <hz-button :size="'large'" :disabled="disabled" @click="confirmFunc">{{ confirmText }}</hz-button>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue';

interface Props {
    closeText?: string;
    confirmText?: string;
    showFooter?: boolean;
    disabled?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    closeText: '取消',
    confirmText: '确认',
    showFooter: true,
    disabled: false
})
const { closeText, confirmText, disabled } = toRefs(props);
const emit = defineEmits(['confirm', 'close'])

const dialogVisible = ref(false)
const openDialog = () => {
    dialogVisible.value = true;
}
const closeDialog = () => {
    dialogVisible.value = false;
}


const closeFunc = () => {
    closeDialog()
    emit('close')
}
const confirmFunc = () => {
    emit('confirm')
}

defineExpose({
    openDialog,
    closeDialog,
})
</script>

<style scoped lang="scss">
.dialogFooter {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 20px;
}
</style>