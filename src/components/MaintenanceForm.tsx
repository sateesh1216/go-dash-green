import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MaintenanceFormData, Maintenance } from '@/types/maintenance';
import { Wrench, Save, X } from 'lucide-react';

interface MaintenanceFormProps {
  onSubmit: (data: MaintenanceFormData) => void;
  editingMaintenance?: Maintenance | null;
  onCancelEdit?: () => void;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ 
  onSubmit, 
  editingMaintenance, 
  onCancelEdit 
}) => {
  const [formData, setFormData] = useState<MaintenanceFormData>({
    date: new Date().toISOString().split('T')[0],
    maintenanceType: '',
    maintenanceCost: 0,
    kmAtMaintenance: 0,
    nextOilChangeKm: 0,
    originalOdometerKm: 0,
  });

  useEffect(() => {
    if (editingMaintenance) {
      setFormData({
        date: editingMaintenance.date,
        maintenanceType: editingMaintenance.maintenanceType,
        maintenanceCost: editingMaintenance.maintenanceCost,
        kmAtMaintenance: editingMaintenance.kmAtMaintenance,
        nextOilChangeKm: editingMaintenance.nextOilChangeKm,
        originalOdometerKm: editingMaintenance.originalOdometerKm,
      });
    }
  }, [editingMaintenance]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!editingMaintenance) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        maintenanceType: '',
        maintenanceCost: 0,
        kmAtMaintenance: 0,
        nextOilChangeKm: 0,
        originalOdometerKm: 0,
      });
    }
  };

  const handleInputChange = (field: keyof MaintenanceFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const maintenanceTypes = [
    'Oil Change',
    'Tire Replacement',
    'Brake Service',
    'Engine Repair',
    'Transmission Service',
    'Battery Replacement',
    'AC Service',
    'General Service',
    'Other'
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-dashboard-form-header">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Wrench className="w-5 h-5" />
          {editingMaintenance ? 'Edit Maintenance' : 'Add Car Maintenance'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maintenanceType">Maintenance Type *</Label>
            <Select 
              value={formData.maintenanceType} 
              onValueChange={(value) => handleInputChange('maintenanceType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select maintenance type" />
              </SelectTrigger>
              <SelectContent>
                {maintenanceTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maintenanceCost">Maintenance Cost (₹) *</Label>
            <Input
              id="maintenanceCost"
              type="number"
              min="0"
              step="0.01"
              value={formData.maintenanceCost || ''}
              onChange={(e) => handleInputChange('maintenanceCost', parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kmAtMaintenance">KM at Maintenance *</Label>
            <Input
              id="kmAtMaintenance"
              type="number"
              min="0"
              value={formData.kmAtMaintenance || ''}
              onChange={(e) => handleInputChange('kmAtMaintenance', parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextOilChangeKm">Next Oil Change KM</Label>
            <Input
              id="nextOilChangeKm"
              type="number"
              min="0"
              value={formData.nextOilChangeKm || ''}
              onChange={(e) => handleInputChange('nextOilChangeKm', parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="originalOdometerKm">Original Odometer KM</Label>
            <Input
              id="originalOdometerKm"
              type="number"
              min="0"
              value={formData.originalOdometerKm || ''}
              onChange={(e) => handleInputChange('originalOdometerKm', parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="col-span-full flex gap-3 pt-4">
            <Button type="submit" className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {editingMaintenance ? 'Update Maintenance' : 'Add Maintenance'}
            </Button>
            {editingMaintenance && onCancelEdit && (
              <Button type="button" variant="outline" onClick={onCancelEdit}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MaintenanceForm;