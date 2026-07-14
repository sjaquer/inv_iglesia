import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Product, TransactionType, ProductCondition } from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  type: TransactionType;
  onSave: (productId: string, type: TransactionType, quantity: number, personName: string, condition?: string, origin?: string) => Promise<void>;
}

export function TransactionModal({ isOpen, onClose, product, type, onSave }: TransactionModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [personName, setPersonName] = useState('');
  const [origin, setOrigin] = useState('Donación');
  const [condition, setCondition] = useState<ProductCondition>('Óptimo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset state when opening
  React.useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setPersonName('');
      setOrigin('Donación');
      setCondition('Óptimo');
      setError('');
    }
  }, [isOpen]);

  const getTitle = () => {
    if (type === 'IN') return 'Registrar Entrada';
    if (type === 'OUT') return 'Registrar Salida (Préstamo/Uso)';
    return 'Registrar Retorno (Devolución)';
  };

  const getPersonLabel = () => {
    if (type === 'IN') {
      return origin === 'Donación' ? 'Nombre del donante' : 'Entregado por / Comprado por';
    }
    if (type === 'OUT') return 'Nombre de quien retira';
    return 'Nombre de quien devuelve';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!personName) {
      setError('El nombre de la persona es obligatorio.');
      return;
    }
    if (quantity <= 0) {
      setError('La cantidad debe ser mayor a cero.');
      return;
    }
    if (type === 'OUT' && quantity > product.stock) {
      setError(`Stock insuficiente. Solo hay ${product.stock} disponibles.`);
      return;
    }

    setLoading(true);
    try {
      await onSave(
        product.id, 
        type, 
        quantity, 
        personName, 
        type === 'RETURN' ? condition : undefined,
        type === 'IN' ? origin : undefined
      );
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la transacción.');
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>}
        
        <div className="bg-[#2C3136] p-3 rounded-md mb-4 border border-[#373C42]">
          <p className="text-sm font-bold text-white">{product.name}</p>
          <p className="text-[10px] font-bold text-[#8E9299] uppercase tracking-widest mt-0.5">Stock actual: {product.stock}</p>
        </div>
        
        <Input 
          label="Cantidad" 
          type="number" 
          min="1"
          max={type === 'OUT' ? product.stock : undefined}
          value={quantity} 
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} 
          required 
          autoFocus
        />
        
        {type === 'IN' && (
          <Select 
            label="Motivo de Ingreso" 
            value={origin} 
            onChange={(e) => setOrigin(e.target.value)}
          >
            <option value="Donación">Donación</option>
            <option value="Compra">Compra</option>
            <option value="Ajuste">Ajuste de Inventario</option>
            <option value="Otro">Otro</option>
          </Select>
        )}
        
        <Input 
          label={getPersonLabel()} 
          placeholder="Nombre completo" 
          value={personName} 
          onChange={(e) => setPersonName(e.target.value)} 
          required 
        />
        
        {type === 'RETURN' && (
          <Select 
            label="Estado al devolver" 
            value={condition} 
            onChange={(e) => setCondition(e.target.value as ProductCondition)}
          >
            <option value="Óptimo">Óptimo</option>
            <option value="Desgastado">Desgastado</option>
            <option value="Falla Leve">Falla Leve</option>
            <option value="Requiere Reparación">Requiere Reparación</option>
            <option value="Inservible">Inservible</option>
          </Select>
        )}
        
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Confirmar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
