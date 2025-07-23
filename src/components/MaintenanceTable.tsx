import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Maintenance } from '@/types/maintenance';
import { Edit, Trash2, Search, Download, ArrowUpDown, Wrench } from 'lucide-react';
import * as XLSX from 'xlsx';

interface MaintenanceTableProps {
  maintenanceRecords: Maintenance[];
  onEdit: (maintenance: Maintenance) => void;
  onDelete: (id: string) => void;
}

const MaintenanceTable: React.FC<MaintenanceTableProps> = ({ 
  maintenanceRecords, 
  onEdit, 
  onDelete 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Maintenance>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Maintenance) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedRecords = maintenanceRecords
    .filter(record =>
      record.maintenanceType.toLowerCase().includes(searchTerm.toLowerCase())
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
    const exportData = maintenanceRecords.map((record, index) => ({
      'S.No': index + 1,
      'Date': record.date,
      'Maintenance Type': record.maintenanceType,
      'Cost (₹)': record.maintenanceCost,
      'KM at Maintenance': record.kmAtMaintenance,
      'Next Oil Change KM': record.nextOilChangeKm,
      'Original Odometer KM': record.originalOdometerKm
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Maintenance');
    
    const fileName = `car_maintenance_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const SortableHeader = ({ field, children }: { field: keyof Maintenance; children: React.ReactNode }) => (
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
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Maintenance Records
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search maintenance..."
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
                <SortableHeader field="maintenanceType">Type</SortableHeader>
                <SortableHeader field="maintenanceCost">Cost ₹</SortableHeader>
                <SortableHeader field="kmAtMaintenance">KM at Service</SortableHeader>
                <SortableHeader field="nextOilChangeKm">Next Oil Change</SortableHeader>
                <SortableHeader field="originalOdometerKm">Original KM</SortableHeader>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'No maintenance records found matching your search.' : 'No maintenance records added yet.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedRecords.map((record, index) => (
                  <TableRow key={record.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className="bg-secondary px-2 py-1 rounded-full text-xs">
                        {record.maintenanceType}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">₹{record.maintenanceCost.toFixed(2)}</TableCell>
                    <TableCell>{record.kmAtMaintenance.toLocaleString()} km</TableCell>
                    <TableCell>{record.nextOilChangeKm.toLocaleString()} km</TableCell>
                    <TableCell>{record.originalOdometerKm.toLocaleString()} km</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit(record)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDelete(record.id)}
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

export default MaintenanceTable;