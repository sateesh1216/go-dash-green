import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileSpreadsheet, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ExcelUploadProps {
  onTripsUpload: (trips: any[]) => void;
  onMaintenanceUpload: (maintenance: any[]) => void;
}

const ExcelUpload: React.FC<ExcelUploadProps> = ({ onTripsUpload, onMaintenanceUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File, type: 'trips' | 'maintenance') => {
    setIsUploading(true);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (type === 'trips') {
        onTripsUpload(jsonData);
      } else {
        onMaintenanceUpload(jsonData);
      }

      toast({
        title: "Upload Successful",
        description: `${jsonData.length} ${type} records uploaded successfully.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Please check your file format and try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = (type: 'trips' | 'maintenance') => {
    let templateData;
    let filename;

    if (type === 'trips') {
      templateData = [{
        Date: '2024-01-01',
        'Driver Name': 'John Doe',
        From: 'City A',
        To: 'City B',
        Company: 'ABC Company',
        'Driver Amount': 1000,
        Commission: 100,
        'Fuel Type': 'Petrol',
        'Payment Mode': 'Cash',
        Fuel: 200,
        Tolls: 50,
        'Trip Amount': 1500
      }];
      filename = 'trips_template.xlsx';
    } else {
      templateData = [{
        Date: '2024-01-01',
        'Maintenance Type': 'Oil Change',
        'Maintenance Cost': 500,
        'KM at Maintenance': 50000,
        'Next Oil Change KM': 55000,
        'Original Odometer KM': 0
      }];
      filename = 'maintenance_template.xlsx';
    }

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, type === 'trips' ? 'Trips' : 'Maintenance');
    XLSX.writeFile(workbook, filename);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Trips Upload */}
      <Card className="shadow-lg">
        <CardHeader className="bg-dashboard-form-header">
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Upload Trips Excel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="trips-file">Select Trips Excel File</Label>
            <Input
              id="trips-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'trips');
              }}
              disabled={isUploading}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => downloadTemplate('trips')}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Template
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Upload an Excel file with trip data. Use the template for correct format.
          </p>
        </CardContent>
      </Card>

      {/* Maintenance Upload */}
      <Card className="shadow-lg">
        <CardHeader className="bg-dashboard-form-header">
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Upload Maintenance Excel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="maintenance-file">Select Maintenance Excel File</Label>
            <Input
              id="maintenance-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'maintenance');
              }}
              disabled={isUploading}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => downloadTemplate('maintenance')}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Template
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Upload an Excel file with maintenance data. Use the template for correct format.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExcelUpload;