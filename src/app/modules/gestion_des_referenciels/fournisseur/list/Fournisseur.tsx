import React, { useEffect, useState } from "react";
import FournisseurSearchForm from "./__partials/FournisseurSearchForm";
import FournisseurDataTable from "./__partials/FournisseurDataTable";
import { useNavigate } from "react-router-dom";
import { BsPlus } from "react-icons/bs";

interface Fournisseur {
  Id: string;
  Nom: string;
  ICE: string;
  PaysId: string;
  Adresse: string;
  VilleId: string;
  ContactNom: string;
  ContactTelephone: string;
  ContactEmail: string;
  statut: string;
  dateArrivee: string;
}

const Fournisseur: React.FC = () => {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [filtered, setFiltered] = useState<Fournisseur[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fakeFournisseurs: Fournisseur[] = [
      {
        Id: "1",
        Nom: "CMD-2025-458",
        ICE: "123",
        PaysId: "Maroc",
        Adresse: "123 Rue de l'Industrie",
        VilleId: "Casablanca",
        ContactNom: "",
        ContactTelephone: "",
        ContactEmail: "",
        statut: "activé",
        dateArrivee: "25/02/2025",
      },
      {
        Id: "2",
        Nom: "CMD-2025-458",
        ICE: "123",
        PaysId: "Maroc",
        Adresse: "123 Rue de l'Industrie",
        VilleId: "Casablanca",
        ContactNom: "",
        ContactTelephone: "",
        ContactEmail: "",
        statut: "non activé",
        dateArrivee: "25/02/2025",
      },
      {
        Id: "3",
        Nom: "CMD-2025-458",
        ICE: "123",
        PaysId: "Maroc",
        Adresse: "123 Rue de l'Industrie",
        VilleId: "Casablanca",
        ContactNom: "",
        ContactTelephone: "",
        ContactEmail: "",
        statut: "non activé",
        dateArrivee: "25/02/2025",
      },
      {
        Id: "4",
        Nom: "CMD-2025-458",
        ICE: "123",
        PaysId: "Maroc",
        Adresse: "123 Rue de l'Industrie",
        VilleId: "Casablanca",
        ContactNom: "",
        ContactTelephone: "",
        ContactEmail: "",
        statut: "non activé",
        dateArrivee: "25/02/2025",
      },
      {
        Id: "5",
        Nom: "CMD-2025-458",
        ICE: "123",
        PaysId: "Maroc",
        Adresse: "123 Rue de l'Industrie",
        VilleId: "Casablanca",
        ContactNom: "",
        ContactTelephone: "",
        ContactEmail: "",
        statut: "activé",
        dateArrivee: "25/02/2025",
      },
    ];

    setFournisseurs(fakeFournisseurs);
    setFiltered(fakeFournisseurs);
    setLoading(false);
  }, []);

  const handleSearch = (term: string, status: string) => {
    const lowerTerm = term.toLowerCase();
    const filteredData = fournisseurs.filter((item) => {
      const matchesTerm =
        item.Nom.toLowerCase().includes(lowerTerm) ||
        item.PaysId.toLowerCase().includes(lowerTerm) ||
        item.ContactNom.toLowerCase().includes(lowerTerm);
      const matchesStatus = status ? item.statut === status : true;
      return matchesTerm && matchesStatus;
    });
    setFiltered(filteredData);
  };

  const handleDelete = (id: string) => {
    const updatedFournisseurs = fournisseurs.filter((fournisseur) => fournisseur.Id !== id);
    setFournisseurs(updatedFournisseurs);
    setFiltered(updatedFournisseurs);
    console.log("Suppression :", id);
  };

  const translate = (key: string) => key;
  const handleAddClick = () => {
    navigate("/add-Fournisseur");
  };

  return (
    <div className="container-fluid mt-4">
      {/* CSS intégré */}
      <style>{`
        .page-title {
          font-size: 2.2rem;
          font-weight: 700;
          color: #0f172a;
        }

        .card-header-title {
          font-size: 2rem;
          font-weight: 600;
          color: #0f172a;
        }

        .card-header-subtitle {
          color: #64748b;
          font-size: 1.1rem;
        }
      `}</style>

      {/* En-tête haut de page */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="page-title mb-1">Liste des fournisseurs</h2>
        </div>
        <button className="btn btn-primary btn-add-arrivage" onClick={handleAddClick}>
          <BsPlus className="me-2"/><span>Nouvel Fournisseur</span>
        </button>
      </div>

      {/* Carte contenant tout le bloc */}
      <div className="card border-0 shadow-sm rounded-3 p-4">
        <h5 className="card-header-title mb-1">Fournisseurs</h5>
        <p className="card-header-subtitle mb-4">Liste des fournisseurs de ferraille importée</p>

        {/* Formulaire de recherche */}
        <FournisseurSearchForm onSearch={handleSearch} translate={translate} />

        {/* Tableau des données */}
        <FournisseurDataTable
          data={filtered}
          loading={loading}
          translate={translate}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Fournisseur;