import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trip } from '@/types/trip';
import { Edit, Trash2, Search, Download, ArrowUpDown } from 'lucide-react';
import * as XLSX from 'xlsx';

interface TripsTableProps {
  trips: Trip[];
  onEdit: (trip: Trip) => void;
  onDelete: (id: string) => void;
}

const TripsTable: React.FC<TripsTableProps> = ({ trips, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Trip>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Trip) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedTrips = trips
    .filter(trip =>
      trip.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.company.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

  const exportToExcel = () => {
    const exportData = trips.map((trip, index) => ({
      'S.No': index + 1,
      'Date': trip.date,
      'Driver': trip.driverName,
      'From': trip.from,
      'To': trip.to,
      'Company': trip.company,
      'Driver Amount (₹)': trip.driverAmount,
      'Commission (₹)': trip.commission,
      'Fuel Type': trip.fuelType,
      'Payment Mode': trip.paymentMode,
      'Fuel Cost (₹)': trip.fuel,
      'Tolls (₹)': trip.tolls,
      'Trip Amount (₹)': trip.tripAmount,
      'Profit (₹)': trip.totalProfit
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trips');
    
    const fileName = `taxi_trips_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const SortableHeader = ({ field, children }: { field: keyof Trip; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-dashboard-table-header transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className="h-3 w-3" />
      </div>
    </TableHead>
  );

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-dashboard-table-header">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-xl font-semibold">All Trips</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search trips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export to Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">S.No</TableHead>
                <SortableHeader field="date">Date</SortableHeader>
                <SortableHeader field="driverName">Driver</SortableHeader>
                <TableHead>Route</TableHead>
                <SortableHeader field="company">Company</SortableHeader>
                <SortableHeader field="driverAmount">Driver ₹</SortableHeader>
                <SortableHeader field="commission">Commission ₹</SortableHeader>
                <SortableHeader field="fuelType">Fuel Type</SortableHeader>
                <SortableHeader field="paymentMode">Payment</SortableHeader>
                <SortableHeader field="fuel">Fuel ₹</SortableHeader>
                <SortableHeader field="tolls">Tolls ₹</SortableHeader>
                <SortableHeader field="tripAmount">Trip ₹</SortableHeader>
                <SortableHeader field="totalProfit">Profit ₹</SortableHeader>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedTrips.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={14} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'No trips found matching your search.' : 'No trips added yet. Add your first trip above.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedTrips.map((trip, index) => (
                  <TableRow key={trip.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{new Date(trip.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{trip.driverName}</TableCell>
                    <TableCell>
                      <span className="text-sm">{trip.from} → {trip.to}</span>
                    </TableCell>
                    <TableCell>{trip.company}</TableCell>
                    <TableCell>₹{trip.driverAmount.toFixed(2)}</TableCell>
                    <TableCell>₹{trip.commission.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className="capitalize bg-secondary px-2 py-1 rounded-full text-xs">
                        {trip.fuelType}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize bg-accent px-2 py-1 rounded-full text-xs">
                        {trip.paymentMode.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>₹{trip.fuel.toFixed(2)}</TableCell>
                    <TableCell>₹{trip.tolls.toFixed(2)}</TableCell>
                    <TableCell className="font-medium">₹{trip.tripAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        trip.totalProfit >= 0 
                          ? 'text-dashboard-profit-positive' 
                          : 'text-dashboard-profit-negative'
                      }`}>
                        ₹{trip.totalProfit.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit(trip)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDelete(trip.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripsTable;