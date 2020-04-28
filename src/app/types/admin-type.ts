import { User } from 'src/app/types/user-type';

export declare interface Admin {
    user: User,
    authority: Authority,
    roles?: Roles[],
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