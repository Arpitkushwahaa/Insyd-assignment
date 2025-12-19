'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { AlertTriangle, TrendingDown, Package, ShoppingCart } from 'lucide-react';

export default function InsightsPage() {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await api.get('/analytics/insights?days=30');
      setInsights(response.data);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !insights) {
    return <div>Loading insights...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Smart Insights</h1>
        <p className="text-gray-500 mt-1">Data-driven recommendations to improve your margins</p>
      </div>

      <Tabs defaultValue="slow-moving" className="space-y-4">
        <TabsList>
          <TabsTrigger value="slow-moving">Slow Moving</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
          <TabsTrigger value="reorder">Reorder Suggestions</TabsTrigger>
          <TabsTrigger value="damage">High Damage</TabsTrigger>
          <TabsTrigger value="top-performers">Top Performers</TabsTrigger>
        </TabsList>

        <TabsContent value="slow-moving" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-orange-600" />
                Slow-Moving SKUs
              </CardTitle>
              <CardDescription>
                Products with no sales in last 30 days - Consider clearance or discontinuation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.slowMovingSKUs?.map((sku: any) => (
                  <div key={sku._id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{sku.name}</p>
                      <p className="text-sm text-gray-500">{sku.skuCode}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-orange-600">{formatCurrency(sku.lockedValue)}</p>
                      <p className="text-sm text-gray-500">{formatNumber(sku.currentStock)} {sku.unit} locked</p>
                    </div>
                  </div>
                ))}
                {insights.slowMovingSKUs?.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No slow-moving SKUs found. Great!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="low-stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Low Stock Alerts
              </CardTitle>
              <CardDescription>
                SKUs below minimum reorder quantity - Order soon to avoid stockouts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.lowStockSKUs?.map((sku: any) => (
                  <div key={sku._id} className="flex justify-between items-center p-4 border rounded-lg bg-red-50">
                    <div>
                      <p className="font-semibold">{sku.name}</p>
                      <p className="text-sm text-gray-500">{sku.skuCode} - {sku.supplier}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">{formatNumber(sku.currentStock)} left</p>
                      <p className="text-sm text-gray-500">Min: {sku.minReorderQuantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reorder" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                Smart Reorder Suggestions
              </CardTitle>
              <CardDescription>
                AI-powered reorder quantities based on sales velocity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.reorderSuggestions?.map((sku: any) => (
                  <div key={sku._id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{sku.name}</p>
                      <p className="text-sm text-gray-500">{sku.skuCode} - {sku.supplier}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Avg daily sales: {sku.avgDailySales?.toFixed(1) || 0} {sku.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">Order: {Math.ceil(sku.suggestedReorder)}</p>
                      <p className="text-sm text-gray-500">Current: {sku.currentStock}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="damage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-red-600" />
                High Damage SKUs
              </CardTitle>
              <CardDescription>
                Products with highest damage/loss in last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.highDamageSKUs?.map((item: any) => (
                  <div key={item._id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{item.skuName}</p>
                      <p className="text-sm text-gray-500">{item.skuCode}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">{formatCurrency(item.totalValue)} lost</p>
                      <p className="text-sm text-gray-500">{formatNumber(item.totalDamage)} units</p>
                    </div>
                  </div>
                ))}
                {insights.highDamageSKUs?.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No significant damage recorded. Excellent!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top-performers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-green-600" />
                Top Performing SKUs
              </CardTitle>
              <CardDescription>
                Best sellers by revenue in last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.topPerformers?.map((item: any, index: number) => (
                  <div key={item._id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{item.skuName}</p>
                        <p className="text-sm text-gray-500">{item.skuCode}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{formatCurrency(item.totalRevenue)}</p>
                      <p className="text-sm text-gray-500">{formatNumber(item.totalSold)} units sold</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
