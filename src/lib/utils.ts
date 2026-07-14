import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Herramientas':
      return 'bg-orange-500 text-white';
    case 'Limpieza':
      return 'bg-green-500 text-white';
    case 'Seguridad':
      return 'bg-yellow-400 text-black';
    case 'Mobiliario':
      return 'bg-blue-500 text-white';
    case 'Papelería':
      return 'bg-pink-500 text-white';
    case 'Otros':
    default:
      return 'bg-purple-500 text-white';
  }
};
