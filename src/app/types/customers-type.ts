
export declare interface Customers {
    customers: {
        [key:string]: Customer[] 
    }
}

export declare interface Customer {
    customer: CustomerFields,
    gallery: Gallery
}

export declare interface Gallery {
    images: string[],
    videos: string[]
}

export declare interface CustomerFields {
    id: number,
    user_id: number,
    company: string,
    email: string,
    loggo: string,
    title: string,
    contact: string,
    address: string,
    businessType: string,
    deals: string,
    tel?: string,
    ​​​​
    content?: string | null,
    confirmed: boolean,
    created_at?: string,
}