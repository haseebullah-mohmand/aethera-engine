// js/webgpu-check.js

export async function checkWebGPUSupport() {
    const gpuStatusEl = document.getElementById('gpu-status');

    if (!navigator.gpu) {
        gpuStatusEl.innerHTML = `
            <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span class="text-red-400">پاملرنه: دا براوزر د WebGPU ملاتړ نه کوي!</span>
        `;
        return false;
    }

    try {
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
            throw new Error("د GPU اډاپټر پیدا نشو.");
        }

        const device = await adapter.requestDevice();

        gpuStatusEl.innerHTML = `
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span class="text-emerald-400">WebGPU چمتو دی (${adapter.name || 'GPU Active'})</span>
        `;
        return { adapter, device };
    } catch (error) {
        gpuStatusEl.innerHTML = `
            <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span class="text-red-400">د GPU په وصلېدو کې تېروتنه!</span>
        `;
        console.error("WebGPU Initialization Error:", error);
        return false;
    }
}