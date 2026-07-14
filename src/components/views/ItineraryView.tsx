import React, { useState } from 'react';
import { useItinerary } from '../../hooks/useItinerary';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { UserPlus, CalendarPlus, CalendarDays, Trash2, MapPin, Clock } from 'lucide-react';
import { format, parseISO, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

export function ItineraryView() {
  const { workers, schedules, loading, addWorker, addSchedule, deleteWorker, deleteSchedule } = useItinerary();
  
  // Worker Form State
  const [workerName, setWorkerName] = useState('');
  const [workerRole, setWorkerRole] = useState('Operario');
  const [workerPhone, setWorkerPhone] = useState('');
  
  // Schedule Form State
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('17:00');
  const [location, setLocation] = useState('');
  
  const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerName.trim()) return;
    await addWorker({ name: workerName, role: workerRole, phone: workerPhone });
    setWorkerName('');
    setWorkerPhone('');
  };

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkerId || !scheduleDate || !location) return;
    await addSchedule({
      workerId: selectedWorkerId,
      date: scheduleDate,
      startTime,
      endTime,
      location,
    });
    setLocation('');
  };

  // Group schedules by date for the right side
  const upcomingSchedules = schedules.filter(s => s.date >= new Date().toISOString().split('T')[0]);
  const schedulesForSelectedDate = schedules.filter(s => s.date === viewDate);

  if (loading) {
    return <div className="flex-1 flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>;
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
      
      {/* Columna Izquierda: Formularios (Paso 1 y Paso 2) */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6 overflow-y-auto pr-2 pb-4">
        
        {/* Paso 1: Registrar Personal */}
        <div className="bg-[#2C3136] rounded-xl border border-[#373C42] p-5 shadow-lg shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 text-xs font-bold">1</div>
            <h3 className="text-white font-bold tracking-tight">Registrar Personal</h3>
          </div>
          <form onSubmit={handleAddWorker} className="space-y-3">
            <Input label="Nombre completo" value={workerName} onChange={(e) => setWorkerName(e.target.value)} required />
            <div className="grid grid-cols-2 gap-3">
              <Select label="Rol" value={workerRole} onChange={(e) => setWorkerRole(e.target.value)}>
                <option value="Operario">Operario</option>
                <option value="Maestro">Maestro</option>
                <option value="Ayudante">Ayudante</option>
                <option value="Ingeniero">Ingeniero</option>
                <option value="Arquitecto">Arquitecto</option>
                <option value="Otro">Otro</option>
              </Select>
              <Input label="Teléfono (Opcional)" value={workerPhone} onChange={(e) => setWorkerPhone(e.target.value)} />
            </div>
            <Button type="submit" className="w-full bg-[#373C42] hover:bg-[#454A51] text-white">
              <UserPlus size={16} className="mr-2" />
              Guardar Persona
            </Button>
          </form>
        </div>

        {/* Paso 2: Asignar Tarea */}
        <div className="bg-[#2C3136] rounded-xl border border-[#373C42] p-5 shadow-lg shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 text-xs font-bold">2</div>
            <h3 className="text-white font-bold tracking-tight">Asignar Itinerario</h3>
          </div>
          <form onSubmit={handleAddSchedule} className="space-y-3">
            <Select label="Seleccionar Persona" value={selectedWorkerId} onChange={(e) => setSelectedWorkerId(e.target.value)} required>
              <option value="">-- Seleccione alguien --</option>
              {workers.map(w => (
                <option key={w.id} value={w.id}>{w.name} ({w.role})</option>
              ))}
            </Select>
            <Input type="date" label="Fecha" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} required />
            <div className="grid grid-cols-2 gap-3">
              <Input type="time" label="Hora Inicio" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
              <Input type="time" label="Hora Fin" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </div>
            <Input label="Ubicación / Tarea" placeholder="Ej. Losa sector A, Encofrado..." value={location} onChange={(e) => setLocation(e.target.value)} required />
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white border-none shadow-lg shadow-orange-500/20" disabled={!selectedWorkerId}>
              <CalendarPlus size={16} className="mr-2" />
              Asignar Turno
            </Button>
          </form>
        </div>

      </div>

      {/* Columna Derecha: Vista (Paso 3) */}
      <div className="w-full lg:w-2/3 flex flex-col bg-[#2C3136] rounded-xl border border-[#373C42] shadow-lg overflow-hidden">
        <div className="p-5 border-b border-[#373C42] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 text-xs font-bold">3</div>
            <h3 className="text-white font-bold tracking-tight text-lg">Vista Rápida de Itinerario</h3>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-[#8E9299]" />
            <input 
              type="date" 
              className="bg-[#1A1D21] border border-[#373C42] text-sm text-white rounded p-1.5 focus:outline-none focus:border-orange-500"
              value={viewDate}
              onChange={(e) => setViewDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <h4 className="text-sm uppercase tracking-widest font-bold text-[#8E9299] mb-4">
            {viewDate ? format(parseISO(viewDate), "EEEE, d 'de' MMMM", { locale: es }) : 'Seleccione una fecha'}
          </h4>
          
          <div className="space-y-3">
            {schedulesForSelectedDate.length === 0 ? (
              <div className="text-center py-10 text-[#8E9299] border-2 border-dashed border-[#373C42] rounded-xl">
                No hay asignaciones para este día.
              </div>
            ) : (
              schedulesForSelectedDate.map(schedule => {
                const worker = workers.find(w => w.id === schedule.workerId);
                return (
                  <div key={schedule.id} className="bg-[#1A1D21] border border-[#373C42] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#454A51] transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#373C42] flex items-center justify-center font-bold text-white shrink-0">
                        {worker?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="text-white font-medium">{worker?.name || 'Usuario Eliminado'} <span className="text-xs text-orange-400 ml-2 bg-orange-500/10 px-2 py-0.5 rounded-full">{worker?.role}</span></p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-[#8E9299]">
                          <span className="flex items-center gap-1"><Clock size={12} /> {schedule.startTime} - {schedule.endTime}</span>
                          <span className="flex items-center gap-1"><MapPin size={12} /> {schedule.location}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteSchedule(schedule.id)}
                      className="text-[#8E9299] hover:text-red-400 p-2 sm:opacity-0 group-hover:opacity-100 transition-opacity rounded hover:bg-[#373C42]"
                      title="Eliminar asignación"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
