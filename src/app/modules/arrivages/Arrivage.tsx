import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "react-bootstrap";
import {
  BsInfoCircle,
  BsPencilSquare,
  BsTrash,
  BsCreditCard,
  BsTruck,
  BsClipboardCheck,
} from "react-icons/bs";
import Swal from "sweetalert2";
import { getArrivageList } from "./core/_requests";
import { useNavigate } from "react-router-dom";
import ArrivageSearchForm from "./__partials/ArrivageSearchForm";

interface Arrivage {
  arrivage_Id: number;
  arrivage_NumeroFactureProforma: string;
  arrivage_DateBooking: string;
  arrivage_TonnageTotal: number | null;
  arrivage_ToleranceTonnage: number | null;
  arrivage_CoutFinancement: number | null;
  arrivage_CoutFretEnDevise: number | null;
  arrivage_DateCreation: string;
  arrivage_DateDepotLettreCredit: string | null;
  arrivage_DateLimiteChargement: string | null;
  arrivage_DelaiPaiment: number | null;
  arrivage_PrixUnitaireTotale: number;
  arrivage_Incoterm: string | null;
  arrivage_TauxChangement: number;
  arrivage_ModalitePayment: string | null;
  arrivage_Actif: boolean;
  arrivage_StatutInsertion: number;
  arrivage_DeviseId: number;
  arrivage_UserId: string;
}

interface ArrivageResponse {
  items: Arrivage[];
  totalItems: number;
}

interface SearchParams {
  searchTerm: string;
  status: string;
  view: string;
}

