export interface Trip {
  id: string;
  date: string;
  driverName: string;
  from: string;
  to: string;
  company: string;
  driverAmount: number;
  commission: number;
  fuelType: string;
  paymentMode: string;
  fuel: number;
  tolls: number;
  tripAmount: number;
  totalProfit: number;
}

export interface TripFormData {
  date: string;
  driverName: string;
  from: string;
  to: string;
  company: string;
  driverAmount: number;
  commission: number;
  fuelType: string;
  paymentMode: string;
  fuel: number;
  tolls: number;
  tripAmount: number;
}