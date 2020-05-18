import { User } from 'src/app/types/user-type';

export declare interface Admin {
    admin: AdminUser
}
/* 
{ 
        user: AdminUserFields,
        authority: Authority,
        roles?: Roles[]
    }
*/
export declare interface AdminUser {
    user: AdminUserFields,
    authority: Authority,
    roles?: Roles[],
    activeted?: boolean,
    avatar?: string,
}

export declare interface AdminUserFields {
    id: number,
    name: string,
    email: string,
    avatar?: string,
    deleted_at: string | null
    created_at?: string,
    updated_at?: string
}

export declare interface Authority {
    id: number
    name: string,
    permissions: { [key: string]: boolean },
    slug: string
}

export declare interface Roles {
    id?: number,
    name: string,
    permissions: {
        [key: string]: boolean
    },
    slug: string,
    created_at?: string,
    updated_at?: string
}