
export declare interface User {
    id: number
    name: string,
    email: string,
    avatar?: string,
    about?: string,
    area?: string,
    city?: string,
    tel?: string,
    created_at?: string,
    forbidden?: boolean,
    deleted_at?: boolean | null
    updated_at?: string,
    customer?: {} | boolean,
    events?: {} | boolean
}


