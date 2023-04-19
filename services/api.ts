export async function apiGenerate(params): Promise<Response>{
    const response = await fetch('/api/generate', {
        method: 'POST',
        body: params.formData
    });
    return response;
}