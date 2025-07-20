<template>
    <div class="home-container">
        <div class="progressBar-container">
            <div ref="barBackRef" class="barBack">
                <div ref="barFrontRef" class="barFront "></div>
            </div>
        </div>
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
import { ref, watch } from 'vue';
import { useStore } from '@/store/index.ts';

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

    .progressBar-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;

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