/***
 * @description 生成图片
 * @param params 输入的prompt等参数 {string}
 * @returns Promise<Reponse>
 */
export async function apiGenerate(params:any): Promise<Response>{
    const response = await fetch('/api/generate', {
        method: 'POST',
        body: params.formData
    });
    return response;
}

/***
 * @description 根据现有prompt优化
 * @param params.input 输入的prompt {string}
 * @returns Promise<Reponse>
 */
export async function apiCreatePrompt(params: { input: string }): Promise<Response> {
    const response = await fetch('/api/prompt', {
        method: 'POST',
        headers: {
            "Context-Type": "application/json"
        },
        body: JSON.stringify({ input: params.input })
    });
    return response;
}