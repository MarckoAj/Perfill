export interface UserType {
  userTypeId: number;
  description: string;
}

export interface BasePoint {
  address: string;
  latitude: number;
  longitude: number;
}

export interface MonitoringNotification {
  gpsActivation: number;
  gpsDisabling: number;
  appLogin: number;
  appLogout: number;
}

export interface EmployeeNotification {
  basePointChange: number;
}

export interface ClientNotification {
  addressChange: number;
}

export interface TaskNotification {
  checkout: number;
  checkIn: number;
  rescheduling: number;
  travelStart: number;
  researchAnswer: number;
  delay: number;
  taskDelete: number;
}

export interface User {
  userID: number;
  externalId: string;
  name: string;
  smartPhoneNumber: string;
  login: string;
  email: string;
  culture: string;
  jobPosition: string;
  userType: UserType;
  address: string;
  latitude: number;
  longitude: number;
  workDaysOfWeek: number[];
  startWorkHour: string;
  endWorkHour: string;
  startLunchHour: string;
  endLunchHour: string;
  hourValue: number;
  pictureUrl: string;
  basePoint: BasePoint;
  openTaskInPlace: boolean;
  grabGalleryPhotos: boolean;
  gpsFrequency: number;
  checkInManual: boolean;
  unavailableForTasks: boolean;
  editTaskAfterCheckout: boolean;
  informStartTravel: boolean;
  changeBasePoint: boolean;
  registrationDate: string;
  monitoringNotification: MonitoringNotification;
  employeeNotification: EmployeeNotification;
  clientNotification: ClientNotification;
  taskNotification: TaskNotification;
}

export interface UserRefactored {
  userId: number;
  externalId?: string;
  name?: string;
  login?: string;
  email?: string;
  jobPosition?: string;
  fk_userType?: number;
  address?: string;
  registrationDate?: string;
  active: boolean;
}

export interface Group {
  id: number;
  description: string;
}

export interface CustomerGroup extends Omit<Group, 'id'> {
  groupId: number;
}

export interface Segment {
  id: number;
  description: string;
  registrationDate: string | null;
}

export interface CustomerSegment extends Omit<Segment, 'id'> {
  segmentId: number;
}
