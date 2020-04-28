export declare interface Message {
    id: number,
    user_id?: number | null,
    name: string,
    title: string,
    email: string,
    body: string,
    date: string,

    replay?: Replay[],

    created_at?: string,
    deleted_at?: boolean | null,
    updated_at?: string,

}

export declare interface Replay {
    
    id: number,
    user_id?: number | null,
    message_id: number,
    content: string,
    
    created_at: string,
    updated_at: string,

}