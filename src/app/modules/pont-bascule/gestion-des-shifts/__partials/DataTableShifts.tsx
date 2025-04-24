import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { BsTrash } from "react-icons/bs";

interface Conducteur {
  nom: string;
  prenom: string;
  cin: string;
}

interface Affectation {
  id: number;
  matricule: string;
  conducteur: Conducteur;
}

interface ShiftDataTableProps {
  data: Affectation[];
  onDelete: (id: number) => void;
  loading: boolean;
}

const ShiftDataTable: React.FC<ShiftDataTableProps> = ({ data, onDelete, loading }) => {
  const ActionsTemplate = (rowData: Affectation) => (
    <BsTrash
      className="text-danger"
      style={{ cursor: "pointer" }}
      onClick={() => onDelete(rowData.id)}
    />
  );

  const ConducteurTemplate = (rowData: Affectation) =>
    `${rowData.conducteur.nom} ${rowData.conducteur.prenom} (${rowData.conducteur.cin})`;

  return (
    <DataTable
      value={data}
      rows={5}
      loading={loading}
      dataKey="id"
      responsiveLayout="scroll"
      emptyMessage="Aucune donnée trouvée"
    >
      <Column field="matricule" header="Matricule" />
      <Column header="Conducteur" body={ConducteurTemplate} />
      <Column header="Action" body={ActionsTemplate} style={{ textAlign: "center", width: "6rem" }} />
    </DataTable>
  );
};

export default ShiftDataTable;
