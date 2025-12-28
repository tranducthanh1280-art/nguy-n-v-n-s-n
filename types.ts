
export enum VisitStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Visitor {
  id: string;
  fullName: string;
  phoneNumber: string;
  hostName: string;
  purpose: string;
  visitDateTime: string;
  status: VisitStatus;
  createdAt: number;
}

export interface AdminUser {
  isAuthenticated: boolean;
  username: string;
}
