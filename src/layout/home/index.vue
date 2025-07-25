<template>
    <div class="home-container">
        <Menu @updateActiveIndex="updateActiveIndexFunc"></Menu>
        <div class="main">

            <Head :title="headTitle"></Head>
            <router-view v-slot="{ Component }">
                <Transition name="platformFade" mode="out-in">
                    <component :is="Component" />
                </Transition>
            </router-view>
        </div>
    </div>
</template>

<script setup lang="ts">
import Menu from '@/layout/home/components/menu/index.vue';
import Head from '@/layout/home/components/head/index.vue';
import { ref } from 'vue';

const headTitle = ref('');
const updateActiveIndexFunc = (payload: { pageIndex: string; pageTitle: string }) => {
    headTitle.value = payload.pageTitle;
}
</script>

<style scoped lang="scss">
.home-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    background-color: var(--home-background-color);
    position: relative;

    .main {
        flex: 1;
        padding: 20px 40px;
        display: flex;
        flex-direction: column;
        gap: 15px;
        overflow-y: scroll;


        .platformFade-enter-active,
        .platformFade-leave-active {
            transition: all 0.45s ease;
        }

        .platformFade-enter-from {
            transform: translateX(-20px);
            opacity: 0;
        }

        .platformFade-enter-to {
            transform: translateX(0);
            opacity: 1;
        }

        .platformFade-leave-from {
            transform: translateX(0);
            opacity: 1;
        }

        .platformFade-leave-to {
            transform: translateX(20px);
            opacity: 0;
        }

    }
}
</style>