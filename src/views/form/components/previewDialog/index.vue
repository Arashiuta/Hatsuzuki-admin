<template>
    <hz-dialog ref="dialogRef" title="报告预览" width="1000" style="margin-top: 80px;" @close="closeDialog"
        @confirm="closeDialog">
        <div class="previewBox">
            <hz-previewPdf ref="previewPdfRef" path=""></hz-previewPdf>
        </div>
        <el-form-item label="重新上传报告文档" prop="productName" label-width="100px" label-position="top">
            <el-upload ref="uploadRef" class="upload-demo" name="documents" accept=".doc,.docx" action="#" :limit="1"
                :on-exceed="handleExceed" :auto-upload="false" :headers="uploadHeaders" :on-change="handleChange"
                :on-remove="handleRemove">
                <template #trigger>
                    <div class="uploadBox">
                        <div class="uploadBtn">
                            <el-icon size="18">
                                <Upload />
                            </el-icon>
                            <span>点击上传报告</span>
                        </div>
                        <div class="el-upload__tip">只能上传doc/docx文件，且不超过5MB</div>
                    </div>
                </template>
            </el-upload>
        </el-form-item>
        <el-form-item label="审批人" prop="person" label-position="right">
            <el-select v-model="addNewReportForm.person" placeholder="请选择" multiple>
                <el-option v-for="(item, index) in approvalUserList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
        </el-form-item>
    </hz-dialog>
</template>

<script setup lang="ts">
import { genFileId } from 'element-plus';
import { ref } from 'vue'
import { Upload } from '@element-plus/icons-vue'


const emit = defineEmits(['closeDialog'])

const dialogRef = ref()
const rowInfo = ref();
const openDialog = (info: any) => {
    rowInfo.value = info
    dialogRef.value.openDialog()
}

const approvalUserList = ref<Array<any>>([
    {
        id: 1,
        name: '审批人1'
    },
    {
        id: 2,
        name: '审批人2'
    },
    {
        id: 3,
        name: '审批人3'
    }
])

const addNewReportForm = ref({
    person: '',
})

const previewPdfRef = ref()
const closeDialog = () => {
    addNewReportForm.value = {
        person: '',
    }
    dialogRef.value.closeDialog()
    previewPdfRef.value?.destroyPdf()
}

const uploadRef = ref()
const fileDoc = ref<any>(null)
const uploadHeaders = ref({
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`
})
const handleChange = (uploadFile: any) => {
    fileDoc.value = uploadFile;
}
const handleRemove = () => {
    fileDoc.value = null;
}
const handleExceed = (files: any) => {
    uploadRef.value!.clearFiles()
    const file = files[0]
    file.uid = genFileId()
    uploadRef.value!.handleStart(file)
}


defineExpose({
    openDialog,
})
</script>

<style scoped lang="scss">
.dialogFooter {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

.previewBox {
    width: 100%;
    height: 450px;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #e2e2e2;
    margin-bottom: 15px;
}

.uploadBox {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    gap: 5px;

    .uploadBtn {
        border: 1px solid rgba(226, 232, 240, 1);
        border-radius: 6px;
        padding: 0 10px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 5px;
    }
}
</style>