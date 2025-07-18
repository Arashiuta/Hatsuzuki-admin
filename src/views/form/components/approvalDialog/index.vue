<template>
    <hz-dialog ref="dialogRef" title="审批" width="1000" style="margin-top: 80px;" @close="closeDialog"
        @confirm="closeDialog">
        <div class="previewBox">
            <HzPreviewPdf ref="previewPdfRef" :path="previewPath" :projectName="rowInfo.project_name"
                wordPath="/temp/testpdf.pdf"></HzPreviewPdf>
        </div>
        <el-radio-group v-model="formData.status" style="display: flex;flex-direction: column;align-items: flex-start;">
            <el-radio :value="8" size="large">通过</el-radio>
            <el-radio :value="9" size="large">不通过</el-radio>
        </el-radio-group>
        <el-form-item label="不通过原因">
            <el-input v-model="formData.remark" :autosize="{ minRows: 2, maxRows: 20 }" type="textarea"
                placeholder="请输入" :disabled="formData.status !== 9" />
        </el-form-item>
    </hz-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import HzPreviewPdf from '@/components/range/hz-previewPdf/index.vue';

const dialogRef = ref();
const rowInfo = ref<any>({});
const previewPath = ref('')
const openDialog = (row: any) => {
    rowInfo.value = row;
    previewPath.value = rowInfo.value.generated_pdf ? rowInfo.value.generated_pdf : ''
    dialogRef.value.openDialog();
};
const closeDialog = () => {
    dialogRef.value.closeDialog();
};

const formData = ref({
    status: 8,
    remark: '',
});


defineExpose({
    openDialog,
    closeDialog
});

</script>

<style scoped lang="scss">
.previewBox {
    width: 100%;
    height: 450px;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #e2e2e2;
    margin-bottom: 15px;
}

.dialogFooter {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}
</style>