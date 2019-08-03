import { ElementRef, OnInit, Injectable } from '@angular/core';

import { CustomerPreviewComponent } from '../customers-views/customer-preview/customer-preview.component';
import { CustomerEditComponent } from '../customers-views/customer-edit/customer-edit.component';
import { PostPreviewComponent } from '../posts-views/post-preview/post-preview.component';
import { PostEditComponent } from '../posts-views/post-edit/post-edit.component';
import { EventPreviewComponent } from '../events-views/event-preview/event-preview.component'
import { EventEditComponent } from '../events-views/event-edit/event-edit.component'
import { AdminProfileComponent } from '../admins-views/admin-profile/admin-profile.component';
import { AdminCreateComponent } from '../admins-views/admin-create/admin-create.component';
import { UserProfileComponent } from '../users-views/user-profile/user-profile.component';
import { UserCreateComponent } from '../users-views/user-create/user-create.component';
import { CustomerCreateComponent } from '../customers-views/customer-create/customer-create.component';
import { PostCreateComponent } from '../posts-views/post-create/post-create.component';
import { EventCreateComponent } from '../events-views/event-create/event-create.component';
import { AdminEditComponent } from '../admins-views/admin-edit/admin-edit.component';
import { UserEditComponent } from '../users-views/user-edit/user-edit.component';
// import { AdminCreate }

@Injectable()
export class CompLists {
    private compenentLists: {} = {
        customers: {
            preview: CustomerPreviewComponent,
            edit: CustomerEditComponent,
            create: CustomerCreateComponent
        },
        blog: {
            preview: PostPreviewComponent,
            edit: PostEditComponent,
            create: PostCreateComponent
        },
        events: {
            preview: EventPreviewComponent,
            edit: EventEditComponent,
            create: EventCreateComponent
        },
        admins: {
            preview: AdminProfileComponent,
            edit: AdminEditComponent,
            create: AdminCreateComponent
        },
        users: {
            preview: UserProfileComponent,
            edit: UserEditComponent,
            create: UserCreateComponent
        }
    };

    public getComp(resource: string, comp: string){
        return this.compenentLists[resource][comp];
    }
}
