export interface ClientNotification {
    Id: number;
    Level: number;
    Title: string;
    Body: string;
    Validity: Date;
    Enabled: boolean;
    Deleted: boolean;
}