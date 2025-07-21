<template>
    <div class="login-container">
        <!-- 静态网格背景 -->
        <div class="absoluteBg">
            <svg class="loginBg" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" stroke-width="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>
        <div class="loginBox">
            <div class="title">
                <span>系统登录</span>
                <span>欢迎登录后台管理系统</span>
            </div>

            <div class="form">
                <el-form-item>
                    <el-input v-model="loginForm.username" placeholder="请输入用户名" :prefix-icon="User"
                        style="width: 280px;" />
                </el-form-item>
                <el-form-item>
                    <el-input v-model="loginForm.password" type="password" show-password placeholder="请输入密码"
                        :prefix-icon="Lock" />
                </el-form-item>
                <el-checkbox v-model="savePwd" label="记住密码" style="margin-left: auto;" />
            </div>
            <div class="loginBtn" @click="loginFunc">
                <span>登录</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { loginApi } from '@/api/login';
import { useStore } from '@/store';
import { setTokens } from '@/utils/tokenUtils.ts';

const store = useStore();
const router = useRouter();

const loginForm = ref({
    username: 'admin',
    password: 'admin123'
});
const savePwd = ref(false)

const loginFunc = async () => {
    const res: any = await loginApi.login(loginForm.value);
    if (res.code == 200) {
        store.loginExpired = false; // 登录成功，重置登录过期状态
        setTokens(res.data.accessToken, res.data.refreshToken, res.data.expiresIn);
        store.setUser(res.data);
        if (savePwd.value) {
            localStorage.setItem('hz_awp', window.btoa(JSON.stringify(loginForm.value)));
        } else {
            localStorage.removeItem('hz_awp');
        }
        localStorage.setItem('user', JSON.stringify(res.data));
        ElMessage.success('登录成功');
        router.replace({ path: '/home/index' });
    } else {
        ElMessage.error(res.message || '登录失败，请重试');
    }
}

const fillAwp = () => {
    const awp = localStorage.getItem('hz_awp');
    if (awp) {
        try {
            const parsedAwp = JSON.parse(window.atob(awp));
            loginForm.value.username = parsedAwp.username || '';
            loginForm.value.password = parsedAwp.password || '';
            savePwd.value = true;
        } catch (error) {
            console.error('解析 awp 失败:', error);
        }
    }
}


onMounted(() => {
    fillAwp()
});

</script>

<style scoped lang="scss">
.login-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    .absoluteBg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        .loginBg {
            background-color: var(--login-background-color);
        }
    }

    .loginBox {
        padding: 40px 60px;
        background-color: var(--login-box-background-color);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 1px 1px 20px 2px var(--login-box-shadow-color);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        /* 应用动画 */
        animation-name: loginBoxUp;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
        animation-timing-function: ease-in-out;


        .title {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
            gap: 5px;

            >:nth-child(1) {
                font-size: 26px;
                font-weight: 700;
            }

            >:nth-child(2) {
                font-size: 14px;
                color: var(--font-subtitle-color);
            }
        }

        .form {
            display: flex;
            flex-direction: column;
        }

        .loginBtn {
            width: 100%;
            height: 38px;
            background-color: #409eff;
            color: #fff;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 10px;

            &:hover {
                background-color: #66b1ff;
            }
        }
    }
}

// 新增动画
@keyframes loginBoxUp {
    0% {
        opacity: 0;
        transform: translate(-50%, -40%); // 从下方开始
    }

    100% {
        opacity: 1;
        transform: translate(-50%, -50%); // 回到初始居中位置
    }
}
</style>