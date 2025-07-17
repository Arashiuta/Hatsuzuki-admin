<template>
    <div class="homeHead-container">
        <div class="left">
            <span v-if="props.title">{{ props.title }}</span>
            <slot v-else name="headbody"></slot>
        </div>
        <div class="userHead">
            <el-dropdown trigger="click">
                <div class="headBox">
                    <img style="width: 30px;height:30px;border-radius: 50%;background-color: antiquewhite;"
                        src="/head/head.jpg" alt="">
                    <span>{{ store.user ? store.user?.name : '初月' }}</span>
                    <el-icon>
                        <ArrowDown />
                    </el-icon>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="router.replace('/login')">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';

const store = useStore();
const router = useRouter();

interface Props {
    title?: string;
}
const props = withDefaults(defineProps<Props>(), {
    title: ''
});


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
        .headBox {
            display: flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
            padding: 5px 10px;
            border-radius: 6px;
            transition: all 0.3s ease;

            &:hover {
                background-color: #f5f5f5;
            }
        }

        .popperClass {
            color: red;
        }
    }


    .dialogFooter {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
}
</style>