import { Software } from "./software";

export interface Branch {
    Name: string;
    Expiry: Date;
    UniqueId: string;
    Enabled: boolean;
    Debugs: Software[]
}
