<template>
    <div class="tableFramework-container">
        <slot name="operation"></slot>
        <div v-if="!$slots.operation" class="commonBox optionBox">
            <div class="screenBox">
                <!-- 筛选选项 -->
                <slot name="screen"></slot>
            </div>
            <!-- 提交按钮组 -->
            <div class="submitBox">
                <div class="resetBtn" @click="resetFunc">
                    <el-icon>
                        <RefreshRight />
                    </el-icon>
                </div>
                <hz-button @click="searchFunc">
                    <el-icon>
                        <Search />
                    </el-icon>
                    <span>搜索</span>
                </hz-button>
            </div>
        </div>
        <!-- 主体 -->
        <div v-if="$slots.default" class="commonBox defaultBox">
            <slot></slot>
            <hz-pagination v-model:currentPage="propInfo.currentPage" v-model:pageSize="propInfo.pageSize"
                :total="propInfo.total" @change="changePageFunc" />
        </div>
        <!-- footer -->
        <div v-if="$slots.footer" class="commonBox">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { RefreshRight } from '@element-plus/icons-vue';
import { Search } from '@element-plus/icons-vue';
import { ref, watch } from 'vue';

const emit = defineEmits(['search', 'reset', 'update:currentPage', 'update:pageSize', 'changePage']);
interface Props {
    currentPage: number;
    pageSize: number;
    total: number;
    pageCapacity?: Array<number>;
}
const props = withDefaults(defineProps<Props>(), {
    pageCapacity: () => [20, 30, 50]
});
const propInfo = ref({
    currentPage: props.currentPage,
    pageSize: props.pageSize,
    total: props.total,
    pageCapacity: props.pageCapacity
})

watch(
    () => [props.currentPage, props.pageSize, props.total],
    ([currentPage, pageSize, total]) => {
        propInfo.value.currentPage = currentPage;
        propInfo.value.pageSize = pageSize;
        propInfo.value.total = total;
    }
);
const changePageFunc = (currentPage: number, pageSize: number) => {
    emit('update:currentPage', currentPage);
    emit('update:pageSize', pageSize);
    emit('changePage', currentPage, pageSize);
}

const resetFunc = () => {
    emit('reset');
}
const searchFunc = () => {
    emit('search');
}
</script>

<style scoped lang="scss">
.tableFramework-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-height: calc(100vh - 110px);
    overflow: hidden;

    .commonBox {
        background-color: var(--hz-tableFramework-commonBox-background-color);
        padding: 15px;
        border-radius: 6px;
    }

    .optionBox {
        display: grid;
        grid-template-columns: 1fr 250px;
        gap: 20px;


        .screenBox {
            display: flex;
            align-items: center;
            gap: 30px;
            flex-wrap: wrap;

            :deep(.el-form-item) {
                margin: 0;
            }
        }

        .submitBox {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 15px;


            .resetBtn {
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid var(--border-color);
                border-radius: 5px;
                padding: 5px 12px;
                cursor: pointer;
                transition: all 0.2s ease;

                &:hover {
                    filter: brightness(0.8);
                }
            }
        }
    }

    .defaultBox {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

}
</style>