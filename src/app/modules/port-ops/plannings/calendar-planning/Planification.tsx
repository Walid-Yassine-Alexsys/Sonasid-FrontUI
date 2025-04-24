import React, { useState } from "react";
import SearchForm from "./__partials/SearchForm";
import CalendarView from "./__partials/CalendarView";
import { BsPlus } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const staticEvents = [
  {
    id: "1",
    title: "Création planning (Validé)",
    start: "2025-04-10",
    end: "2025-04-10",
    extendedProps: {
      PlanningArrivage_Statut: "Validé",
      PlanningArrivage_Mois: "04",
      PlanningArrivage_Annee: "2025",
      PlanningArrivage_DateStatut: "2025-04-10",
      PlanningArrivage_MotifRejet: "",
      PlanningArrivage_DateCreation: "2025-04-09",
      PlanningArrivage_UserId: "USR-001",
    },
  },
  {
    id: "2",
    title: "Création planning (Rejeté)",
    start: "2025-04-17",
    end: "2025-04-17",
    extendedProps: {
      PlanningArrivage_Statut: "Rejeté",
      PlanningArrivage_Mois: "04",
      PlanningArrivage_Annee: "2025",
      PlanningArrivage_DateStatut: "2025-04-17",
      PlanningArrivage_MotifRejet: "Problème de disponibilité",
      PlanningArrivage_DateCreation: "2025-04-16",
      PlanningArrivage_UserId: "USR-002",
    },
  },
  {
    id: "3",
    title: "Création planning (En attente)",
    start: "2025-04-22",
    end: "2025-04-22",
    extendedProps: {
      PlanningArrivage_Statut: "En attente",
      PlanningArrivage_Mois: "04",
      PlanningArrivage_Annee: "2025",
      PlanningArrivage_DateStatut: "2025-04-22",
      PlanningArrivage_MotifRejet: "",
      PlanningArrivage_DateCreation: "2025-04-20",
      PlanningArrivage_UserId: "USR-003",
    },
  },
  {
    id: "4",
    title: "Création planning (Pluri-journée)",
    start: "2025-04-25",
    end: "2025-04-29", // ⬅️ s'étale sur 3 jours complets (25, 26, 27)
    extendedProps: {
      PlanningArrivage_Statut: "En cours",
      PlanningArrivage_Mois: "04",
      PlanningArrivage_Annee: "2025",
      PlanningArrivage_DateStatut: "2025-04-25",
      PlanningArrivage_MotifRejet: "En attente de confirmation logistique",
      PlanningArrivage_DateCreation: "2025-04-24",
      PlanningArrivage_UserId: "USR-004",
    },
  },
  
];

const Planification: React.FC = () => {
  const [filteredEvents, setFilteredEvents] = useState<any[]>(staticEvents);
  const navigate = useNavigate(); // ✅ Hook de navigation

  const handleSearch = (month: string) => {
    const filtered = staticEvents.filter((event) =>
      event.start.startsWith(month)
    );
    setFilteredEvents(filtered);
  };
  const handleAddClick = () => {
    navigate("/create-planning")
};
  return (
    <div className="container-fluid mt-4">
      {/* ✅ En-tête haut de page */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="page-title mb-1">Planification d’arrivage</h2>
        </div>
        <button
          className="btn btn-primary btn-add-arrivage"
          onClick={handleAddClick}
        >
          <BsPlus className="me-2" size={20} />
          <span>Nouvelle planification</span>
        </button>
      </div>

      {/* ✅ Carte contenant le formulaire + calendrier */}
      <div className="card border-0 shadow-sm rounded-3 p-4">
        <h5 className="card-header-title mb-1">Calendrier des planifications</h5>
        <p className="card-header-subtitle mb-4">
          Visualisez les plannings créés selon le mois sélectionné
        </p>

        <SearchForm onSearch={handleSearch} />
        <CalendarView events={filteredEvents} />
      </div>
    </div>
  );
};

export default Planification;
