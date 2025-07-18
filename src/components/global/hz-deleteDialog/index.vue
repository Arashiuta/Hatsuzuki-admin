<template>
    <el-dialog v-model="deleteVisible" title="删除" width="450">
        <div style="color:#000;margin-bottom: 20px;">
            <span v-if="content" v-html="content"></span>
            <slot></slot>
        </div>

        <div class="dialogFooter">
            <hz-button :size="'large'" :type="'normal'" @click="deleteVisible = false">取消</hz-button>
            <hz-button :size="'large'" :disabled="disabled" @click="confimDelete">确认</hz-button>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue';

interface Props {
    disabled?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
    disabled: false
});
const { disabled } = toRefs(props);
const emit = defineEmits(['confirm']);

const deleteVisible = ref(false);
const confimDelete = () => {
    emit('confirm');
};

const content = ref('');
const openDialog = (contentInfo: string) => {
    content.value = contentInfo;
    deleteVisible.value = true;
};
const closeDialog = () => {
    deleteVisible.value = false;
};

defineExpose({
    openDialog,
    closeDialog
});
</script>

<style scoped lang="scss">
.dialogFooter {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
</style>