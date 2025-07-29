<template>
    <div class="taskList-container">
        <hz-tableFramework v-model:currentPage="screen.current" v-model:pageSize="screen.size" :total="total"
            @changePage="changePageFunc" @reset="resetButtonFunc" @search="searchFunc">
            <template #screen>
                <el-form-item label="项目名称">
                    <el-input v-model="screen.keyword" maxlength="99" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="任务状态">
                    <el-select v-model="screen.status" placeholder="请选择" style="width: 240px">
                        <el-option label="新建" value="1" />
                        <el-option label="已上传" value="2" />
                        <el-option label="解析中" value="3" />
                        <el-option label="解析成功" value="4" />
                        <el-option label="解析失败" value="5" />
                        <el-option label="提交审批" value="7" />
                        <el-option label="审核通过" value="8" />
                        <el-option label="审核不通过" value="9" />
                    </el-select>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker v-model="screenTimeRange" type="datetimerange" range-separator="-"
                        start-placeholder="开始时间" end-placeholder="结束时间" value-format="x" @change="changeTimeRange" />
                </el-form-item>
            </template>
            <template #default>
                <div class="tableBtnBox">
                    <hz-button @click="addNewReport">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        <span>新建</span>
                    </hz-button>
                </div>
                <el-table :data="tableData" style="width: 100%;height: calc(100vh - 300px);">
                    <el-table-column prop="project_name" label="项目名称" :show-overflow-tooltip="true" />
                    <el-table-column prop="project_code" label="编号" />
                    <el-table-column prop="type" label="类别" />
                    <el-table-column prop="status" label="任务状态">
                        <template #default="{ row }">
                            <div v-if="row.status == '1'" class="statusCard"
                                style="background-color: #e0f2f7; color: #2196f3;">
                                <span>新建文档</span>
                            </div>
                            <div v-if="row.status == '2'" class="statusCard"
                                style="background-color: #e3f2fd; color: #42a5f5;">
                                <span>已上传</span>
                            </div>
                            <div v-if="row.status == '3'" class="statusCard"
                                style="background-color: #ffecb3; color: #ffa000;">
                                <span>解析中</span>
                            </div>
                            <div v-if="row.status == '4'" class="statusCard"
                                style="background-color: #e8f5e9; color: #4caf50;">
                                <span>解析成功</span>
                            </div>
                            <div v-if="row.status == '5'" class="statusCard"
                                style="background-color: #ffebee; color: #ef5350;">
                                <span>解析失败</span>
                            </div>
                            <div v-if="row.status == '6'" class="statusCard"
                                style="background-color: #fce4ec; color: #e91e63;">
                                <span>待审核</span>
                            </div>
                            <div v-if="row.status == '7'" class="statusCard"
                                style="background-color: #e8f5e9; color: #4caf50;">
                                <span>审核通过</span>
                            </div>
                            <div v-if="row.status == '8'" class="statusCard"
                                style="background-color: #ffebee; color: #f44336;">
                                <span>审核不通过</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true">
                        <template #default="{ row }">
                            <span>{{ row.remark }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="creator_name" label="创建人" />
                    <el-table-column prop="create_time" label="创建时间">
                        <template #default="{ row }">
                            <span>{{ formatTimestamp(row.create_time) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="option" label="操作" width="200">
                        <template #default="{ row }">
                            <div style="display: flex;flex-wrap: wrap;justify-content: flex-start;gap: 5px;">
                                <el-button v-if="row.status == '1'" type="primary" link @click="editFunc(row)"
                                    style="margin: 0;">
                                    编辑
                                </el-button>
                                <el-button type="primary" link @click="deleteFunc(row.project_name)" style="margin: 0;">
                                    删除
                                </el-button>
                                <el-button v-if="row.status == '7'" type="primary" link @click="approvalFunc(row)"
                                    style="margin: 0;">
                                    审批
                                </el-button>
                                <el-button v-if="row.status == '4'" type="primary" link @click="previewFunc(row)"
                                    style="margin: 0;">
                                    报告预览
                                </el-button>
                                <el-button v-if="row.status == '8'" type="primary" link @click="submitApproval(row)"
                                    style="margin: 0;">
                                    提交审批
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </hz-tableFramework>

        <AddDialog ref="addDialogRef" :dialogVisible="dialogVisible" :data="reportTemplateList"
            @addSuccess="addSuccessFunc">
        </AddDialog>

        <!-- 删除事件 -->
        <hz-deleteDialog ref="deleteDialogRef" @confirm="confimDelete"></hz-deleteDialog>

        <!-- 报告预览 -->
        <PreviewDialog ref="previewRef"></PreviewDialog>

        <!-- 提交审批 -->
        <SubmitDialog ref="submitDialogRef"></SubmitDialog>

        <!-- 审批 -->
        <ApprovalDialog ref="approvalRef" @approvalSuccess="approvalSuccessFunc"></ApprovalDialog>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import AddDialog from "@/views/form/components/addDialog/index.vue"
import PreviewDialog from "@/views/form/components/previewDialog/index.vue"
import ApprovalDialog from "@/views/form/components/approvalDialog/index.vue"
import SubmitDialog from "@/views/form/components/submitDialog/index.vue"
import { formatTimestamp } from "@/utils/formatTime.ts";
import { ElMessage } from 'element-plus';


const screenTimeRange = ref([])
const screen = ref({
    current: 1,
    size: 20,
    keyword: '',
    status: '',
    start_time: '',
    end_time: ''
});
const changeTimeRange = (value: any) => {
    screen.value.start_time = value[0] ? value[0] : '';
    screen.value.end_time = value[1] ? value[1] : '';
}

const resetButtonFunc = () => {
    resetScreen()
}

const searchFunc = () => {
    screen.value.current = 1;
}

const resetScreen = () => {
    screenTimeRange.value = [];
    screen.value.current = 1;
    screen.value.keyword = '';
    screen.value.status = '';
    screen.value.start_time = '';
    screen.value.end_time = '';
}

const tableData = ref<any>([
    {
        id: 'proj_001',
        project_name: '前端项目管理系统V1.0',
        project_code: 'FE-PMS-001',
        type: '软件开发',
        status: '1', // 新建文档
        remark: '这是一个新的前端项目管理系统，正在规划中。',
        creator_name: '张三',
        create_time: 1721184000000, // 2024-07-17 08:00:00 UTC+8
    },
    {
        id: 'proj_002',
        project_name: '移动端App设计稿',
        project_code: 'MOBILE-APP-002',
        type: 'UI/UX设计',
        status: '2', // 已上传
        remark: 'App设计稿已上传至设计平台，等待审核。',
        creator_name: '李四',
        create_time: 1721187600000, // 2024-07-17 09:00:00 UTC+8
    },
    {
        id: 'proj_003',
        project_name: '后端API接口文档',
        project_code: 'BE-API-003',
        type: '后端开发',
        status: '3', // 解析中
        remark: '接口文档正在自动解析中，请稍候。',
        creator_name: '王五',
        create_time: 1721191200000, // 2024-07-17 10:00:00 UTC+8
    },
    {
        id: 'proj_004',
        project_name: '数据库结构设计',
        project_code: 'DB-STRUCT-004',
        type: '数据库',
        status: '4', // 解析成功
        remark: '数据库结构设计文档已成功解析，可进行报告预览。',
        creator_name: '赵六',
        create_time: 1721194800000, // 2024-07-17 11:00:00 UTC+8
    },
    {
        id: 'proj_005',
        project_name: '测试用例编写',
        project_code: 'TEST-CASE-005',
        type: '测试',
        status: '5', // 解析失败
        remark: '测试用例文档解析失败，请检查文件格式。',
        creator_name: '孙七',
        create_time: 1721198400000, // 2024-07-17 12:00:00 UTC+8
    },
    {
        id: 'proj_006',
        project_name: '项目需求分析报告',
        project_code: 'REQ-ANALY-006',
        type: '需求分析',
        status: '6', // 待审核
        remark: '需求分析报告已提交，等待项目经理审核。',
        creator_name: '周八',
        create_time: 1721202000000, // 2024-07-17 13:00:00 UTC+8
    },
    {
        id: 'proj_007',
        project_name: 'UI组件库开发',
        project_code: 'UI-COMP-007',
        type: '前端开发',
        status: '7', // 审核通过
        remark: 'UI组件库开发方案已审核通过，可以开始开发。',
        creator_name: '吴九',
        create_time: 1721205600000, // 2024-07-17 14:00:00 UTC+8
    },
    {
        id: 'proj_008',
        project_name: '用户手册初稿',
        project_code: 'USER-MAN-008',
        type: '文档编写',
        status: '8', // 审核不通过
        remark: '用户手册初稿审核不通过，需根据反馈修改后重新提交。',
        creator_name: '郑十',
        create_time: 1721209200000, // 2024-07-17 15:00:00 UTC+8
    },
])
const reportTemplateList = ref<Array<any>>([])
const total = ref(tableData.value.length);

const changePageFunc = (currentPage: number, pageSize: number) => {
    screen.value.current = currentPage;
    screen.value.size = pageSize;
    // 这里可以添加逻辑来处理分页数据
    console.log(`当前页: ${currentPage}, 每页条数: ${pageSize}`);
}


// 添加弹窗
const dialogVisible = ref(false);
const addDialogRef = ref()
const addNewReport = () => {
    addDialogRef.value.openDialog();
}
const addSuccessFunc = () => {
    ElMessage.success('添加成功');
}

//编辑
const editFunc = (row: any) => {
    addDialogRef.value.openDialog(row);
}

// 删除
const deleteInfo = ref('')
const deleteDialogRef = ref()
const deleteFunc = (info: string) => {
    deleteInfo.value = info
    deleteDialogRef.value.openDialog(`确认要删除 <strong>${info}</strong> 项目吗？`);
}
const confimDelete = async () => {
    deleteDialogRef.value.closeDialog();
}

//预览
const previewRef = ref()
const previewFunc = (row: any) => {
    previewRef.value.openDialog(row);
}

//提交审批
const submitDialogRef = ref()
const submitApproval = (row: any) => {
    submitDialogRef.value.openDialog(row);
}

const approvalRef = ref()
const approvalFunc = (row: any) => {
    approvalRef.value.openDialog(row);
}
const approvalSuccessFunc = () => {
    ElMessage.success('完成审批');
}

</script>

<style scoped lang="scss">
.taskList-container {
    .tableBtnBox {
        display: flex;
    }

    .statusCard {
        width: 80px;
        height: 30px;
        border-radius: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 13px;
        font-weight: 700;
    }


}
</style>