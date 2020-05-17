export declare interface AuthTokens {
    [key: string]: {
        [key: string]: string | boolean,
        token?: string,
        acivated?: boolean
    }
}