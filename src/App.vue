<template>
  <div class="progressBar-container">
    <div ref="barBackRef" class="barBack">
      <div ref="barFrontRef" class="barFront "></div>
    </div>
  </div>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { useStore } from '@/store/index.ts';
import { ref, watch } from 'vue';

const store = useStore();
const barBackRef = ref<HTMLElement | null>(null);
const barFrontRef = ref<HTMLElement | null>(null);
watch(() => store.pageProgress, (newVal: number) => {
  if (barFrontRef.value) {
    barFrontRef.value.style.width = `${newVal}%`;
  }
  if (newVal >= 100) {
    barBackRef.value?.classList.add('progressOut');
  } else {
    barBackRef.value?.classList.remove('progressOut');
  }
}, { immediate: true });
</script>

<style scoped>
.progressBar-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  z-index: 10;

  .barBack {
    width: 100%;
    height: 100%;
    position: relative;
    transition: opacity 0.5s ease-in-out;

    .barFront {
      width: 0;
      height: 100%;
      background-color: var(--progress-bar-color);
      transition: width 0.3s ease-in-out;
    }
  }

  .progressOut {
    opacity: 0;
  }
}

/* 全局修改elTable的样式 */
:deep(.el-table) {
  .el-table__header .el-table__cell {
    background-color: #f4f4f5;
  }
}

/* 全局修改el-form-item */
:deep(.el-form-item) {
  .el-form-item__label {
    font-size: 14px;
  }

  .el-input__wrapper {
    height: 30px;
  }
}

/* 全局修改el-dialog */
:deep(.el-dialog) {
  border-radius: 8px;
  box-shadow: 0 0 10px 3px #5f5f5f;

  .el-dialog__header {
    font-weight: 700;
  }

  .footer {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
}

/* 全局修改el-select */
:deep(.el-select) {
  .el-tag__content {
    color: var(--font-color);
  }
}

/* 全局修改el-radio */
:deep(.el-radio-group) {
  .el-radio {
    :deep(.el-radio__input.is-checked .el-radio__inner) {
      border-color: var(--el-redio-color);
      background-color: var(--el-redio-color);
    }

    :deep(.el-radio__label) {
      color: var(--el-redio-color);
    }

    :deep(.is-checked) {
      color: var(--el-redio-color);
    }
  }
}
</style>