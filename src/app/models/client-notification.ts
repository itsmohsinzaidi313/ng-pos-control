export class ClientNotification {
    NotificationId: number = 0;
    Level: number = 0;
    Title: string = '';
    Body: string = '';
    Validity?: Date;
    Enabled: boolean = false;
    Deleted: boolean = false;

    copyWith(NotificationId?: number, Level?: number, Title?: string, Body?: string, Validity?: Date, Enabled?: boolean, Deleted?: boolean): ClientNotification {
        let notification = new ClientNotification();
        notification.NotificationId = NotificationId ?? this.NotificationId;
        notification.Level = Level ?? this.Level;
        notification.Title = Title ?? this.Title;
        notification.Body = Body ?? this.Body;
        notification.Validity = Validity ?? this.Validity;
        notification.Enabled = Enabled ?? this.Enabled;
        notification.Deleted = Deleted ?? this.Deleted;
        return notification;
    }
}