<template>
    <div ref="opButtonRef" class="opButton-container">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

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
            opButtonRef.value.style.backgroundColor = 'var(--hz-button-primary-background-color)';
            opButtonRef.value.style.color = 'var(--hz-button-primary-text-color)';
        }
        if (props.type === 'normal') {
            opButtonRef.value.style.border = '1px solid var(--hz-button-normal-border-color)';
        }
        if (props.size === 'large') {
            opButtonRef.value.style.padding = '8px 50px';
        }

    }
}

watch(
    () => props.disabled,
    (disabled) => {
        if (opButtonRef.value) {
            if (disabled) {
                opButtonRef.value.style.opacity = '0.5';
                opButtonRef.value.style.pointerEvents = 'none';
                opButtonRef.value.style.cursor = 'not-allowed';
            } else {
                opButtonRef.value.style.opacity = '1';
                opButtonRef.value.style.pointerEvents = 'auto';
                opButtonRef.value.style.cursor = 'pointer';
            }
        }
    },
    { immediate: true }
);

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