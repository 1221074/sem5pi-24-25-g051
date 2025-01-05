export interface SurgeryRoom {
  roomNumber: number;
  type: string;
  capacity: string;
  assignedEquipment: string[];
  currentStatus: string;
  maintenanceSlots: string[];
}
