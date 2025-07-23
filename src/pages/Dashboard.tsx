import React, { useState } from 'react';
import { Trip, TripFormData } from '@/types/trip';
import TripForm from '@/components/TripForm';
import SummaryCards from '@/components/SummaryCards';
import TripsTable from '@/components/TripsTable';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const { toast } = useToast();

  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const calculateTotalProfit = (formData: TripFormData): number => {
    return formData.tripAmount - formData.driverAmount - formData.fuel - formData.tolls + formData.commission;
  };

  const handleAddTrip = (formData: TripFormData) => {
    if (editingTrip) {
      // Update existing trip
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
      // Add new trip
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

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTrip = (id: string) => {
    setTrips(prev => prev.filter(trip => trip.id !== id));
    toast({
      title: "Trip Deleted",
      description: "Trip has been successfully deleted.",
      variant: "destructive",
    });
  };

  const handleCancelEdit = () => {
    setEditingTrip(null);
  };

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Taxi Service Trip Management
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your trips, track expenses, and monitor profits
          </p>
        </div>

        {/* Summary Cards */}
        <SummaryCards trips={trips} />

        {/* Trip Form */}
        <TripForm 
          onSubmit={handleAddTrip} 
          editingTrip={editingTrip}
          onCancelEdit={handleCancelEdit}
        />

        {/* Trips Table */}
        <TripsTable 
          trips={trips}
          onEdit={handleEditTrip}
          onDelete={handleDeleteTrip}
        />
      </div>
    </div>
  );
};

export default Dashboard;