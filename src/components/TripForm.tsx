import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TripFormData, Trip } from '@/types/trip';
import { Plus, Edit3 } from 'lucide-react';

interface TripFormProps {
  onSubmit: (data: TripFormData) => void;
  editingTrip?: Trip | null;
  onCancelEdit?: () => void;
}

const TripForm: React.FC<TripFormProps> = ({ onSubmit, editingTrip, onCancelEdit }) => {
  const [formData, setFormData] = useState<TripFormData>({
    date: new Date().toISOString().split('T')[0],
    driverName: '',
    from: '',
    to: '',
    company: '',
    driverAmount: 0,
    commission: 0,
    fuelType: '',
    paymentMode: '',
    fuel: 0,
    tolls: 0,
    tripAmount: 0,
  });

  const [calculatedProfit, setCalculatedProfit] = useState<number>(0);

  useEffect(() => {
    if (editingTrip) {
      setFormData({
        date: editingTrip.date,
        driverName: editingTrip.driverName,
        from: editingTrip.from,
        to: editingTrip.to,
        company: editingTrip.company,
        driverAmount: editingTrip.driverAmount,
        commission: editingTrip.commission,
        fuelType: editingTrip.fuelType,
        paymentMode: editingTrip.paymentMode,
        fuel: editingTrip.fuel,
        tolls: editingTrip.tolls,
        tripAmount: editingTrip.tripAmount,
      });
    }
  }, [editingTrip]);

  useEffect(() => {
    // Real-time profit calculation
    const profit = formData.tripAmount - formData.driverAmount - formData.fuel - formData.tolls + formData.commission;
    setCalculatedProfit(profit);
  }, [formData.tripAmount, formData.driverAmount, formData.fuel, formData.tolls, formData.commission]);

  const handleInputChange = (field: keyof TripFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!editingTrip) {
      // Reset form only for new trips
      setFormData({
        date: new Date().toISOString().split('T')[0],
        driverName: '',
        from: '',
        to: '',
        company: '',
        driverAmount: 0,
        commission: 0,
        fuelType: '',
        paymentMode: '',
        fuel: 0,
        tolls: 0,
        tripAmount: 0,
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      driverName: '',
      from: '',
      to: '',
      company: '',
      driverAmount: 0,
      commission: 0,
      fuelType: '',
      paymentMode: '',
      fuel: 0,
      tolls: 0,
      tripAmount: 0,
    });
    onCancelEdit?.();
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          {editingTrip ? <Edit3 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          {editingTrip ? 'Edit Trip' : 'Add New Trip'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="driverName">Driver Name</Label>
            <Input
              id="driverName"
              value={formData.driverName}
              onChange={(e) => handleInputChange('driverName', e.target.value)}
              placeholder="Enter driver name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="from">From</Label>
            <Input
              id="from"
              value={formData.from}
              onChange={(e) => handleInputChange('from', e.target.value)}
              placeholder="Starting location"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              value={formData.to}
              onChange={(e) => handleInputChange('to', e.target.value)}
              placeholder="Destination"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder="Company name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="driverAmount">Driver Amount (₹)</Label>
            <Input
              id="driverAmount"
              type="number"
              value={formData.driverAmount}
              onChange={(e) => handleInputChange('driverAmount', parseFloat(e.target.value) || 0)}
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="commission">Commission (₹)</Label>
            <Input
              id="commission"
              type="number"
              value={formData.commission}
              onChange={(e) => handleInputChange('commission', parseFloat(e.target.value) || 0)}
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fuelType">Fuel Type</Label>
            <Select value={formData.fuelType} onValueChange={(value) => handleInputChange('fuelType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="petrol">Petrol</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="cng">CNG</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMode">Payment Mode</Label>
            <Select value={formData.paymentMode} onValueChange={(value) => handleInputChange('paymentMode', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fuel">Fuel Cost (₹)</Label>
            <Input
              id="fuel"
              type="number"
              value={formData.fuel}
              onChange={(e) => handleInputChange('fuel', parseFloat(e.target.value) || 0)}
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tolls">Tolls (₹)</Label>
            <Input
              id="tolls"
              type="number"
              value={formData.tolls}
              onChange={(e) => handleInputChange('tolls', parseFloat(e.target.value) || 0)}
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tripAmount">Trip Amount (₹)</Label>
            <Input
              id="tripAmount"
              type="number"
              value={formData.tripAmount}
              onChange={(e) => handleInputChange('tripAmount', parseFloat(e.target.value) || 0)}
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3 flex items-center justify-between p-4 bg-accent rounded-lg">
            <div className="text-lg font-semibold">
              Calculated Profit: 
              <span className={`ml-2 ${calculatedProfit >= 0 ? 'text-dashboard-profit-positive' : 'text-dashboard-profit-negative'}`}>
                ₹{calculatedProfit.toFixed(2)}
              </span>
            </div>
            <div className="flex gap-2">
              {editingTrip && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {editingTrip ? 'Update Trip' : 'Add Trip'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TripForm;