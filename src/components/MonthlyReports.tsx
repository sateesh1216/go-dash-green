import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trip } from '@/types/trip';
import { Maintenance } from '@/types/maintenance';
import { CalendarDays, Mail, MessageSquare, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

interface MonthlyReportsProps {
  trips: Trip[];
  maintenanceRecords: Maintenance[];
}

const MonthlyReports: React.FC<MonthlyReportsProps> = ({ trips, maintenanceRecords }) => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('2024');
  const { toast } = useToast();

  // Generate months and years for dropdown
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const years = ['2024', '2023', '2022', '2021'];

  const monthlyData = useMemo(() => {
    if (!selectedMonth || !selectedYear) return null;

    const filterDate = `${selectedYear}-${selectedMonth}`;
    
    const monthTrips = trips.filter(trip => 
      trip.date.startsWith(filterDate)
    );
    
    const monthMaintenance = maintenanceRecords.filter(record => 
      record.date.startsWith(filterDate)
    );

    const totalTrips = monthTrips.length;
    const totalTripMoney = monthTrips.reduce((sum, trip) => sum + trip.tripAmount, 0);
    const totalExpenses = monthTrips.reduce((sum, trip) => sum + trip.driverAmount + trip.fuel + trip.tolls, 0);
    const totalProfit = monthTrips.reduce((sum, trip) => sum + trip.totalProfit, 0);
    const totalMaintenanceCost = monthMaintenance.reduce((sum, record) => sum + record.maintenanceCost, 0);

    return {
      monthTrips,
      monthMaintenance,
      totalTrips,
      totalTripMoney,
      totalExpenses,
      totalProfit,
      totalMaintenanceCost,
      netProfit: totalProfit - totalMaintenanceCost
    };
  }, [selectedMonth, selectedYear, trips, maintenanceRecords]);

  const exportMonthlyReport = () => {
    if (!monthlyData) return;

    const reportData = {
      'Summary': [{
        'Month': `${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}`,
        'Total Trips': monthlyData.totalTrips,
        'Total Trip Money (₹)': monthlyData.totalTripMoney,
        'Total Expenses (₹)': monthlyData.totalExpenses,
        'Total Profit (₹)': monthlyData.totalProfit,
        'Maintenance Cost (₹)': monthlyData.totalMaintenanceCost,
        'Net Profit (₹)': monthlyData.netProfit
      }],
      'Trips': monthlyData.monthTrips.map((trip, index) => ({
        'S.No': index + 1,
        'Date': trip.date,
        'Driver': trip.driverName,
        'Route': `${trip.from} → ${trip.to}`,
        'Company': trip.company,
        'Trip Amount (₹)': trip.tripAmount,
        'Profit (₹)': trip.totalProfit
      })),
      'Maintenance': monthlyData.monthMaintenance.map((record, index) => ({
        'S.No': index + 1,
        'Date': record.date,
        'Type': record.maintenanceType,
        'Cost (₹)': record.maintenanceCost,
        'KM': record.kmAtMaintenance
      }))
    };

    const workbook = XLSX.utils.book_new();
    
    Object.entries(reportData).forEach(([sheetName, data]) => {
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    const fileName = `monthly_report_${selectedYear}_${selectedMonth}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const sendEmailReport = () => {
    // This would integrate with backend email service
    toast({
      title: "Email Feature",
      description: "Email functionality requires backend integration with Supabase.",
      variant: "default",
    });
  };

  const sendWhatsAppReport = () => {
    // This would integrate with WhatsApp API
    toast({
      title: "WhatsApp Feature",
      description: "WhatsApp notifications require backend integration with Supabase.",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-dashboard-form-header">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Monthly Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Month</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Year</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {monthlyData && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Trips</h3>
                    <p className="text-2xl font-bold text-primary">{monthlyData.totalTrips}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Trip Revenue</h3>
                    <p className="text-2xl font-bold text-info">₹{monthlyData.totalTripMoney.toFixed(2)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Maintenance Cost</h3>
                    <p className="text-2xl font-bold text-warning">₹{monthlyData.totalMaintenanceCost.toFixed(2)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Net Profit</h3>
                    <p className={`text-2xl font-bold ${
                      monthlyData.netProfit >= 0 ? 'text-dashboard-profit-positive' : 'text-dashboard-profit-negative'
                    }`}>
                      ₹{monthlyData.netProfit.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button onClick={exportMonthlyReport} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Report
                </Button>
                <Button onClick={sendEmailReport} variant="outline" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Send via Email
                </Button>
                <Button onClick={sendWhatsAppReport} variant="outline" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Send via WhatsApp
                </Button>
              </div>
            </div>
          )}

          {!selectedMonth && (
            <p className="text-center text-muted-foreground py-8">
              Please select a month and year to view the report.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyReports;