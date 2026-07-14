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
  knownNames: string[];
  onSave: (productId: string, type: TransactionType, quantity: number, personName: string, condition?: string, origin?: string, cost?: number) => Promise<void>;
}

export function TransactionModal({ isOpen, onClose, product, type, knownNames, onSave }: TransactionModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [personName, setPersonName] = useState('');
  const [origin, setOrigin] = useState('Donación');
  const [condition, setCondition] = useState<ProductCondition>('Óptimo');
  const [cost, setCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset state when opening
  React.useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setPersonName('');
      setOrigin('Donación');
      setCondition('Óptimo');
      setCost(0);
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
        type === 'IN' ? origin : undefined,
        type === 'IN' && origin === 'Compra' && cost > 0 ? cost : undefined
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
            onChange={(e) => {
              setOrigin(e.target.value);
              if (e.target.value !== 'Compra') setCost(0);
            }}
          >
            <option value="Donación">Donación</option>
            <option value="Compra">Compra</option>
            <option value="Ajuste">Ajuste de Inventario</option>
            <option value="Otro">Otro</option>
          </Select>
        )}

        {type === 'IN' && origin === 'Compra' && (
          <Input 
            label="Costo (S/.)" 
            type="number" 
            step="0.01"
            min="0"
            placeholder="0.00"
            value={cost} 
            onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
          />
        )}
        
        <div className="w-full">
          {personName && (
            <label className="block text-[10px] font-bold text-[#8E9299] uppercase tracking-widest mb-1">
              {getPersonLabel()}
            </label>
          )}
          <input
            list="person-list"
            placeholder={getPersonLabel()}
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            required
            className="flex w-full rounded-md border border-[#373C42] bg-[#1A1D21] text-white px-3 py-2 text-sm placeholder:text-[#8E9299] focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          />
          <datalist id="person-list">
            {knownNames.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>
        
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
