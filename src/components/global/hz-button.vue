<template>
    <div ref="opButtonRef" class="opButton-container">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';

interface OpButtonProps {
    type?: 'primary' | 'normal';
    size?: 'default' | 'large';
    disabled?: boolean;
}
const props = withDefaults(defineProps<OpButtonProps>(), {
    type: 'primary',
    size: 'default',
    disabled: false,
});

const opButtonRef = ref<HTMLElement | null>(null);

const initStyle = () => {
    if (opButtonRef.value) {
        if (props.type === 'primary') {
            opButtonRef.value.style.backgroundColor = '#0065ca';
            opButtonRef.value.style.color = '#fff';
        }
        if (props.type === 'normal') {
            opButtonRef.value.style.border = '1px solid #e4e4e4';
        }
        if (props.size === 'large') {
            opButtonRef.value.style.padding = '8px 50px';
        }

    }
}

watchEffect(() => {
    if (props.disabled && opButtonRef.value) {
        opButtonRef.value.style.opacity = '0.5';
        opButtonRef.value.style.pointerEvents = 'none';
        opButtonRef.value.style.cursor = 'not-allowed';
    }
    if (!props.disabled && opButtonRef.value) {
        opButtonRef.value.style.opacity = '1';
        opButtonRef.value.style.pointerEvents = 'auto';
        opButtonRef.value.style.cursor = 'pointer';
    }
})

onMounted(() => {
    initStyle()
})
</script>

<style scoped lang="scss">
.opButton-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 7px;
    padding: 5px 15px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        filter: brightness(0.8);
    }
}
</style>