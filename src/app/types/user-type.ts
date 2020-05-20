import { AdminUser } from 'src/app/types/admin-type';

export declare interface Users {
    user: UserFields,
    admin?: AdminUser
}

export declare interface User {
    user: UserFields
}

export declare interface UserFields {
    id: number
    name: string,
    email: string,
    avatar?: string,

    about?: string,
    area?: string,
    city?: string,
    tel?: string,

    activeted: boolean,

    forbidden?: boolean,
    customer?: {} | boolean,
    events?: {} | boolean,

    created_at?: string,
    deleted_at?: boolean | null
    updated_at?: string,
}

export declare interface UserTypeCommons {
    id: number
    name: string,
    email: string,
    avatar?: string,
    created_at?: string,
    deleted_at?: boolean | null
    updated_at?: string,

}