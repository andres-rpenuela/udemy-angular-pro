export interface UserInfo {
  id: string;
  name: string;
  email: string;
  roles: string[];
  hasNotifications: boolean;
  privileges?: string[];
}
