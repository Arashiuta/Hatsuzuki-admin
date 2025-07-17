<template>
    <hz-dialog ref="dialogRef" title="提交审批" width="600" @close="closeDialog" @confirm="closeDialog">
        <el-radio-group v-model="formDataObj.redio" class="redioBox">
            <el-radio value="1" size="large">{{ rowInfo.project_name }}</el-radio>
            <el-radio value="2" size="large">重新上传报告文档</el-radio>
        </el-radio-group>
        <el-form-item prop="productName" label-width="100px" label-position="top">
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
                        <span>只能上传doc/docx文件，且不超过5MB</span>
                    </div>
                </template>
            </el-upload>
        </el-form-item>
        <el-form-item label="审批人" prop="person" label-position="right">
            <el-select v-model="formDataObj.approvalUsers" placeholder="请选择" multiple>
                <el-option v-for="(item, index) in approvalUserList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
        </el-form-item>
    </hz-dialog>
</template>

<script setup lang="ts">
import { genFileId } from 'element-plus';
import { ref } from 'vue'
import { Upload } from '@element-plus/icons-vue'


const dialogRef = ref()
const rowInfo = ref();
const openDialog = (info: any) => {
    rowInfo.value = info
    dialogRef.value.openDialog()
}
const closeDialog = () => {
    dialogRef.value.closeDialog()
}

const approvalUserList = ref<Array<any>>([
    {
        id: 1,
        name: '审批人1',
    },
    {
        id: 2,
        name: '审批人2',
    },
    {
        id: 3,
        name: '审批人3',
    },
])

interface FormDataObj {
    approvalUsers: Array<string>;
    fileDoc: any;
    redio: string;
}
const formDataObj = ref<FormDataObj>({
    approvalUsers: [],
    fileDoc: null,
    redio: '1',
})

const uploadRef = ref()
const uploadHeaders = ref({
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`
})
const handleChange = (uploadFile: any) => {
    formDataObj.value.fileDoc = uploadFile;
}
const handleRemove = () => {
    formDataObj.value.fileDoc = null;
}
const handleExceed = (files: any) => {
    uploadRef.value!.clearFiles()
    const file = files[0]
    file.uid = genFileId()
    uploadRef.value!.handleStart(file)
}


defineExpose({
    openDialog,
    closeDialog,
})

</script>

<style scoped lang="scss">
.redioBox {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    :deep(.el-radio__input.is-checked .el-radio__inner) {
        border-color: #000000;
        background-color: #000000;
    }

    :deep(.el-radio__label) {
        color: #000000;
    }
}

.dialogFooter {
    display: flex;
    gap: 10px;
    justify-content: flex-end;


}

.previewBox {
    width: 100%;
    height: 280px;
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