<template>
    <div class="menu-container">
        <div class="menuTitle">
            <span>Hatsuzuki-admin</span>
        </div>
        <el-menu ref="menuRef" default-active="2" class="el-menu-vertical-demo" background-color="#18171c"
            text-color="#fff" active-text-color="#fff">
            <div v-for="(item, index) in menuList" :key="index">
                <!-- 一级路由 -->
                <el-menu-item v-if="!item.children && item.showLink" :index="item.index"
                    @click="goPage(item.routerPath, item.index, item.label)">
                    <div class="menuItemBox">
                        <img v-if="item.icon" class="icon" :src="item.icon" alt="">
                        <span>{{ item.label }}</span>
                    </div>
                </el-menu-item>
                <!-- 二级路由 -->
                <el-sub-menu v-if="item.children && item.showLink" :index="item.index">
                    <template #title>
                        <div class="menuItemBox">
                            <img v-if="item.icon" class="icon" :src="item.icon" alt="">
                            <span>{{ item.label }}</span>
                        </div>
                    </template>
                    <div v-for="(j, index) in item.children" :key="index">
                        <el-menu-item v-if="j.showLink" :index="`${item.index}-${j.index}`"
                            @click="goPage(j.routerPath, j.index, j.label)">
                            {{ j.label }}</el-menu-item>
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
import type { MenuItem, RouteItem } from '@/layout/home/components/menu/modules/types';

const router = useRouter();
const emit = defineEmits(['updateActiveIndex']); //菜单修改

//定义菜单列表
const menuList = ref<Array<MenuItem>>([])
const getMenuList = () => {
    routes.forEach((item: RouteItem) => {
        if (item.path !== '/' && item.path !== '/login') {
            let result: MenuItem = {
                label: item.meta ? item.meta.title : '未命名路由',
                index: String(menuList.value.length),
                showLink: item.children && item.children.length > 1 && item.children.findIndex((i: any) => i.meta.showLink === true) === -1 ? false : true, //是否显示链接，如果没有设置则默认显示
                icon: item.meta && item.meta.icon ? item.meta.icon : '', //图标
                routerPath: item.path,
            }
            if (item.children && item.children.length === 1) {
                //创建一级路由
                result.label = item.meta ? item.meta.title : '未命名一级路由';
                result.index = String(menuList.value.length);
                result.showLink = item.children[0].meta ? item.children[0].meta.showLink !== false : true; //是否显示链接，如果没有设置则默认显示
                result.icon = item.meta && item.meta.icon ? item.meta.icon : '';
                result.routerPath = `${item.path}/${item.children[0].path}`;
            }
            if (item.children && item.children.length > 1) {
                //创建二级路由
                result.children = item.children.map((child: RouteItem, index) => ({
                    label: child.meta ? child.meta.title : '未命名二级路由',
                    index: String(index),
                    showLink: child.meta ? child.meta.showLink !== false : true, //是否显示链接，如果没有设置则默认显示
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
    width: 240px;
    padding: 0 10px;
    background-color: #18171c;

    .menuTitle {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 22px;
        font-weight: 700;
        color: #fff;
        padding: 15px 0;
    }

    .menuItemBox {
        display: flex;
        align-items: center;
        gap: 7px;

        .icon {
            width: 16px;
            height: 16px;
        }
    }


    :deep(.el-menu) {
        border: none;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .el-sub-menu__title {
            background-color: #18171c;
        }

        .is-active {
            background-color: #0065ca;

        }

        .el-menu-item {
            border-radius: 8px;
            height: 40px;
        }
    }
}
</style>