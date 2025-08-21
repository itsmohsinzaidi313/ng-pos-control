import { Branch } from "./branch";
import { User } from "./user";

export interface Restaurant {
    Name: string;
    UniqueId: string;
    Branches?: Branch[];
    Users?: User[]
}
