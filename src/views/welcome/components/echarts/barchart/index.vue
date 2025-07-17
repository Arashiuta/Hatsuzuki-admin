<template>
    <div ref="barChartRef" class="barChartContainer"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts/core';
import {
    TooltipComponent,
    GridComponent,
    LegendComponent
} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { markRaw, onMounted, ref, watch } from 'vue';

interface Props {
    chartData?: Array<{ username: string, data1: string, data2: string, data3: string }>
}
const props = withDefaults(defineProps<Props>(), {
    chartData: () => [
        { username: '秋月', data1: '55', data2: '23', data3: '78' },
        { username: '照月', data1: '32', data2: '67', data3: '15' },
        { username: '凉月', data1: '88', data2: '11', data3: '45' },
        { username: '初月', data1: '19', data2: '75', data3: '30' },
        { username: '新月', data1: '62', data2: '49', data3: '82' },
        { username: '宵月', data1: '70', data2: '28', data3: '12' },
        { username: '霜月', data1: '41', data2: '89', data3: '60' },
        { username: '花月', data1: '10', data2: '50', data3: '90' }
    ]
});

echarts.use([
    TooltipComponent,
    GridComponent,
    LegendComponent,
    BarChart,
    CanvasRenderer
]);

const barChartRef = ref<HTMLElement | null>(null);
const chartInstance = ref<echarts.ECharts | null>(null);
const initChart = () => {
    if (barChartRef.value) {
        chartInstance.value = markRaw(echarts.init(barChartRef.value));
        const
            option = {
                color: [
                    '#0059ff',
                    '#00c2ff',
                    '#dcebff'
                ],

                legend: {
                    data: ['数据1', '数据2', '数据3'],
                    bottom: 10, // 距离底部 10px
                    left: 'center', // 水平居中
                    itemWidth: 10, // 图例标记宽度
                    itemHeight: 10, // 图例标记高度
                    icon: 'circle' // 图例标记为圆形
                },

                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },

                // 调整图表布局，为图例留出空间
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '12%',
                    containLabel: true
                },

                xAxis: {
                    type: 'category',
                    data: props.chartData.map(item => item.username),
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    }
                },

                yAxis: {
                    type: 'value',
                    interval: 20,
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        color: '#666'
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#f0f0f0'
                        }
                    }
                },

                // 3. 数据系列配置
                series: [
                    {
                        name: '数据1',
                        type: 'bar',
                        barWidth: '15%',
                        data: props.chartData.map(item => parseInt(item.data1)),
                        itemStyle: {
                            borderRadius: [20, 20, 0, 0]
                        }
                    },
                    {
                        name: '数据2',
                        type: 'bar',
                        barWidth: '15%',
                        data: props.chartData.map(item => parseInt(item.data2)),
                        itemStyle: {
                            borderRadius: [20, 20, 0, 0] // 设置顶部圆角
                        }
                    },
                    {
                        name: '数据3',
                        type: 'bar',
                        barWidth: '15%',
                        data: props.chartData.map(item => parseInt(item.data3)),
                        itemStyle: {
                            borderRadius: [20, 20, 0, 0] // 设置顶部圆角
                        }
                    }
                ]
            };
        chartInstance.value.setOption(option);
    }
};


watch(() => props.chartData, () => {
    initChart();
});


onMounted(() => {
    initChart();
});


</script>

<style scoped lang="scss">
.barChartContainer {
    width: 100%;
    height: 100%;
}
</style>