import { Observable } from 'rxjs';
import { AuthTokens } from 'src/app/types/auth-token-type';
import { Admin, AdminUserFields, AdminUser } from 'src/app/types/admin-type';
import { User, UserFields } from 'src/app/types/user-type';

export declare interface Auth {
    login(credential:{name: string, email: string, password: string}): Observable<User | Admin  | boolean>,
    logout(user: AdminUser | UserFields): Observable<{} | boolean>,
    register(user: UserFields): Observable<User | Admin  | boolean> ,
    authCheck(): boolean,
    // getAuthenticated(token:AuthTokens, cbk: CallableFunction):void,
    setAuth(tokens:AuthTokens): void,
    auth(): this,
    isAdmin(user: User| Admin): boolean
}