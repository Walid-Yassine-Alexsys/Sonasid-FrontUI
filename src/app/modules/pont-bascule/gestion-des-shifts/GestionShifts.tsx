import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsPlus } from "react-icons/bs";
import AffectationForm from "./__partials/AffectationForm";
import DataTableShifts from "./__partials/DataTableShifts";

const GestionShifts: React.FC = () => {
  const [affectations, setAffectations] = useState<any[]>([]);
  const [idCounter, setIdCounter] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const matricules = ["75843-A-1", "12934-B-2", "43920-C-3"];
  const conducteurs = [
    { nom: "Ahmed", prenom: "Karim", cin: "AB12345" },
    { nom: "Youssef", prenom: "Said", cin: "CD67890" },
    { nom: "Nadia", prenom: "Hana", cin: "EF13579" },
  ];

  const handleAffectation = (matricule: string, conducteur: any) => {
    setAffectations((prev) => [
      ...prev,
      { id: idCounter, matricule, conducteur },
    ]);
    setIdCounter((prev) => prev + 1);
  };

  const handleDelete = (id: number) => {
    setAffectations((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddClick = () => {
    navigate("/nouvelle-affectation"); // 🔁 tu peux adapter le chemin si tu veux
  };

  return (
    <div className="container-fluid mt-4">
      {/* ✅ Carte principale */}
      <div className="card border-0 shadow-sm rounded-3 p-4">
        <h3 className="card-header-title mb-1">Création de Shifts</h3>

        <div className=" mt-5">
          {/* Formulaire + Tableau */}
          <AffectationForm
            matricules={matricules}
            conducteurs={conducteurs}
            onAffect={handleAffectation}
          />

          <DataTableShifts
            data={affectations}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default GestionShifts;
