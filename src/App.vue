<template>
  <router-view></router-view>
</template>

<script setup lang="ts">

</script>

<style scoped>
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

/* dialog */
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

:deep(.el-select) {
  .el-tag__content {
    color: #000;
  }
}

:deep(.el-radio-group) {
  .el-radio {
    :deep(.el-radio__input.is-checked .el-radio__inner) {
      border-color: #242424;
      background-color: #242424;
    }

    :deep(.el-radio__label) {
      color: #242424;
    }

    :deep(.is-checked) {
      color: #242424;
    }
  }
}
</style>