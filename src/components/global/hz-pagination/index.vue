<template>
    <div class="pagination">
        <span>{{ propInfo.total }}条数据,共{{ Math.ceil(propInfo.total / propInfo.pageSize) }}页</span>
        <el-pagination v-model:current-page="propInfo.currentPage" v-model:page-size="propInfo.pageSize"
            :page-sizes="propInfo.pageCapacity" layout="sizes, prev, pager, next" :total="propInfo.total"
            @change="changeFunc" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
    currentPage: number;
    pageSize: number;
    total: number;
    pageCapacity?: Array<number>;
}
const props = withDefaults(defineProps<Props>(), {
    pageCapacity: () => [20, 30, 50]
});

const emit = defineEmits(['update:currentPage', 'update:pageSize', 'change']);

const propInfo = ref({
    currentPage: props.currentPage,
    pageSize: props.pageSize,
    total: props.total,
    pageCapacity: props.pageCapacity
})

const changeFunc = (currentPage: number, pageSize: number) => {
    emit('update:currentPage', currentPage);
    emit('update:pageSize', pageSize);
    emit('change', currentPage, pageSize);
}
watch(
    () => [props.currentPage, props.pageSize, props.total],
    ([currentPage, pageSize, total]) => {
        propInfo.value.currentPage = currentPage;
        propInfo.value.pageSize = pageSize;
        propInfo.value.total = total;
    }
);


</script>

<style scoped lang="scss">
.pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;

    >span {
        font-size: 14px;
    }

    :deep(.btn-prev) {
        display: flex;
        align-items: center;
        gap: 3px;
        margin-bottom: -2px;

        ::after {
            content: '上一页';
            line-height: 15px;
            margin-left: 5px;
            font-style: normal;
        }

        svg {
            margin-bottom: -1px;
        }

    }

    :deep(.btn-next) {
        display: flex;
        align-items: center;
        gap: 3px;
        margin-bottom: -2px;

        ::before {
            content: '下一页';
            line-height: 15px;
            margin-left: 5px;
            font-style: normal;
        }

        svg {
            margin-bottom: -1px;
        }

    }

    :deep(.el-pager) {
        .is-active {
            color: var(--font-color);
            border: 1px solid var(--border-color);
            border-radius: 4px;
        }
    }
}
</style>