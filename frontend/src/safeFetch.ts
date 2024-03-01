export const safeFetch = async (method: string, url: string, data?: any) => {

    try {
        const response = await fetch(url, {
            method: method,
            headers: data ? { "Content-Type": "application/json" } : {},
            body: data ? JSON.stringify(data) : undefined,
        })
        return response
    } catch (error) {
        return null
    }

}