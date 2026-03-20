export interface AuvoResponse<T = unknown> {
  result: T;
}

export interface PagedList<T> {
  entityList: T[];
  pagedSearchReturnData: {
    order: number;
    pageSize: number;
    page: number;
    totalItems: number;
  };
  links: {
    href: string;
    rel: string;
    method: string;
  }[];
}

export interface UserType {
  userTypeId: number;
  description?: string;
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
  adressChange: number;
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

export interface AuvoUser {
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

export interface AuvoGroup {
  id: number;
  description: string;
}

export interface CustomerGroup extends Omit<AuvoGroup, 'id'> {
  groupId: number;
}

export interface AuvoSegment {
  id: number;
  description: string;
  registrationDate: string | null;
}

export interface AuvoCustomerSegment extends Omit<AuvoSegment, 'id'> {
  segmentId: number;
}

export interface AuvoCustomer {
  id: number;
  externalId?: string;
  description?: string;
  cpfCnpj?: string;
  phoneNumber?: string[];
  email?: string[];
  manager?: string;
  managerJobPosition?: string;
  note?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  maximumVisitTime?: number;
  unitMaximumTime?: number;
  groupsId?: number[];
  managerTeamsId?: number[];
  managersId?: number[];
  segmentId: number;
  active?: boolean;
  adressComplement?: string;
  creationDate?: string;
  contacts?: AuvoCustomerContact[];
  dateLastUpdate?: string;
  uriAttachments?: string[];
}

export interface AuvoCustomerContact {
  id: number;
  name: string;
  jobPosition: string;
  email: string;
  phone: string;
}

export interface CustomerRefactored {
  customerId: number;
  fk_segmentId: number;
  externalId?: string;
  description?: string;
  cpfCnpj?: string;
  manager?: string;
  note?: string;
  address?: string;
  addressComplement?: string;
  latitude?: number;
  longitude?: number;
  uriAttachments?: string[];
  active?: boolean;
  dateLastUpdate?: string;
  creationDate?: string;
}

export interface customer_emails {
  fk_customerId: number;
  customer_email: string;
}

export interface customer_groups {
  fk_customerId: number;
  fk_groupId: number;
}

export interface customer_contacts {
  contactId: number;
  fk_customerId: number;
  description: string;
  contactJobPosition: string;
  contactEmail: string;
  contactPhone: string;
  contactName: string;
}

export interface customer_URIattachments {
  fk_customerId: number;
  uri: string;
}

export interface customer_managers {
  fk_userId: number;
  fk_customerId: number;
}
