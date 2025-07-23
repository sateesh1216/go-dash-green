import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trip } from '@/types/trip';
import { Car, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';

interface SummaryCardsProps {
  trips: Trip[];
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ trips }) => {
  const totalTrips = trips.length;
  const totalTripMoney = trips.reduce((sum, trip) => sum + trip.tripAmount, 0);
  const totalExpenses = trips.reduce((sum, trip) => sum + trip.driverAmount + trip.fuel + trip.tolls, 0);
  const totalProfit = trips.reduce((sum, trip) => sum + trip.totalProfit, 0);

  const cards = [
    {
      title: 'Total Trips',
      value: totalTrips.toString(),
      icon: Car,
      description: 'Total completed trips',
      color: 'text-primary'
    },
    {
      title: 'Total Trip Money',
      value: `₹${totalTripMoney.toFixed(2)}`,
      icon: DollarSign,
      description: 'Revenue from all trips',
      color: 'text-info'
    },
    {
      title: 'Total Expenses',
      value: `₹${totalExpenses.toFixed(2)}`,
      icon: TrendingDown,
      description: 'Driver + Fuel + Tolls',
      color: 'text-warning'
    },
    {
      title: 'Total Profit',
      value: `₹${totalProfit.toFixed(2)}`,
      icon: TrendingUp,
      description: 'Net profit after expenses',
      color: totalProfit >= 0 ? 'text-dashboard-profit-positive' : 'text-dashboard-profit-negative'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, index) => (
        <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>
              {card.value}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;