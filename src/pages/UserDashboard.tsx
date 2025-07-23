import React, { useState } from 'react';
import { TripFormData } from '@/types/trip';
import { User } from '@/types/auth';
import TripForm from '@/components/TripForm';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, CheckCircle, Plus } from 'lucide-react';

interface UserDashboardProps {
  user: User;
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, onLogout }) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { toast } = useToast();

  const calculateTotalProfit = (formData: TripFormData): number => {
    return formData.tripAmount - formData.driverAmount - formData.fuel - formData.tolls - formData.commission;
  };

  const handleAddTrip = (formData: TripFormData) => {
    // In a real app, this would send data to backend
    console.log('Trip submitted:', formData);
    
    toast({
      title: "Trip Submitted Successfully!",
      description: "Your trip has been recorded and sent for processing.",
    });

    setShowSuccessMessage(true);
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Driver Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Welcome, {user.name}! Add your trip details below.
            </p>
          </div>
          <Button onClick={onLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <Card className="mb-6 border-dashboard-profit-positive bg-dashboard-profit-positive/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-dashboard-profit-positive" />
                <div>
                  <h3 className="font-semibold text-dashboard-profit-positive">
                    Trip Submitted Successfully!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your trip details have been recorded. Thank you for your submission.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions Card */}
        <Card className="mb-6 shadow-lg">
          <CardHeader className="bg-dashboard-form-header">
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Trip
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-info/10 border border-info/20 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-info mb-2">Instructions:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Fill in all required fields accurately</li>
                <li>• Total profit will be calculated automatically</li>
                <li>• Double-check all amounts before submitting</li>
                <li>• Contact admin if you need to modify submitted trips</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Trip Form */}
        <TripForm 
          onSubmit={handleAddTrip} 
          editingTrip={null}
          onCancelEdit={() => {}}
        />

        {/* Footer Info */}
        <Card className="mt-8 shadow-lg">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Need help or have questions? Contact your administrator.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              For trip modifications or reports, please contact the admin team.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;