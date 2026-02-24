
export enum UserType {
  Student = 'Student',
  Individual = 'Individual',
  Startups = 'Startups',
  Corporate = 'Corporate',
  Workshop = 'Workshop'
}

export enum MachineType {
  LaserCutting = 'Laser Cutting',
  ThreeDPrinting = '3D Printing',
  CNCMilling = 'CNC Milling'
}

export interface ComponentItem {
  id: string;
  name: string;
  description: string;
  machine: MachineType;
  quantity: number;
  material: string;
  fileName?: string;
  file?: File;
}

export interface JobFormData {
  email: string;
  fullName: string;
  phone: string;
  shippingAddress: string;
  city: string;
  state: string;
  zipCode: string;
  isBillingSame: boolean;
  billingAddress: string;
  userType: UserType;
  projectName: string;
  components: ComponentItem[];
}
