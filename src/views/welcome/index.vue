<template>
    <div class="welcome-container">
        <div class="itemBox">
            <span>折线图示例</span>
            <div class="chartBox">
                <Linechart></Linechart>
            </div>
        </div>
        <div class="itemBox">
            <span>柱状图示例</span>
            <div class="chartBox">
                <BarChart></BarChart>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import BarChart from "@/views/welcome/components/echarts/barchart/index.vue"
import Linechart from "@/views/welcome/components/echarts/linechart/index.vue"
</script>

<style scoped lang="scss">
.welcome-container {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .itemBox {
        width: 100%;
        height: 400px;
        background-color: #fff;
        border-radius: 6px;
        display: flex;
        flex-direction: column;

        >span {
            font-size: 18px;
            font-weight: 700;
            padding: 20px 0 0 20px;
        }

        .chartBox {
            flex: 1;
        }
    }
}
</style>