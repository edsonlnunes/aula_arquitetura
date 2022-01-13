export interface User {
  uid: string;
  uidProfile: string;
  name: string;
  email: string;
  document: string;
  password?: string;
  phone: string;
  enable: boolean;
}
