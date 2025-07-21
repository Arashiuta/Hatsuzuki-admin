<template>
    <div class="homeHead-container">
        <div class="left">
            <span v-if="props.title">{{ props.title }}</span>
            <slot v-else name="headbody"></slot>
        </div>
        <div class="userHead">
            <div class="themeBtn" title="主题" @click="openThemeDrawerFunc">
                <img src="/head/theme.svg" alt="">
            </div>
            <el-dropdown trigger="click">
                <div class="headBox">
                    <img style="width: 30px;height:30px;border-radius: 50%;" src="/head/head.jpg" alt="">
                    <span>{{ store.user?.name ? store.user?.name : '初月' }}</span>
                    <el-icon>
                        <ArrowDown />
                    </el-icon>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="logoutFunc">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>

        <ThemeDRawer ref="themeDrawerRef"></ThemeDRawer>
    </div>
</template>

<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { ElMessage } from 'element-plus';
import ThemeDRawer from './components/themeDrawer/index.vue';
import { ref } from 'vue';

const store = useStore();
const router = useRouter();

interface Props {
    title?: string;
}
const props = withDefaults(defineProps<Props>(), {
    title: ''
});

const logoutFunc = () => {
    const user = localStorage.getItem('user');
    if (user) {
        localStorage.removeItem('user');
        store.setUser(null);
        ElMessage.success('退出登录成功');
        router.replace('/login')
    }
};

const themeDrawerRef = ref();
const openThemeDrawerFunc = () => {
    themeDrawerRef.value.openDrawer();
}


</script>

<style scoped lang="scss">
.homeHead-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
        span {
            font-size: 22px;
            font-weight: 700;
        }
    }

    .userHead {
        display: flex;
        align-items: center;
        gap: 10px;

        .themeBtn {
            width: 25px;
            height: 25px;
            cursor: pointer;

            &:hover {
                background-color: var(--header-hover-background-color);
                border-radius: 8px;
            }

            >img {
                width: 100%;
                height: 100%;
            }
        }

        .headBox {
            display: flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
            padding: 5px 10px;
            border-radius: 6px;
            transition: all 0.3s ease;

            &:hover {
                background-color: var(--header-hover-background-color);
            }
        }
    }


    .dialogFooter {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
}
</style>