import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { BsPencilSquare, BsSave, BsXCircle } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";

interface Fournisseur {
  Id: string;
  Nom: string;
  TypeId: string;
  IdentifiantFiscal: string;
  RC: string;
  ICE: string;
  SIRET: string;
  PaysId: string;
  Adresse: string;
  VilleId: string;
  Telephone: string;
  Email: string;
  DeviseId: string;
  ModePaiementId: string;
  IBAN: string;
  SWIFT: string;
  RIB: string;
  ContactNom: string;
  ContactTelephone: string;
  ContactEmail: string;
  Statut: string;
  DateCreation: string;
  UserId: string;
  Observations: string;
  dateArrivee?: string;
}

const DetailsFournisseur: React.FC = () => {
  const [fournisseur, setFournisseur] = useState<Fournisseur | null>(null);
  const [formData, setFormData] = useState<Fournisseur | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    general: false,
    contact: false,
    bancaire: false,
    additionnelle: false,
  });
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine the mode based on the URL
  const isEditing = location.pathname.includes("edit");

  useEffect(() => {
    const fetchFournisseurDetails = async () => {
      setLoading(true);

      // Fetch the supplier data
      const mockData: Fournisseur = {
        Id: id || "1",
        Nom: "CMD-2025-458",
        TypeId: "1",
        IdentifiantFiscal: "IF123456",
        RC: "RC789",
        ICE: "123",
        SIRET: "SIRET456",
        PaysId: "Maroc",
        Adresse: "123 Rue de l'Industrie",
        VilleId: "Casablanca",
        Telephone: "+212 522 123 456",
        Email: "contact@cmd.com",
        DeviseId: "MAD",
        ModePaiementId: "Virement",
        IBAN: "MA123456789",
        SWIFT: "CMD123",
        RIB: "123456789",
        ContactNom: "Jean Dupont",
        ContactTelephone: "+212 600 123 456",
        ContactEmail: "jean.dupont@cmd.com",
        Statut: "activé",
        DateCreation: "25/02/2025",
        UserId: "USER1",
        Observations: "Fournisseur principal de ferraille",
        dateArrivee: "25/02/2025",
      };
      setFournisseur(mockData);
      setFormData(mockData);

      // If in edit mode, open all sections
      if (isEditing) {
        setOpenSections({
          general: true,
          contact: true,
          bancaire: true,
          additionnelle: true,
        });
      }

      setLoading(false);
    };

    fetchFournisseurDetails();
  }, [id, isEditing]);

  // const getBadgeClass = (status: string) => {
  //   switch (status) {
  //     case "activé":
  //       return "badge badge-success";
  //     case "non activé":
  //       return "badge badge-danger";
  //     default:
  //       return "badge badge-secondary";
  //   }
  // };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = format(date, "dd/MM/yyyy");
      setFormData((prev) => (prev ? { ...prev, DateCreation: formattedDate } : null));
    }
  };

  const handleEditToggle = () => {
    // Navigate to edit mode
    navigate(`/details-fournisseur/${id}/edit`);
  };

  const handleCancel = () => {
    if (isEditing) {
      // Reset form data and navigate back to view mode
      setFormData(fournisseur);
      setOpenSections({
        general: false,
        contact: false,
        bancaire: false,
        additionnelle: false,
      });
      navigate(`/details-fournisseur/${id}`); // Updated to plural
    } else {
      // If in view mode, go back to the list
      navigate("/fournisseurs");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSave = async () => {
    if (!formData) return;

    try {
      console.log("Saving data:", formData);
      setFournisseur(formData);
      setOpenSections({
        general: false,
        contact: false,
        bancaire: false,
        additionnelle: false,
      });
      navigate("/liste_fournisseurs");
    } catch (error) {
      console.error("Error saving fournisseur:", error);
    }
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (loading) {
    return <div className="container-fluid mt-4">Chargement...</div>;
  }

  if (!fournisseur || !formData) {
    return <div className="container-fluid mt-4">Fournisseur non trouvé</div>;
  }

  const parsedDate = formData.DateCreation
    ? parse(formData.DateCreation, "dd/MM/yyyy", new Date())
    : new Date();

  return (
    <div className="container-fluid mt-4">
      <style>{`
        .page-title {
          font-size: 2.2rem;
          font-weight: 700;
          color: #0f172a;
        }
        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 0;
        }
        .form-label {
          font-weight: 500;
          color: #495057;
          font-size: 0.95rem;
          margin-bottom: 0.25rem;
        }
        .form-control {
          margin-bottom: 1rem;
          background-color: ${isEditing ? "#fff" : "#f8f9fa"};
          border: ${isEditing ? "1px solid #ced4da" : "none"};
          color: #64748b;
          font-size: 0.95rem;
        }
        .form-control:disabled {
          background-color: #f8f9fa;
          opacity: 1;
        }
        .badge-success {
          background-color: #28a745;
          color: white;
          padding: 0.3rem 0.75rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        .badge-danger {
          background-color: #dc3545;
          color: white;
          padding: 0.3rem 0.75rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        .btn-action {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-radius: 10px;
          padding: 0.65rem 1.25rem;
          font-weight: 500;
          font-size: 0.95rem;
          margin-left: 10px;
        }
        .btn-back {
          color: #0f172a;
          text-decoration: none;
          font-size: 0.95rem;
        }
        .btn-back:hover {
          text-decoration: underline;
        }
        .btn-edit {
          background-color: #f28c38;
          color: white;
          border: none;
        }
        .btn-save {
          background-color: #28a745;
          color: white;
          border: none;
        }
        .btn-cancel {
          background-color: #dc3545;
          color: white;
          border: none;
        }
        .react-datepicker-wrapper {
          display: block;
        }
        .react-datepicker-popper {
          z-index: 1000;
        }
        .accordion-item{
          border: none !important;
        }
        .accordion-button {
          background-color: #f8f9fa;
          color: #0f172a;
          font-weight: 600;
          padding: 1rem;
          margin-bottom: 2rem;
          border-radius: 0.5rem;          
        }
        .accordion-button:child(last-child) {
          margin-bottom: 0rem;
        }
        .accordion-button:not(.collapsed) {
          background-color: #e9ecef;
          color: #0f172a;
        }
        .accordion-body {
          padding: 1.5rem;
          border: var(--bs-accordion-border-width) solid var(--bs-accordion-border-color);
          margin-bottom: 1.2rem;
        }
        .accordion-body-flex{
          display: flex;
          flex-column;
          gap: 1rem;
        }
        
        .groupe-form{
          width: 100%;
        }
      `}</style>


      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-1">
          {isEditing ? "Modifier Fournisseur" : "Détails du Fournisseur"}
        </h2>
        <div>
          <button
            className="btn btn-secondary btn-action"
            onClick={handleBack}
          >
            <span>←</span> <span>Retour</span>
          </button>
        </div>
      </div>

      <div className="accordion" id="fournisseurAccordion">
        {/* Informations Générales */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingGeneral">
            <button
              className={`accordion-button ${openSections.general ? "" : "collapsed"}`}
              type="button"
              onClick={() => toggleSection("general")}
              aria-expanded={openSections.general}
              aria-controls="collapseGeneral"
            >
              Informations Générales
            </button>
          </h2>
          <div
            id="collapseGeneral"
            className={`accordion-collapse collapse ${openSections.general ? "show" : ""}`}
            aria-labelledby="headingGeneral"
          >
            <div className="accordion-body">
              <div className="accordion-body-flex">
                <div className="groupe-form">
                  <div className="form-label">Nom</div>
                  <input
                    type="text"
                    name="Nom"
                    value={formData.Nom}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!isEditing}
                  />
                </div>
                <div className="groupe-form">
                  <div className="form-label">ICE</div>
                  <input
                    type="text"
                    name="ICE"
                    value={formData.ICE}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!isEditing}
                  />
                </div>
                <div className="groupe-form">
                  <div className="form-label">Identifiant Fiscal</div>
                  <input
                    type="text"
                    name="IdentifiantFiscal"
                    value={formData.IdentifiantFiscal}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="accordion-body-flex">
                <div className="groupe-form">
                  <div className="form-label">RC</div>
                  <input
                    type="text"
                    name="RC"
                    value={formData.RC}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!isEditing}
                  />
                </div>
                <div className="groupe-form">
                  <div className="form-label">SIRET</div>
                  <input
                    type="text"
                    name="SIRET"
                    value={formData.SIRET}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!isEditing}
                  />
                </div>
                <div className="groupe-form">
                  <div className="form-label">Statut</div>
                  <input
                    type="text"
                    name="Statut"
                    value={formData.Statut}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="accordion-body-flex">
                <div className="groupe-form">
                  <div className="form-label">Date de Création</div>
                  {isEditing ? (
                    <DatePicker
                      selected={parsedDate}
                      onChange={handleDateChange}
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      placeholderText="Sélectionnez une date"
                    />
                  ) : (
                    <input
                      type="text"
                      value={fournisseur.DateCreation}
                      className="form-control"
                      disabled
                    />
                  )}
                </div>
                <div className="groupe-form"></div>
                <div className="groupe-form"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations de Contact */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingContact">
            <button
              className={`accordion-button ${openSections.contact ? "" : "collapsed"}`}
              type="button"
              onClick={() => toggleSection("contact")}
              aria-expanded={openSections.contact}
              aria-controls="collapseContact"
            >
              Informations de Contact
            </button>
          </h2>
          <div
            id="collapseContact"
            className={`accordion-collapse collapse ${openSections.contact ? "show" : ""}`}
            aria-labelledby="headingContact"
          >
            <div className="accordion-body">
              <div className="accordion-body-flex">
                <div className="groupe-form">
                  <div className="form-label">Pays</div>
                  <input
                    type="text"
                    name="PaysId"
                    value={formData.PaysId}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!isEditing}
                  />
                </div>
                <div className="groupe-form">
                  <div className="form-label">Ville</div>
                  <input
                    type="text"
                    name="VilleId"
                    value={formData.VilleId}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!isEditing}
                  />
                </div>
                <div className="groupe-form">
                  <div className="form-label">Adresse</div>
                  <input
                    type="text"
                    name="Adresse"
                    value={formData.Adresse}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="accordion-body-flex">
                <div className="groupe-form">
                  <div className="form-label">Téléphone</div>
                  <input
                    type="text"
                    name="Telephone"
                    value={formData.Telephone}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!isEditing}
                  />
                </div>
                <div className="groupe-form">
                  <div className="form-label">Email</div>
                  <input
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!isEditing}
                  />
                </div>
                <div className="groupe-form">
                  <div className="form-label">Contact Principal</div>
                  <input
                    type="text"
                    name="ContactNom"
                    value={formData.ContactNom}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="accordion-body-flex">
                <div className="groupe-form">
                  <div className="form-label">Téléphone Contact</div>
                  <input
                    type="text"
                    name="ContactTelephone"
                    value={formData.ContactTelephone}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!isEditing}
                  />
                </div>
                <div className="groupe-form">
                  <div className="form-label">Email Contact</div>
                  <input
                    type="email"
                    name="ContactEmail"
                    value={formData.ContactEmail}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!isEditing}
                  />
                </div>
                <div className="groupe-form"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations Bancaires */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingBancaire">
            <button
              className={`accordion-button ${openSections.bancaire ? "" : "collapsed"}`}
              type="button"
              onClick={() => toggleSection("bancaire")}
              aria-expanded={openSections.bancaire}
              aria-controls="collapseBancaire"
            >
              Informations Bancaires
            </button>
          </h2>
          <div
            id="collapseBancaire"
            className={`accordion-collapse collapse ${openSections.bancaire ? "show" : ""}`}
            aria-labelledby="headingBancaire"
          >
            <div className="accordion-body">
              <div className="accordion-body-flex">
                <div className="groupe-form">
                  <div className="form-label">Devise</div>
                  <input
                    type="text"
                    name="DeviseId"
                    value={formData.DeviseId}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!isEditing}
                  />
                </div>
                <div className="groupe-form">
                  <div className="form-label">Mode de Paiement</div>
                  <input
                    type="text"
                    name="ModePaiementId"
                    value={formData.ModePaiementId}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!isEditing}
                  />
                </div>
                <div className="groupe-form">
                  <div className="form-label">IBAN</div>
                  <input
                    type="text"
                    name="IBAN"
                    value={formData.IBAN}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="accordion-body-flex">
                <div className="groupe-form">
                  <div className="form-label">SWIFT</div>
                  <input
                    type="text"
                    name="SWIFT"
                    value={formData.SWIFT}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!isEditing}
                  />
                </div>
                <div className="groupe-form">
                  <div className="form-label">RIB</div>
                  <input
                    type="text"
                    name="RIB"
                    value={formData.RIB}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!isEditing}
                  />
                </div>
                <div className="groupe-form"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations Additionnelles */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingAdditionnelle">
            <button
              className={`accordion-button ${openSections.additionnelle ? "" : "collapsed"}`}
              type="button"
              onClick={() => toggleSection("additionnelle")}
              aria-expanded={openSections.additionnelle}
              aria-controls="collapseAdditionnelle"
            >
              Informations Additionnelles
            </button>
          </h2>
          <div
            id="collapseAdditionnelle"
            className={`accordion-collapse collapse ${openSections.additionnelle ? "show" : ""}`}
            aria-labelledby="headingAdditionnelle"
          >
            <div className="accordion-body">
              <div className="accordion-body-flex">
                <div className="groupe-form">
                  <div className="form-label">Créé par (User ID)</div>
                  <input
                    type="text"
                    name="UserId"
                    value={formData.UserId}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!isEditing}
                  />
                </div>
                <div className="groupe-form">
                  <div className="form-label">Observations</div>
                  <textarea
                    name="Observations"
                    value={formData.Observations}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!isEditing}
                  />
                </div>
                <div className="groupe-form"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!isEditing ? (
        <button className="btn btn-action btn-edit float-end mt-4" onClick={handleEditToggle}>
          <BsPencilSquare className="me-2" /> Modifier
        </button>
      ) : (
        <div className="d-flex justify-content-end mt-4">
          <button className="btn btn-action btn-cancel" onClick={handleCancel}>
            <BsXCircle className="me-2" /> Annuler
          </button>
          <button className="btn btn-action btn-save" onClick={handleSave}>
            <BsSave className="me-2" /> Enregistrer
          </button>
        </div>
      )}
    </div>
  );
};

export default DetailsFournisseur;