<template>
    <div
        :class="['opButton-container', { 'primary': props.type === 'primary' }, { 'normal': props.type === 'normal' }, { 'large': props.size === 'large' }, props.disabled ? 'disabled' : 'notDisabled']">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">

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

.primary {
    background-color: var(--hz-button-primary-background-color);
    color: var(--hz-button-primary-text-color);
}

.normal {
    border: 1px solid var(--hz-button-normal-border-color)
}

.large {
    padding: 8px 50px;
}

.disabled {
    opacity: 0.5;
    pointer-events: none;
    cursor: not-allowed;
}

.notDisabled {
    opacity: 1;
    pointer-events: auto;
    cursor: pointer;
}
</style>