const Arrivage: React.FC = () => {
  const [arrivages, setArrivages] = useState<Arrivage[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    searchTerm: "",
    status: "",
    view: "",
  });
  const navigate = useNavigate();

  const loadArrivages = async (pageNum: number, params: SearchParams) => {
    setLoading(true);
    try {
      // Assume getArrivageList is modified to accept searchParams
      const response: ArrivageResponse = await getArrivageList(
        pageNum,
        params.searchTerm,
        
      );
      setArrivages(response.items);
      const calculatedTotalPages = Math.ceil(response.totalItems / 5);
      setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
    } catch (err) {
      const error = err as Error;
      console.error("Erreur lors du chargement des arrivages :", error);
      Swal.fire(
        "Erreur",
        error.message || "Échec du chargement des arrivages",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArrivages(page, searchParams);
  }, [page, searchParams]);

  useEffect(() => {
    setPage(1);
  }, [searchParams]); // Reset to page 1 when search params change

  const handleSearch = (searchTerm: string, status: string, view?: string) => {
    setSearchParams({
      searchTerm,
      status,
      view: view || "",
    });
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <li key="1" className="page-item">
          <button className="page-link" onClick={() => setPage(1)}>
            1
          </button>
        </li>
      );
      if (startPage > 2) {
        items.push(
          <li key="ellipsis1" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <li key={i} className={`page-item ${page === i ? "active" : ""}`}>
          <button className="page-link" onClick={() => setPage(i)}>
            {i}
          </button>
        </li>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <li key="ellipsis2" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
      items.push(
        <li key={totalPages} className="page-item">
          <button className="page-link" onClick={() => setPage(totalPages)}>
            {totalPages}
          </button>
        </li>
      );
    }
    return items;
  };

  const StatusTemplate = (rowData: Arrivage) => {
    // Use arrivage_StatutInsertion or arrivage_Actif for status display
    let statusText = "Non défini";
    let className = "badge-status badge-secondary";

    if (rowData.arrivage_StatutInsertion === 1) {
      statusText = "En attente Service Site";
      className = "badge-status badge-success";
    } else if (rowData.arrivage_StatutInsertion === 0) {
      statusText = "En attente Service Logistique";
      className = "badge-status badge-warning";
    }
    else if (rowData.arrivage_StatutInsertion === 2) {
      statusText = "En attente Service Finance";
      className = "badge-status bg-primary";
    }

    if (!rowData.arrivage_Actif) {
      statusText = "Inactif";
      className = "badge-status badge-danger";
    }

    return <span className={className}>{statusText}</span>;
  };

  const ActionsTemplate = (rowData: Arrivage) => (
    <Dropdown align="end" autoClose="outside">
      <Dropdown.Toggle
        variant="light"
        size="sm"
        className="border-0 no-caret-toggle"
      >
        <i className="bi bi-three-dots-vertical"></i>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Header>Actions</Dropdown.Header>
        <Dropdown.Item
          onClick={() => navigate(`/consultation/${rowData.arrivage_Id}`)}
        >
          <BsInfoCircle className="me-2 text-info" /> Consultation
        </Dropdown.Item>
        
        <Dropdown.Item
          onClick={() => navigate(`/paiement/${rowData.arrivage_Id}`)}
        >
          <BsCreditCard className="me-2 text-success" /> Modalité de paiement
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => navigate(`/logistique/${rowData.arrivage_Id}`)}
        >
          <BsTruck className="me-2 text-warning" /> Logistique
        </Dropdown.Item>
        <Dropdown.Item>
          <BsClipboardCheck className="me-2 text-secondary" /> Qualification
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item className="text-danger" onClick={() => {}}>
          <BsTrash className="me-2" /> Supprimer
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  const DateTemplate = (dateString: string | null) => {
    if (!dateString)
      return <span className="text-muted fst-italic">Non défini</span>;
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  return (
    <div>
      {/* Title */}
      <div className="border-0 pt-5">
        <h3 className="d-flex flex-column align-items-start">
          <span className="fw-900 text-dark">Arrivages</span>
          <span className="text-muted mt-1 fw-semibold fs-7">
            Liste des Arrivages
          </span>
        </h3>
      </div>
      <div className="mt-10"></div>
      <div className="card shadow-sm">
        <div
          style={{
            marginLeft: "10px",
            marginRight: "10px",
            marginBottom: "10px",
            marginTop:"10px"
          }}
        >
          <ArrivageSearchForm onSearch={handleSearch} />
        </div>

        <div
          style={{
            marginLeft: "10px",
            marginRight: "10px",
            marginBottom: "10px",
          }}
        >
          <DataTable
            value={arrivages}
            loading={loading}
            emptyMessage="Aucun arrivage trouvé"
            dataKey="arrivage_Id"
            responsiveLayout="scroll"
          >
            <Column
              field="arrivage_NumeroFactureProforma"
              header="N° Facture"
            />
            <Column
              field="arrivage_TonnageTotal"
              header="Tonnage"
              body={(rowData) =>
                rowData.arrivage_TonnageTotal || (
                  <span className="text-muted fst-italic">Non défini</span>
                )
              }
            />
            <Column
              field="arrivage_DateBooking"
              header="Date Booking"
              body={(rowData) => DateTemplate(rowData.arrivage_DateBooking)}
            />
            <Column
              field="arrivage_DateLimiteChargement"
              header="Date Limite Chargement"
              body={(rowData) =>
                DateTemplate(rowData.arrivage_DateLimiteChargement)
              }
            />
            <Column
              header="Incoterm"
              body={(rowData) =>
                rowData.arrivage_Incoterm || (
                  <span className="text-muted fst-italic">Non défini</span>
                )
              }
            />
            <Column
              header="Prix Unitaire"
              body={(rowData) =>
                rowData.arrivage_PrixUnitaireTotale ? (
                  `${rowData.arrivage_PrixUnitaireTotale}`
                ) : (
                  <span className="text-muted fst-italic">Non défini</span>
                )
              }
            />
            <Column
              header="Modalité Paiement"
              body={(rowData) =>
                rowData.arrivage_ModalitePayment || (
                  <span className="text-muted fst-italic">Non défini</span>
                )
              }
            />
            <Column header="Statut" body={StatusTemplate} />
            <Column
              header="Date de création"
              body={(rowData) => DateTemplate(rowData.arrivage_DateCreation)}
            />
            <Column
              header="Actions"
              body={ActionsTemplate}
              style={{ textAlign: "center", width: "6rem" }}
            />
          </DataTable>
        </div>
      </div>
      <div className="mt-10"></div>

      {totalPages > 1 && (
        <div
          className="pagination-container mt-3"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <ul className="pagination mb-0">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                «
              </button>
            </li>
            {renderPaginationItems()}
            <li
              className={`page-item ${page === totalPages ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                »
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Arrivage;