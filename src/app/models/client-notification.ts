export interface ClientNotification {
    NotificationId: number;
    Level: number;
    Title: string;
    Body: string;
    Validity?: Date;
    Enabled: boolean;
    Deleted: boolean;
}