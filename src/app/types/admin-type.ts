
export declare interface Admin { 
    user: {
        id: number
        name: string,
        email: string
    }
    authority: {
        id: number
        name: string,
        permissions: {[key: string]: boolean},
        slug
    },
    roles?: {id?: number, name: string, permissions: {[key: string]: boolean}, slug: string, created_at?: string, updated_at?: string}[],
}
