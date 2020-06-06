/* 
  export  interface MessegesSuccessInterface {
    success: MessegesGalleryInterface | MessegesLoggoInterface | MessegesVideoInterface;
  }
  
  export declare interface MessegesErrorsInterface {
    errors: MessegesGalleryInterface | MessegesLoggoInterface | MessegesVideoInterface | boolean;
  }
   */
  
  export type inputsMedia = (MessegesGalleryInterface | MessegesLoggoInterface | MessegesVideoInterface);
 

  export declare interface MessegesGalleryInterface {
    gallery:Array<messagesProps>;
  }
  
  export declare interface MessegesLoggoInterface {
    loggo:Array<messagesProps>;
  }
  
  export declare interface MessegesVideoInterface {
    video:Array<messagesProps>;
  }
  
  export declare interface MessegesFilesInterface {
    files:Array<messagesProps>;
  }

  export declare interface messagesProps {
    type: string;
    message?: string | number;
    // msgType?: string;
  }

  export declare interface MessegesKInterface {
    kk:Array<messagesProps>;
  }

/*   export declare interface MessegesattrInterface {
    attr:string;
  }

  export declare interface MessegesSizeInterface {
    size:string;
  }

  export declare interface MessegesMinFileInterface {
    minFile:string;
  }

  export declare interface MessegesTypeInterface {
    type:string; 
  }

  export declare interface MessegesuUknownErrorInterface {
    unknownError:string;
  }

  export declare interface MessegesFixErrorsInterface {
    fixErrors:string;
  }

  export declare interface MessegesUnchangeInterface {
    unchange:string; 
  }

  export declare interface MessegesMinCharLenInterface {
    minCharLen:string; 
  }

  export declare interface MessegesMaxCharLenInterface {
    maxCharLen:string; 
  } */
  
  /* declare interface messagesAttr {
    size?:string;
    minFile?:string;
    type?:string; 
    unknownError?:string;
    fixErrors?:string;
    unchange?:string; 
    minCharLen?:string; 
    maxCharLen?:string; 
  }
 */
  // type att = (size:string | minFile:string | type:string | unknownError:string | fixErrors:string | unchange:string | charLen:string); 