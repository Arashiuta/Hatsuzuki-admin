<template>
    <div class="menu-container">
        <div class="menuTitle">
            <span>Hatsuzuki-admin</span>
        </div>
        <el-menu ref="menuRef" default-active="2" class="el-menu-vertical-demo"
            background-color="var(--menu-background-color)" text-color="var(--menu-text-color)"
            active-text-color="var(--menu-active-text-color)">
            <div v-for="(item, index) in menuList" :key="index">
                <!-- 一级路由 -->
                <el-menu-item v-if="!item.children && item.showLink && item.permission" :index="item.index"
                    @click="goPage(item.routerPath, item.index, item.label)">
                    <div class="menuItemBox">
                        <img v-if="item.icon" class="icon" :src="item.icon" alt="">
                        <span>{{ item.label }}</span>
                    </div>
                </el-menu-item>
                <!-- 二级路由 -->
                <el-sub-menu v-if="item.children && item.showLink && item.permission" :index="item.index">
                    <template #title>
                        <div class="menuItemBox">
                            <img v-if="item.icon" class="icon" :src="item.icon" alt="">
                            <span>{{ item.label }}</span>
                        </div>
                    </template>
                    <div v-for="(j, index) in item.children" :key="index">
                        <el-menu-item v-if="j.showLink && j.permission" :index="`${item.index}-${j.index}`"
                            @click="goPage(j.routerPath, j.index, j.label)">
                            <img v-if="j.icon" class="icon" :src="j.icon" alt="">
                            <span>{{ j.label }}</span>
                        </el-menu-item>
                    </div>
                </el-sub-menu>
            </div>
        </el-menu>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { routes } from '@/router';
import type { MenuItem, RouteItem } from './types';
import { useStore } from '@/store';

const router = useRouter();
const store = useStore();
const emit = defineEmits(['updateActiveIndex']); //菜单修改

//定义菜单列表
const menuList = ref<Array<MenuItem>>([])
const getMenuList = () => {
    const user = store.getUser()
    if (!user) return;
    routes.forEach((item: RouteItem) => {
        if (item.path !== '/' && item.path !== '/login') {
            let result: MenuItem = {
                label: item.meta?.title ?? '未命名路由',
                index: String(menuList.value.length),
                showLink: item.meta?.showLink || true,
                icon: item.meta?.icon ?? '', //图标
                permission: item.meta?.roles && user.role ? item.meta?.roles.includes(user.role) : true, //权限判断
                routerPath: "",
            }
            if (item.children && item.children.length === 1) {
                //创建一级路由
                result.label = item.children[0].meta?.title ?? '未命名一级路由';
                result.index = String(menuList.value.length);
                result.showLink = item.children[0].meta?.showLink ?? true; //是否显示链接，如果没有设置则默认显示
                result.icon = item.children[0].meta?.icon ?? '';
                result.permission = item.children[0].meta?.roles && user.role ? item.children[0].meta?.roles.includes(user.role) : true; //权限判断
                result.routerPath = `${item.path}/${item.children[0].path}`;
            }
            if (item.children && item.children.length > 1) {
                //创建二级路由
                result.children = item.children.map((child: RouteItem, index) => ({
                    label: child.meta?.title ?? '未命名二级路由',
                    index: String(index),
                    showLink: child.meta?.showLink ?? true, //是否显示链接，如果没有设置则默认显示
                    icon: child.meta?.icon ?? '',
                    permission: child.meta?.roles && user.role ? child.meta?.roles.includes(user.role) : result.permission, //权限判断
                    routerPath: `${item.path}/${child.path}`,
                }));
            }
            menuList.value.push(result)
        }
    })
}

//获取当前菜单索引
const menuRef = ref();
const getMenuIndex = () => {
    const path = router.currentRoute.value.path;
    menuList.value.forEach((item) => {
        if (item.children) {
            item.children.forEach((j) => {
                if (path === j.routerPath) {
                    menuRef.value.updateActiveIndex(`${item.index}-${j.index}`);
                    goPage(j.routerPath, `${item.index}-${j.index}`, j.label);
                }
            });
        } else {
            if (path === item.routerPath) {
                menuRef.value.updateActiveIndex(item.index);
                goPage(item.routerPath, item.index, item.label);
            }
        }
    })
}
const goPage = (path: string, pageIndex: string, pageTitle: string) => {
    router.push(path);
    emit('updateActiveIndex', { pageIndex: pageIndex, pageTitle: pageTitle });
}

watch(() => router.currentRoute.value.path, () => {
    getMenuIndex();
});

onMounted(() => {
    getMenuList()
    getMenuIndex()
})

</script>

<style scoped lang="scss">
.menu-container {
    width: 220px;
    padding: 0 10px;
    background-color: var(--menu-background-color);


    .menuTitle {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        font-weight: 700;
        color: var(--menu-title-color);
        padding: 15px 0;
    }

    .menuItemBox {
        display: flex;
        align-items: center;
        gap: 7px;
        font-size: 15px;
    }

    .icon {
        width: 16px;
        height: 16px;
        color: red;
    }


    :deep(.el-menu) {
        border: none;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .el-sub-menu__title {
            background-color: var(--menu-background-color);
        }

        .is-active {
            background-color: var(--menu-active-color);
        }

        .el-menu-item {
            border-radius: 8px;
            height: 40px;
            font-size: 14px;

            &:hover {
                background-color: var(--menu-background-hover-color);
                color: var(--menu-text-hover-color)
            }
        }
    }
}
</style>