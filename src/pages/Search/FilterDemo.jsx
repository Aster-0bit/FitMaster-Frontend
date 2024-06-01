import React, { useState, useEffect } from "react";
import { TreeSelect } from 'primereact/treeselect';

const muscleGroups = [
  { key: '1', label: 'Pectorales', data: { id: 1, name: 'Pectorales' } },
  { key: '2', label: 'Dorsales', data: { id: 2, name: 'Dorsales' } },
  { key: '3', label: 'Hombros', data: { id: 3, name: 'Hombros' } },
  { key: '4', label: 'Bíceps', data: { id: 4, name: 'Bíceps' } },
  { key: '5', label: 'Tríceps', data: { id: 5, name: 'Tríceps' } },
  { key: '6', label: 'Cuádriceps', data: { id: 6, name: 'Cuádriceps' } },
  { key: '7', label: 'Isquiotibiales', data: { id: 7, name: 'Isquiotibiales' } },
  { key: '8', label: 'Glúteos', data: { id: 8, name: 'Glúteos' } },
  { key: '9', label: 'Abdominales', data: { id: 9, name: 'Abdominales' } },
  { key: '10', label: 'Pantorrillas', data: { id: 10, name: 'Pantorrillas' } },
  { key: '11', label: 'Antebrazos', data: { id: 11, name: 'Antebrazos' } }
];

const exerciseTypes = [
  { key: '1', label: 'Gimnasio', data: { value: 'gimnasio', name: 'Gimnasio' } },
  { key: '2', label: 'Calistenia', data: { value: 'calistenia', name: 'Calistenia' } },
  { key: '3', label: 'Cardio', data: { value: 'cardio', name: 'Cardio' } }
];

const intensities = [
  { key: '1', label: 'Media', data: { value: 'Media', name: 'Media' } },
  { key: '2', label: 'Alta', data: { value: 'Alta', name: 'Alta' } },
  { key: '3', label: 'Baja', data: { value: 'Baja', name: 'Baja' } }
];

const FilterDemo = ({ onChange }) => {
  const [nodes, setNodes] = useState([]);
  const [selectedNodeKey, setSelectedNodeKey] = useState(null);

  useEffect(() => {
    const combinedFilters = [
      {
        key: '0',
        label: 'Grupos Musculares',
        children: muscleGroups
      },
      {
        key: '1',
        label: 'Tipo de Ejercicio',
        children: exerciseTypes
      },
      {
        key: '2',
        label: 'Intensidad',
        children: intensities
      }
    ];
    setNodes(combinedFilters);
  }, []);

  const handleFilterChange = (e) => {
    setSelectedNodeKey(e.value);
    onChange(e.value); // Llama a la función onChange pasada como prop
  };

  return (
    <div className="card flex justify-content-center">
      <TreeSelect
        value={selectedNodeKey}
        onChange={handleFilterChange}
        options={nodes}
        filter
        className="md:w-20rem w-full"
        placeholder="Seleccionar Filtro"
      />
    </div>
  );
};

export default FilterDemo;
