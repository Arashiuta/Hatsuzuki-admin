<template>
    <div class="login-container">
        <!-- 静态网格背景 -->
        <div class="absoluteBg">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
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

const store = useStore();
const router = useRouter();

const loginForm = ref({
    username: 'admin',
    password: 'admin123'
});
const savePwd = ref(false)

const loginFunc = async () => {
    router.replace({ path: '/home/index' });
    localStorage.setItem('hz_awp', window.btoa(JSON.stringify(loginForm.value)));
    localStorage.setItem('user', JSON.stringify(loginForm.value));
    return
    const res: any = await loginApi.login(loginForm.value);
    if (res.success) {
        if (savePwd.value) {
            localStorage.setItem('hz_awp', window.btoa(JSON.stringify(loginForm.value)));
        } else {
            localStorage.removeItem('hz_awp');
        }
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('token', res.access_token);
        store.setUser(res.user);
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
    }

    .loginBox {
        padding: 30px 40px;
        background-color: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 1px 1px 20px 2px rgb(233, 233, 233);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;

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
                color: #999;
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
</style>