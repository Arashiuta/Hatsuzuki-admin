<template>
    <hz-dialog ref="dialogRef" title="添加任务" width="600" @close="closeDialog" @confirm="closeDialog">
        <el-form ref="formRef" :model="addNewForm" require-asterisk-position="right" label-width="100px">
            <el-form-item label="项目名称" prop="project_name" label-position="right">
                <el-input v-model="addNewForm.project_name" maxlength="99" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="项目检测编号" prop="project_code" label-position="right">
                <el-input v-model="addNewForm.project_code" maxlength="99" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="类别" prop="detection_category" label-position="right">
                <el-select v-model="addNewForm.type" placeholder="请选择">
                    <el-option label="类型1" value="1" />
                    <el-option label="类型2" value="2" />
                    <el-option label="类型3" value="3" />
                </el-select>
            </el-form-item>
        </el-form>
    </hz-dialog>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus';


const emit = defineEmits(['addConfirm'])

const dialogRef = ref()
const openDialog = (info: any) => {
    resetFormDataObj();
    if (info) {
        addNewForm.value = { ...info };
    }
    dialogRef.value.openDialog();
}
const closeDialog = () => {
    resetFormDataObj()
    dialogRef.value.closeDialog();
}

const addNewForm = ref({
    project_name: '',
    project_code: '',
    type: '',
})

const formRef = ref()
const resetFormDataObj = () => {
    addNewForm.value = {
        project_name: '',
        project_code: '',
        type: '',
    }
}

defineExpose({ openDialog })
</script>

<style scoped lang="scss">
.dialogFooter {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}
</style>