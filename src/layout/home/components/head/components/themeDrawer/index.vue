<template>
    <el-drawer v-model="drawerVisible" title="颜色主题" direction="rtl" size="400px">
        <div class="themeBox">
            <div v-for="(item, index) in themeList" :key="index" class="themeItem" @click="checkThemeFunc(item.value)">
                <div class="themeItemImg">
                    <div :style="{ backgroundColor: item.menuColor }"></div>
                    <div :style="{ backgroundColor: item.mainColor }"></div>
                </div>
                <span>{{ item.name }}</span>
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

interface ThemeItem {
    name: string;
    menuColor: string;
    mainColor: string;
    value: string;
}
const themeList: Array<ThemeItem> = [
    { name: '经典', menuColor: '#000', mainColor: '#fafafa', value: 'hz-theme-normal' },
    { name: '红色', menuColor: '#e42929', mainColor: '#fafafa', value: 'hz-theme-red' },
    { name: '绿色', menuColor: '#3bc794', mainColor: '#fafafa', value: 'hz-theme-green' },
    { name: '灰色', menuColor: '#cecece', mainColor: '#fafafa', value: 'hz-theme-gray' }
];

const checkThemeFunc = (themeNmae: string) => {
    const html = document.querySelector('html');
    const theme = localStorage.getItem('theme');
    if (html) {
        if (!theme) {
            html.classList.add(themeNmae);
            localStorage.setItem('theme', themeNmae);
        } else {
            html.classList.remove(theme);
            html.classList.add(themeNmae);
            localStorage.setItem('theme', themeNmae);
        }
    }
};

defineExpose({
    openDrawer,
    closeDrawer
});
</script>

<style scoped lang="scss">
.themeBox {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;

    .themeItem {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        padding: 20px;
        border-radius: 8px;
        transition: all 0.3s ease;

        &:hover {
            background-color: #f0f0f0;
        }

        .themeItemImg {
            width: 100%;
            height: 70px;
            display: grid;
            grid-template-columns: 1fr 4fr;
            border: 1px solid #ccc;
            border-radius: 6px;
            overflow: hidden;
            cursor: pointer;
        }
    }
}
</style>