'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatNumber } from '@/lib/utils';
import { TrendingUp, TrendingDown, Plus, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Movement {
  _id: string;
  skuId: {
    _id: string;
    name: string;
    skuCode: string;
  } | string;
  type: string;
  quantity: number;
  reason: string;
  referenceNumber: string;
  performedBy: {
    name: string;
  };
  createdAt: string;
}

interface SKU {
  _id: string;
  name: string;
  skuCode: string;
  currentStock: number;
}

export default function StockMovementPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [skus, setSKUs] = useState<SKU[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    skuId: '',
    movementType: 'inward',
    quantity: '',
    reason: '',
    referenceNumber: ''
  });

  useEffect(() => {
    fetchMovements();
    fetchSKUs();
  }, []);

  const fetchMovements = async () => {
    try {
      const response = await api.get('/stock-movements');
      setMovements(response.data.movements);
    } catch (error) {
      console.error('Error fetching movements:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSKUs = async () => {
    try {
      const response = await api.get('/skus');
      setSKUs(response.data.skus);
    } catch (error) {
      console.error('Error fetching SKUs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/stock-movements', {
        ...formData,
        quantity: parseInt(formData.quantity)
      });
      setIsOpen(false);
      setFormData({
        skuId: '',
        movementType: 'inward',
        quantity: '',
        reason: '',
        referenceNumber: ''
      });
      fetchMovements();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create movement');
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type?.toLowerCase()) {
      case 'inward':
      case 'in':
        return <ArrowDownCircle className="h-4 w-4 text-green-600" />;
      case 'outward':
      case 'out':
        return <ArrowUpCircle className="h-4 w-4 text-blue-600" />;
      case 'damage':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'loss':
        return <TrendingDown className="h-4 w-4 text-orange-600" />;
      default:
        return <TrendingUp className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeUpper = type?.toUpperCase();
    const variants: any = {
      'INWARD': 'default',
      'IN': 'default',
      'OUTWARD': 'secondary',
      'OUT': 'secondary',
      'DAMAGE': 'destructive',
      'LOSS': 'destructive',
      'ADJUSTMENT': 'outline'
    };
    return <Badge variant={variants[typeUpper] || 'outline'}>{typeUpper}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Stock Movements
          </h1>
          <p className="text-gray-600 mt-1">Track all inventory transactions</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Record Movement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Record Stock Movement</DialogTitle>
              <DialogDescription>Add a new stock transaction</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>SKU</Label>
                <Select value={formData.skuId} onValueChange={(value) => setFormData({...formData, skuId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select SKU" />
                  </SelectTrigger>
                  <SelectContent>
                    {skus.map((sku) => (
                      <SelectItem key={sku._id} value={sku._id}>
                        {sku.name} ({sku.skuCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Movement Type</Label>
                <Select value={formData.movementType} onValueChange={(value) => setFormData({...formData, movementType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inward">Inward (Stock In)</SelectItem>
                    <SelectItem value="outward">Outward (Stock Out)</SelectItem>
                    <SelectItem value="damage">Damage</SelectItem>
                    <SelectItem value="loss">Loss</SelectItem>
                    <SelectItem value="adjustment">Adjustment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  required
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label>Reason</Label>
                <Input
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  placeholder="e.g., Customer order, Purchase received"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Reference Number (Optional)</Label>
                <Input
                  value={formData.referenceNumber}
                  onChange={(e) => setFormData({...formData, referenceNumber: e.target.value})}
                  placeholder="PO/Invoice/GRN number"
                />
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                Record Movement
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Movements</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : movements.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No stock movements recorded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {movements.map((movement) => {
                const sku = typeof movement.skuId === 'string' 
                  ? skus.find(s => s._id === movement.skuId)
                  : movement.skuId;
                
                if (!sku) return null;
                
                return (
                  <div key={movement._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getTypeIcon(movement.movementType)}
                      </div>
                      <div>
                        <p className="font-semibold">{typeof sku === 'object' ? sku.name : 'Unknown SKU'}</p>
                        <p className="text-sm text-gray-600">{typeof sku === 'object' ? sku.skuCode : ''}</p>
                        <p className="text-xs text-gray-500 mt-1">{movement.reason}</p>
                        {movement.referenceNumber && (
                          <p className="text-xs text-gray-400">Ref: {movement.referenceNumber}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {getTypeBadge(movement.movementType)}
                      <p className="text-lg font-bold mt-1">{formatNumber(movement.quantity)}</p>
                      <p className="text-xs text-gray-500">{movement.performedBy?.name}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(movement.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
