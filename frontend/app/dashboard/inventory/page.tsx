'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { Search, Plus, Package, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SKU {
  _id: string;
  skuCode: string;
  name: string;
  category: string;
  supplier: string;
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  unit: string;
  minReorderQuantity: number;
  location: string;
}

export default function InventoryPage() {
  const [skus, setSkus] = useState<SKU[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    skuCode: '',
    name: '',
    category: 'tiles',
    supplier: '',
    costPrice: '',
    sellingPrice: '',
    currentStock: '',
    unit: 'pieces',
    minReorderQuantity: '',
    location: ''
  });

  useEffect(() => {
    fetchSKUs();
  }, [search, category]);

  const fetchSKUs = async () => {
    try {
      const params: any = {};
      if (search) params.search = search;
      if (category !== 'all') params.category = category;
      
      const response = await api.get('/skus', { params });
      setSkus(response.data.skus);
    } catch (error) {
      console.error('Error fetching SKUs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/skus', {
        ...formData,
        costPrice: parseFloat(formData.costPrice),
        sellingPrice: parseFloat(formData.sellingPrice),
        currentStock: parseInt(formData.currentStock),
        minReorderQuantity: parseInt(formData.minReorderQuantity)
      });
      setIsOpen(false);
      setFormData({
        skuCode: '',
        name: '',
        category: 'tiles',
        supplier: '',
        costPrice: '',
        sellingPrice: '',
        currentStock: '',
        unit: 'pieces',
        minReorderQuantity: '',
        location: ''
      });
      fetchSKUs();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add SKU');
    }
  };

  const getStockStatus = (sku: SKU) => {
    if (sku.currentStock === 0) return { label: 'Out of Stock', color: 'destructive' };
    if (sku.currentStock <= sku.minReorderQuantity) return { label: 'Low Stock', color: 'warning' };
    return { label: 'In Stock', color: 'success' };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500 mt-1">Manage your SKUs and stock levels</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add SKU
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by SKU code, name, or supplier..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="tiles">Tiles</SelectItem>
                <SelectItem value="sanitaryware">Sanitaryware</SelectItem>
                <SelectItem value="lighting">Lighting</SelectItem>
                <SelectItem value="stone">Stone</SelectItem>
                <SelectItem value="plywood">Plywood</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* SKU List */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({skus.length})</CardTitle>
          <CardDescription>All SKUs in your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">SKU Code</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Product Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Stock</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Value</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Location</th>
                </tr>
              </thead>
              <tbody>
                {skus.map((sku) => {
                  const status = getStockStatus(sku);
                  return (
                    <tr key={sku._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-sm">{sku.skuCode}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{sku.name}</div>
                        <div className="text-sm text-gray-500">{sku.supplier}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize text-sm">{sku.category}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold">{formatNumber(sku.currentStock)} {sku.unit}</div>
                        <div className="text-xs text-gray-500">Min: {sku.minReorderQuantity}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div>{formatCurrency(sku.currentStock * sku.costPrice)}</div>
                        <div className="text-xs text-gray-500">
                          Cost: {formatCurrency(sku.costPrice)}/{sku.unit}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge 
                          variant={
                            status.color === 'destructive' ? 'destructive' : 
                            status.color === 'warning' ? 'secondary' : 
                            'default'
                          }
                        >
                          {status.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 capitalize text-sm">{sku.location}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {skus.length === 0 && !loading && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No SKUs found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
