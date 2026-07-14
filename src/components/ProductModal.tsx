import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Category, ProductCondition } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { code: string; name: string; description: string; category: Category; condition: string; stock: number; }) => Promise<void>;
}

export function ProductModal({ isOpen, onClose, onSave }: ProductModalProps) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Herramientas');
  const [condition, setCondition] = useState<ProductCondition>('Óptimo');
  const [stock, setStock] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) {
      setError('Código y Producto son obligatorios.');
      return;
    }
    
    setLoading(true);
    try {
      await onSave({ code, name, description, category, condition, stock });
      // Reset form
      setCode('');
      setName('');
      setDescription('');
      setCategory('Herramientas');
      setCondition('Óptimo');
      setStock(0);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el producto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Producto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>}
        
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Código" 
            placeholder="Ej: HRR-001" 
            value={code} 
            onChange={(e) => setCode(e.target.value)} 
            required 
            autoFocus
          />
          <Input 
            label="Stock Inicial" 
            type="number" 
            min="0"
            value={stock} 
            onChange={(e) => setStock(parseInt(e.target.value) || 0)} 
            required 
          />
        </div>
        
        <Input 
          label="Producto" 
          placeholder="Nombre del artículo" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        
        <Input 
          label="Descripción" 
          placeholder="Detalles adicionales" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
        
        <Select 
          label="Categoría" 
          value={category} 
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          <option value="Herramientas">Herramientas</option>
          <option value="Limpieza">Limpieza</option>
          <option value="Seguridad">Seguridad</option>
          <option value="Mobiliario">Mobiliario</option>
          <option value="Papelería">Papelería</option>
          <option value="Otros">Otros</option>
        </Select>
        
        <Select 
          label="Estado" 
          value={condition} 
          onChange={(e) => setCondition(e.target.value as ProductCondition)}
        >
          <option value="Óptimo">Óptimo</option>
          <option value="Desgastado">Desgastado</option>
          <option value="Falla Leve">Falla Leve</option>
          <option value="Requiere Reparación">Requiere Reparación</option>
          <option value="Inservible">Inservible</option>
        </Select>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Producto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
