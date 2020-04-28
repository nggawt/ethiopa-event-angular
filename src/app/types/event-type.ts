export declare interface Evt {
    
    id: number,
    user_id?: number,
    name: string,
    email: string,
    eventType: string,
    date: string,
    description: string,

    address?: string,
    phone?: string,
    location?: string,

    confirmed?: boolean,
    forbidden?: boolean | true,

    updated_at?: string,
    created_at?: string,
    deleted_at?: boolean | null
}