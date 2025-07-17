<template>
    <div ref="linchartBox" class="linchartBox"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts/core';
import { TooltipComponent, GridComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { markRaw, onMounted, ref } from 'vue';


//假数据
const chartData = {
    approved: [
        { count: 120, date: '2023-01-01' },
        { count: 132, date: '2023-02-01' },
        { count: 101, date: '2023-03-01' },
        { count: 134, date: '2023-04-01' },
        { count: 90, date: '2023-05-01' },
        { count: 230, date: '2023-06-01' },
        { count: 210, date: '2023-07-01' },
        { count: 180, date: '2023-08-01' },
        { count: 260, date: '2023-09-01' },
        { count: 300, date: '2023-10-01' },
        { count: 320, date: '2023-11-01' },
        { count: 350, date: '2023-12-01' }
    ],
    rejected: [
        { count: 50, date: '2023-01-01' },
        { count: 72, date: '2023-02-01' },
        { count: 61, date: '2023-03-01' },
        { count: 84, date: '2023-04-01' },
        { count: 70, date: '2023-05-01' },
        { count: 110, date: '2023-06-01' },
        { count: 90, date: '2023-07-01' },
        { count: 80, date: '2023-08-01' },
        { count: 120, date: '2023-09-01' },
        { count: 150, date: '2023-10-01' },
        { count: 170, date: '2023-11-01' },
        { count: 200, date: '2023-12-01' }
    ]
}

echarts.use([
    TooltipComponent,
    GridComponent,
    LineChart,
    CanvasRenderer,
    UniversalTransition
]);

const linchartBox = ref<HTMLElement | null>(null);
const chartInstance = ref<echarts.ECharts | null>(null);

const initChart = () => {
    if (linchartBox.value) {
        chartInstance.value = markRaw(echarts.init(linchartBox.value));
        const option = {
            color: ['#31bbf8', '#1e5eea'],
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                top: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: [
                    '1月',
                    '2月',
                    '3月',
                    '4月',
                    '5月',
                    '6月',
                    '7月',
                    '8月',
                    '9月',
                    '10月',
                    '11月',
                    '12月'
                ],
                boundaryGap: false,
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#f0f0f0'
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisLabel: {
                    color: '#666'
                },
                splitLine: {
                    show: false
                }
            },
            series: [
                {
                    name: '通过',
                    type: 'line',
                    smooth: true,
                    showSymbol: false,
                    lineStyle: {
                        width: 3
                    },
                    data: chartData.approved.map(item => item.count)
                },
                {
                    name: '不通过',
                    type: 'line',
                    smooth: true,
                    showSymbol: false,
                    lineStyle: {
                        width: 3
                    },
                    data: chartData.rejected.map(item => item.count)
                }
            ]
        };
        chartInstance.value.setOption(option);
    }
};

onMounted(() => {
    initChart();
});

</script>

<style scoped lang="scss">
.linchartBox {
    width: 100%;
    height: 100%;
}
</style>