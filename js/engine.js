// js/engine.js په کډ کې د چټکتیا اندازه اضافه کول

export class AetheraEngine {
    constructor() {
        this.engine = null;
        this.selectedModel = "Qwen2-0.5B-Instruct-q4f16_1-MLC"; 
    }

    async initializeEngine(onProgressCallback) {
        try {
            this.engine = await webllm.CreateMLCEngine(
                this.selectedModel,
                {
                    initProgressCallback: (report) => {
                        if (onProgressCallback) onProgressCallback(report);
                    }
                }
            );
            return true;
        } catch (error) {
            console.error("Initialization Error:", error);
            throw error;
        }
    }

    async generateResponse(prompt, onTokenCallback) {
        if (!this.engine) throw new Error("Engine not initialized!");

        const messages = [
            { role: "system", content: "تاسو د Aethera محلي انجن یاست." },
            { role: "user", content: prompt }
        ];

        const startTime = performance.now();
        let tokenCount = 0;

        const completion = await this.engine.chat.completions.create({
            messages,
            stream: true,
        });

        let fullText = "";
        for await (const chunk of completion) {
            const delta = chunk.choices[0]?.delta?.content || "";
            fullText += delta;
            tokenCount++;

            const currentTime = performance.now();
            const elapsedTime = (currentTime - startTime) / 1000; // په ثانیو کې
            const tokensPerSecond = (tokenCount / elapsedTime).toFixed(1);

            if (onTokenCallback) {
                onTokenCallback(delta, fullText, tokensPerSecond);
            }
        }

        return fullText;
    }
}