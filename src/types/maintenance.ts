export interface Maintenance {
  id: string;
  date: string;
  maintenanceType: string;
  maintenanceCost: number;
  kmAtMaintenance: number;
  nextOilChangeKm: number;
  originalOdometerKm: number;
}

export interface MaintenanceFormData {
  date: string;
  maintenanceType: string;
  maintenanceCost: number;
  kmAtMaintenance: number;
  nextOilChangeKm: number;
  originalOdometerKm: number;
}