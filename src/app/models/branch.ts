export interface Branch {
    Restaurant: string;
    RestaurantId: number;
    Name: string;
    Expiry: Date;
    UniqueId: string;
    Enabled: boolean;
    Deleted: boolean;
    SalesUploadService: boolean;
    OnlineOrdering: boolean;
    RegistrationDate: Date;
    DebugVersion: string;
    EnabledSystems: number;
    TotalSystems: number;
    TotalNotifications: number;
}
