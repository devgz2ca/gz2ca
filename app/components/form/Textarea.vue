<template>
  <div class="space-y-2">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <!-- Toolbar -->
    <div v-if="!disabled" class="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border border-b-0 border-gray-300 rounded-t-lg">
      <button
        type="button"
        @click="execCommand('bold')"
        class="p-1.5 rounded hover:bg-gray-200 text-gray-700"
        title="粗体"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
        </svg>
      </button>
      <button
        type="button"
        @click="execCommand('italic')"
        class="p-1.5 rounded hover:bg-gray-200 text-gray-700"
        title="斜体"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/>
        </svg>
      </button>
      <button
        type="button"
        @click="execCommand('underline')"
        class="p-1.5 rounded hover:bg-gray-200 text-gray-700"
        title="下划线"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/>
        </svg>
      </button>
      <div class="w-px h-5 bg-gray-300 mx-1"></div>
      <button
        type="button"
        @click="execCommand('insertUnorderedList')"
        class="p-1.5 rounded hover:bg-gray-200 text-gray-700"
        title="无序列表"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>
        </svg>
      </button>
      <button
        type="button"
        @click="execCommand('insertOrderedList')"
        class="p-1.5 rounded hover:bg-gray-200 text-gray-700"
        title="有序列表"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/>
        </svg>
      </button>
      <div class="w-px h-5 bg-gray-300 mx-1"></div>
      <button
        type="button"
        @click="execCommand('formatBlock', 'H3')"
        class="p-1.5 rounded hover:bg-gray-200 text-gray-700 text-xs font-bold"
        title="标题"
      >
        H3
      </button>
      <button
        type="button"
        @click="execCommand('formatBlock', 'P')"
        class="p-1.5 rounded hover:bg-gray-200 text-gray-700 text-xs"
        title="段落"
      >
        P
      </button>
    </div>

    <!-- Editor -->
    <div
      ref="editorRef"
      :id="id"
      :contenteditable="!disabled"
      :data-placeholder="placeholder"
      @input="handleInput"
      @blur="handleBlur"
      class="prose prose-sm max-w-none min-h-[120px] p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
      :class="{ 'rounded-t-none': !disabled }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'

interface Props {
  id?: string
  label?: string
  modelValue?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false
})

const emit = defineEmits(['update:modelValue', 'blur'])

const editorRef = ref<HTMLDivElement | null>(null)

const execCommand = (command: string, value?: string) => {
  document.execCommand(command, false, value)
  editorRef.value?.focus()
}

const handleInput = () => {
  if (editorRef.value) {
    emit('update:modelValue', editorRef.value.innerHTML)
  }
}

const handleBlur = () => {
  emit('blur')
}

const setContent = (html: string) => {
  if (editorRef.value && editorRef.value.innerHTML !== html) {
    editorRef.value.innerHTML = html
  }
}

watch(() => props.modelValue, (newVal) => {
  if (editorRef.value && newVal !== undefined) {
    setContent(newVal)
  }
}, { immediate: false })

onMounted(() => {
  if (props.modelValue && editorRef.value) {
    setContent(props.modelValue)
  }
})

defineExpose({
  focus: () => editorRef.value?.focus()
})
</script>

<style scoped>
[contenteditable]:empty:before {
  content: attr(data-placeholder);
  color: #9ca3af;
}

.prose {
  line-height: 1.6;
}

.prose :deep(h3) {
  font-size: 1rem;
  font-weight: 600;
  margin: 0.5rem 0;
}

.prose :deep(ul),
.prose :deep(ol) {
  padding-left: 1.25rem;
  margin: 0.5rem 0;
}

.prose :deep(li) {
  margin: 0.25rem 0;
}

.prose :deep(p) {
  margin: 0.5rem 0;
}
</style>
