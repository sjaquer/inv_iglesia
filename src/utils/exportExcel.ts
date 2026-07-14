import { Product, Transaction } from '../types';

export const exportToExcel = async (products: Product[], transactions: Transaction[]) => {
  // Carga diferida: ExcelJS es pesado y solo se usa al exportar.
  const ExcelJS = (await import('exceljs')).default;
  const { saveAs } = await import('file-saver');

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Centro de Adoración';
  workbook.lastModifiedBy = 'Centro de Adoración';
  workbook.created = new Date();
  
  // Sheet 1: Inventario
  const inventorySheet = workbook.addWorksheet('Inventario');
  inventorySheet.columns = [
    { header: 'Código', key: 'code', width: 15 },
    { header: 'Producto', key: 'name', width: 30 },
    { header: 'Categoría', key: 'category', width: 20 },
    { header: 'Descripción', key: 'description', width: 40 },
    { header: 'Estado', key: 'condition', width: 20 },
    { header: 'Stock Actual', key: 'stock', width: 15 },
  ];
  
  // Style headers
  inventorySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  inventorySheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2C3136' } };
  inventorySheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
  
  products.forEach(p => {
    inventorySheet.addRow({
      code: p.code,
      name: p.name,
      category: p.category,
      description: p.description,
      condition: p.condition,
      stock: p.stock
    });
  });

  // Color specific cells based on conditions
  inventorySheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      const stockCell = row.getCell('stock');
      if (stockCell.value && (stockCell.value as number) <= 5) {
        stockCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC7CE' } };
        stockCell.font = { color: { argb: 'FF9C0006' } };
      }
    }
  });

  // Sheet 2: Movimientos
  const historySheet = workbook.addWorksheet('Movimientos');
  historySheet.columns = [
    { header: 'Fecha', key: 'date', width: 20 },
    { header: 'Tipo', key: 'type', width: 15 },
    { header: 'Origen/Motivo', key: 'origin', width: 20 },
    { header: 'Producto', key: 'product', width: 30 },
    { header: 'Cantidad', key: 'quantity', width: 10 },
    { header: 'Persona', key: 'person', width: 30 },
    { header: 'Costo', key: 'cost', width: 15 },
    { header: 'Estado (Retorno)', key: 'condition', width: 20 },
  ];
  
  historySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  historySheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2C3136' } };
  
  transactions.forEach(t => {
    const product = products.find(p => p.id === t.productId);
    let typeName = t.type === 'IN' ? 'Entrada' : t.type === 'OUT' ? 'Salida' : 'Retorno';
    historySheet.addRow({
      date: new Date(t.date).toLocaleString(),
      type: typeName,
      origin: t.origin || '-',
      product: product?.name || 'Desconocido',
      quantity: t.quantity,
      person: t.personName,
      cost: t.type === 'IN' && t.origin === 'Compra' && t.cost ? t.cost.toFixed(2) : '-',
      condition: t.conditionOnReturn || '-'
    });
  });
  
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `Inventario_Centro_Adoracion_${new Date().toISOString().slice(0,10)}.xlsx`);
};
