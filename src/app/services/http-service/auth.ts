import { AuthToken } from 'src/app/types/auth-token-type';
import { Admin } from 'src/app/types/admin-type';
import { User } from 'src/app/types/user-type';
export declare interface Auth {
    login(credential:{name: string, email: string, password: string}, cbk?: CallableFunction ): User | boolean,
    logout(): boolean,
    register(): boolean,
    check(): boolean,
    getAuthenticated(token:AuthToken, cbk: CallableFunction):void,
    setAuth(tokens:AuthToken): void,
    auth(): this,
    isAdmin(user: User| Admin): boolean
}