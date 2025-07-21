<template>
    <el-drawer v-model="drawerVisible" title="颜色主题" direction="rtl" size="400px">
        <div class="themeBox">
            <div class="themeItem" @click="closeDrawer">
                <img src="" alt="" />
                <span>经典</span>
            </div>
        </div>
    </el-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const drawerVisible = ref(false);
const openDrawer = () => {
    drawerVisible.value = true;
};
const closeDrawer = () => {
    drawerVisible.value = false;
};

defineExpose({
    openDrawer,
    closeDrawer
});
</script>

<style scoped></style>