export declare interface MessageModel {
    id: string,
    url: string,
    modalSize: string,
    nameFrom: string | boolean,
    nameTo: string,
    emailTo: string | boolean,
    emailFrom: string | boolean,
    title: string,
    inputs: {
        email_from: boolean,
        email_to: boolean,
        name: boolean,
        area: boolean,
        phone: boolean,
        city: boolean,
        subject: boolean,
        message: boolean,
    }
}