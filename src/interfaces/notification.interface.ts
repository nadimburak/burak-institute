export type NotificationType = "error" | "success" | "info" | "warning";
export interface Notification {
    type: NotificationType;
    message: string;
}