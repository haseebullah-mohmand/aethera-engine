// js/app.js
import { checkWebGPUSupport } from './webgpu-check.js';
import { AetheraEngine } from './engine.js';

let gpuContext = null;
const aethera = new AetheraEngine();

const btnInit = document.getElementById('btn-init');
const outputBox = document.getElementById('output-box');
const userInput = document.getElementById('user-input');
const btnSend = document.getElementById('btn-send');
const ramUsageEl = document.getElementById('ram-usage');
const gpuUsageEl = document.getElementById('gpu-usage');

// د پاڼې لوډېدو پر مهال د WebGPU پخلی
window.addEventListener('DOMContentLoaded', async () => {
    gpuContext = await checkWebGPUSupport();
});

// د محلي انجن د چمتو کولو پیل
btnInit.addEventListener('click', async () => {
    if (!gpuContext) {
        alert("ستاسو براوزر د WebGPU ملاتړ نه کوي. مهرباني وکړئ کروم (Chrome) تازه کړئ.");
        return;
    }

    btnInit.disabled = true;
    btnInit.innerText = "⏳ د ماډل لېږدول او تنظیمول (RAM/Wasm)...";

    try {
        await aethera.initializeEngine((report) => {
            // د لوډولو حالت ښودل
            outputBox.innerHTML = `<p class="text-blue-400 font-mono text-sm">${report.text}</p>`;
            
            // د حافظې دقیق تخمین ښودل
            if (performance && performance.memory) {
                const usedRAM = (performance.memory.usedJSHeapSize / (1024 * 1024 * 1024)).toFixed(2);
                ramUsageEl.innerText = `${usedRAM} GB`;
            } else {
                ramUsageEl.innerText = "~ 0.6 GB";
            }
        });

        outputBox.innerHTML += `<p class="text-emerald-400 font-bold border-t border-slate-800 pt-2 mt-2">[SUCCESS]: ماډل ۱۰۰٪ په محلي براوزر کې فعال شو! ټول پروسس د سرور پرته ترسره کېږي.</p>`;
        
        gpuUsageEl.innerText = "Active (100% Local)";
        gpuUsageEl.classList.remove('text-emerald-400');
        gpuUsageEl.classList.add('text-blue-400', 'animate-pulse');

        // د کنټرولونو فعالول
        userInput.disabled = false;
        btnSend.disabled = false;
        btnSend.classList.remove('bg-slate-800', 'text-slate-500', 'cursor-not-allowed');
        btnSend.classList.add('bg-blue-600', 'text-white', 'hover:bg-blue-500');

    } catch (err) {
        outputBox.innerHTML += `<p class="text-red-500 font-bold">[ERROR]: د لوډېدو ناکامي: ${err.message}</p>`;
        btnInit.disabled = false;
        btnInit.innerText = "🚀 بیا هڅه وکړئ";
    }
});

// د پوښتنې لېږل او صفر-ځنډ ځواب (Local Inference)
// js/app.js - updated handleSend
async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    userInput.value = "";
    outputBox.innerHTML += `<div class="my-2 text-slate-100"><strong>تاسو:</strong> ${text}</div>`;
    
    const responseContainer = document.createElement('div');
    responseContainer.className = "my-2 text-emerald-400 font-mono";
    responseContainer.innerHTML = `<strong>Aethera (Local AI):</strong> <span class="tokens"></span>`;
    outputBox.appendChild(responseContainer);

    const tokensSpan = responseContainer.querySelector('.tokens');
    const tpsSpeedEl = document.getElementById('tps-speed');

    try {
        await aethera.generateResponse(text, (delta, fullText, tps) => {
            tokensSpan.innerText = fullText;
            tpsSpeedEl.innerText = `${tps} Tokens/sec`;
            outputBox.scrollTop = outputBox.scrollHeight;
        });
    } catch (error) {
        tokensSpan.innerHTML += `<span class="text-red-500"> [د پروسس ستونزه رامنځته شوه]</span>`;
    }
}
btnSend.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});
// js/app.js په پای کې دا کوډ اضافه کړئ:

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('[Aethera SW]: د آفلاین لپاره Service Worker فعال شو!'))
            .catch(err => console.error('[Aethera SW Error]:', err));
    });
}