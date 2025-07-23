import React, { useState } from 'react';
import { Trip, TripFormData } from '@/types/trip';
import { Maintenance, MaintenanceFormData } from '@/types/maintenance';
import { User } from '@/types/auth';
import TripForm from '@/components/TripForm';
import MaintenanceForm from '@/components/MaintenanceForm';
import SummaryCards from '@/components/SummaryCards';
import TripsTable from '@/components/TripsTable';
import MaintenanceTable from '@/components/MaintenanceTable';
import ExcelUpload from '@/components/ExcelUpload';
import MonthlyReports from '@/components/MonthlyReports';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, Car, Wrench, Upload, BarChart, Settings } from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<Maintenance[]>([]);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [editingMaintenance, setEditingMaintenance] = useState<Maintenance | null>(null);
  const { toast } = useToast();

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const calculateTotalProfit = (formData: TripFormData): number => {
    return formData.tripAmount - formData.driverAmount - formData.fuel - formData.tolls - formData.commission;
  };

  const handleAddTrip = (formData: TripFormData) => {
    if (editingTrip) {
      const updatedTrip: Trip = {
        ...editingTrip,
        ...formData,
        totalProfit: calculateTotalProfit(formData)
      };
      
      setTrips(prev => prev.map(trip => 
        trip.id === editingTrip.id ? updatedTrip : trip
      ));
      
      setEditingTrip(null);
      toast({
        title: "Trip Updated",
        description: "Trip has been successfully updated.",
      });
    } else {
      const newTrip: Trip = {
        id: generateId(),
        ...formData,
        totalProfit: calculateTotalProfit(formData)
      };
      
      setTrips(prev => [...prev, newTrip]);
      toast({
        title: "Trip Added",
        description: "New trip has been successfully added.",
      });
    }
  };

  const handleAddMaintenance = (formData: MaintenanceFormData) => {
    if (editingMaintenance) {
      const updatedMaintenance: Maintenance = {
        ...editingMaintenance,
        ...formData
      };
      
      setMaintenanceRecords(prev => prev.map(record => 
        record.id === editingMaintenance.id ? updatedMaintenance : record
      ));
      
      setEditingMaintenance(null);
      toast({
        title: "Maintenance Updated",
        description: "Maintenance record has been successfully updated.",
      });
    } else {
      const newMaintenance: Maintenance = {
        id: generateId(),
        ...formData
      };
      
      setMaintenanceRecords(prev => [...prev, newMaintenance]);
      toast({
        title: "Maintenance Added",
        description: "New maintenance record has been successfully added.",
      });
    }
  };

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
  };

  const handleDeleteTrip = (id: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== id));
    toast({
      title: "Trip Deleted",
      description: "Trip has been successfully deleted.",
      variant: "destructive",
    });
  };

  const handleEditMaintenance = (maintenance: Maintenance) => {
    setEditingMaintenance(maintenance);
  };

  const handleDeleteMaintenance = (id: string) => {
    setMaintenanceRecords(prev => prev.filter(record => record.id !== id));
    toast({
      title: "Maintenance Deleted",
      description: "Maintenance record has been successfully deleted.",
      variant: "destructive",
    });
  };

  const handleTripsUpload = (uploadedTrips: any[]) => {
    const newTrips: Trip[] = uploadedTrips.map(tripData => ({
      id: generateId(),
      date: tripData.Date || tripData.date || '',
      driverName: tripData['Driver Name'] || tripData.driverName || '',
      from: tripData.From || tripData.from || '',
      to: tripData.To || tripData.to || '',
      company: tripData.Company || tripData.company || '',
      driverAmount: Number(tripData['Driver Amount'] || tripData.driverAmount || 0),
      commission: Number(tripData.Commission || tripData.commission || 0),
      fuelType: tripData['Fuel Type'] || tripData.fuelType || 'petrol',
      paymentMode: tripData['Payment Mode'] || tripData.paymentMode || 'cash',
      fuel: Number(tripData.Fuel || tripData.fuel || 0),
      tolls: Number(tripData.Tolls || tripData.tolls || 0),
      tripAmount: Number(tripData['Trip Amount'] || tripData.tripAmount || 0),
      totalProfit: 0 // Will be calculated
    }));

    // Calculate profit for each trip
    newTrips.forEach(trip => {
      trip.totalProfit = trip.tripAmount - trip.driverAmount - trip.fuel - trip.tolls - trip.commission;
    });

    setTrips(prev => [...prev, ...newTrips]);
  };

  const handleMaintenanceUpload = (uploadedMaintenance: any[]) => {
    const newMaintenance: Maintenance[] = uploadedMaintenance.map(maintenanceData => ({
      id: generateId(),
      date: maintenanceData.Date || maintenanceData.date || '',
      maintenanceType: maintenanceData['Maintenance Type'] || maintenanceData.maintenanceType || '',
      maintenanceCost: Number(maintenanceData['Maintenance Cost'] || maintenanceData.maintenanceCost || 0),
      kmAtMaintenance: Number(maintenanceData['KM at Maintenance'] || maintenanceData.kmAtMaintenance || 0),
      nextOilChangeKm: Number(maintenanceData['Next Oil Change KM'] || maintenanceData.nextOilChangeKm || 0),
      originalOdometerKm: Number(maintenanceData['Original Odometer KM'] || maintenanceData.originalOdometerKm || 0),
    }));

    setMaintenanceRecords(prev => [...prev, ...newMaintenance]);
  };

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Welcome back, {user.name}! Manage your taxi service operations.
            </p>
          </div>
          <Button onClick={onLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Summary Cards */}
        <SummaryCards trips={trips} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="trips" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="trips" className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              Trips
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Maintenance
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trips" className="space-y-6">
            <TripForm 
              onSubmit={handleAddTrip} 
              editingTrip={editingTrip}
              onCancelEdit={() => setEditingTrip(null)}
            />
            <TripsTable 
              trips={trips}
              onEdit={handleEditTrip}
              onDelete={handleDeleteTrip}
            />
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-6">
            <MaintenanceForm 
              onSubmit={handleAddMaintenance} 
              editingMaintenance={editingMaintenance}
              onCancelEdit={() => setEditingMaintenance(null)}
            />
            <MaintenanceTable 
              maintenanceRecords={maintenanceRecords}
              onEdit={handleEditMaintenance}
              onDelete={handleDeleteMaintenance}
            />
          </TabsContent>

          <TabsContent value="upload">
            <ExcelUpload 
              onTripsUpload={handleTripsUpload}
              onMaintenanceUpload={handleMaintenanceUpload}
            />
          </TabsContent>

          <TabsContent value="reports">
            <MonthlyReports 
              trips={trips}
              maintenanceRecords={maintenanceRecords}
            />
          </TabsContent>

          <TabsContent value="settings">
            <div className="text-center py-12">
              <Settings className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Settings & Notifications</h3>
              <p className="text-muted-foreground">
                Email and WhatsApp notification settings require backend integration with Supabase.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;