<template>
    <div class="documentFramework-container">
        <div v-if="$slots.screen" class="commonBox optionBox">
            <div class="screenBox">
                <!-- 筛选选项 -->
                <slot name="screen"></slot>
            </div>
            <!-- 提交按钮组 -->
            <div class="submitBox">
                <div class="resetBtn" @click="resetFunc">
                    <el-icon>
                        <RefreshRight />
                    </el-icon>
                </div>
                <hz-button @click="searchFunc">
                    <el-icon>
                        <Search />
                    </el-icon>
                    <span>搜索</span>
                </hz-button>
            </div>
        </div>
        <!-- 主体 -->
        <div v-if="$slots.default" class="commonBox defaultBox">
            <slot></slot>
        </div>
        <!-- footer -->
        <div v-if="$slots.footer" class="commonBox">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { RefreshRight } from '@element-plus/icons-vue';
import { Search } from '@element-plus/icons-vue';

const emit = defineEmits(['search', 'reset']);

const resetFunc = () => {
    emit('reset');
}
const searchFunc = () => {
    emit('search');
}
</script>

<style scoped lang="scss">
.documentFramework-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-height: calc(100vh - 110px);
    overflow: hidden;

    .commonBox {
        background-color: #fff;
        padding: 15px;
        border-radius: 6px;
    }

    .optionBox {
        display: grid;
        grid-template-columns: 1fr 250px;
        gap: 20px;


        .screenBox {
            display: flex;
            align-items: center;
            gap: 30px;
            flex-wrap: wrap;

            :deep(.el-form-item) {
                margin: 0;
            }
        }

        .submitBox {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 15px;


            .resetBtn {
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid #c9c9c9;
                border-radius: 5px;
                padding: 5px 12px;
                cursor: pointer;
                transition: all 0.2s ease;

                &:hover {
                    background-color: #f7f7f7;
                }
            }
        }
    }

    .defaultBox {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

}
</style>