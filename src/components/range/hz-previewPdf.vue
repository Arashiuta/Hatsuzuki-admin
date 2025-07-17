<template>
    <div class="previewPdf-container">
        <div style="width: 100%; height: 100%;text-align: center;" v-loading="loading">
            <canvas ref="canvasRef"></canvas>
        </div>
        <span v-if="!props.path">没有可预览文件</span>
        <div v-if="props.path" class="optionBtn">
            <div class="btnBox" title="移动" @click="movePreviewFunc">
                <el-icon>
                    <Rank />
                </el-icon>
            </div>
            <div class="btnBox" title="缩小" @click="zoomOutFunc">
                <el-icon>
                    <ZoomOut />
                </el-icon>
            </div>
            <div class="btnBox" title="放大" @click="zoomInFunc">
                <el-icon>
                    <ZoomIn />
                </el-icon>
            </div>
        </div>
        <div v-if="props.path" class="pageBox">
            <span>当前页：{{ canvasOption.page }}</span>
            <el-button size="small" :disabled="canvasOption.page <= 1" @click="pageoutPdf">上一页</el-button>
            <el-button size="small" :disabled="canvasOption.page >= pdfDoc?.numPages" @click="pageonPdf">下一页</el-button>
            <span>缩放比例：{{ canvasOption.scale.toFixed(1) }}x</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Rank, ZoomOut, ZoomIn } from '@element-plus/icons-vue'
import { onMounted, reactive, ref } from 'vue';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface Props {
    path: string; //pdf在线访问路径
}
const props = defineProps<Props>()

const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasOption = reactive({
    scale: 1,
    page: 1
});
let pdfDoc: any;
const loading = ref(false);
const initCanvas = async () => {
    if (!props.path || !canvasRef.value) return;
    loading.value = true;
    const context = canvasRef.value.getContext('2d');
    const loadingTask = pdfjsLib.getDocument(props.path);
    pdfDoc = await loadingTask.promise;
    const page = await pdfDoc.getPage(canvasOption.page);
    const viewport = page.getViewport({ scale: canvasOption.scale });
    const renderContext = {
        canvasContext: context,
        viewport: viewport
    };
    const renderTask = page.render(renderContext as any);
    canvasRef.value.height = viewport.height;
    canvasRef.value.width = viewport.width;
    await renderTask.promise;
    loading.value = false;
}

const destroyPdf = () => {
    if (!pdfDoc) return;
    pdfDoc.destroy()
}

const zoomOutFunc = () => {
    canvasOption.scale -= 0.3;
    if (canvasOption.scale < 1) canvasOption.scale = 1
    initCanvas()
}
const zoomInFunc = () => {
    canvasOption.scale += 0.3;
    if (canvasOption.scale > 5) canvasOption.scale = 5
    initCanvas()
}

function extractTranslateValues(translateString: string) {
    const regex = /translate\(\s*(-?\d+)px,\s*(-?\d+)px\s*\)/;
    const match = translateString.match(regex);
    if (match && match.length === 3) {
        const x = parseInt(match[1], 10);
        const y = parseInt(match[2], 10);
        return { x: x, y: y };
    } else {
        return { x: 0, y: 0 };
    }
}

const movePreviewFunc = () => {
    if (!canvasRef.value) return;
    if (canvasRef.value.style.cursor === 'move') {
        canvasRef.value.style.cursor = 'default'
        canvasRef.value.onmousedown = null
    } else {
        canvasRef.value.style.cursor = 'move'
        const mouseMoveHandler = (startPosition: any, event: any) => {
            if (!canvasRef.value) return;
            event.preventDefault();
            let nowPosition = {
                x: event.clientX,
                y: event.clientY
            }
            const dx = nowPosition.x - startPosition.x;
            const dy = nowPosition.y - startPosition.y;
            let translateValues = extractTranslateValues(canvasRef.value.style.transform);
            canvasRef.value.style.transform = `translate(${translateValues.x + dx}px, ${translateValues.y + dy}px)`;
            return nowPosition
        };

        canvasRef.value.onmousedown = (e: MouseEvent) => {
            if (!canvasRef.value) return;
            e.preventDefault();
            const startX = e.clientX;
            const startY = e.clientY;
            let startPosition = {
                x: startX,
                y: startY
            }
            const bondMouseMove = (e: MouseEvent) => {
                const nowPosition = mouseMoveHandler(startPosition, e);
                startPosition = {
                    x: nowPosition?.x,
                    y: nowPosition?.y
                }
            };
            canvasRef.value.addEventListener('mousemove', bondMouseMove);
            canvasRef.value.onmouseup = () => {
                if (!canvasRef.value) return;
                canvasRef.value.removeEventListener('mousemove', bondMouseMove);
            }
            canvasRef.value.onmouseleave = () => {
                if (!canvasRef.value) return;
                canvasRef.value.removeEventListener('mousemove', bondMouseMove);
            }
        };

    }
}

const pageoutPdf = () => {
    if (!pdfDoc) return;
    if (canvasOption.page <= 1) return;
    canvasOption.page--;
    initCanvas();
}

const pageonPdf = () => {
    if (!pdfDoc) return;
    if (canvasOption.page >= pdfDoc.numPages) return;
    canvasOption.page++;
    initCanvas();
}


onMounted(() => {
    initCanvas();
});

defineExpose({
    destroyPdf
});

</script>

<style scoped lang="scss">
.previewPdf-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    user-select: none;

    .optionBtn {
        display: flex;
        flex-direction: column;
        gap: 10px;
        position: absolute;
        right: 10px;
        bottom: 10px;

        .btnBox {
            width: 30px;
            height: 30px;
            background-color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 18px;
            border-radius: 5px;
            cursor: pointer;
            border: 1px solid #cacaca;
        }

        .downloadBtn {
            background-color: #71717b;
            color: #fff;
            border: 1px solid #71717b;
        }
    }

    .pageBox {
        display: flex;
        align-items: center;
        gap: 10px;
        position: absolute;
        left: 50%;
        bottom: 10px;
        transform: translateX(-50%);

        span {
            padding: 0 8px;
            background-color: #ffffff;
            width: 120px;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
            border-radius: 4px;
        }
    }
}
</style>