import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { createNavire, fetchPays, fetchCompagnieMaritime, fetchPorts } from "../_requests/apiRequests";

interface Pay {
  pays_id: number;
  pays_Nom: string;
}

interface CompagnieMaritime {
  compagnie_Id: number;
  compagnie_NomCompagnie: string;
}

interface Port {
  port_ID: number;
  port_Nom: string;
}

interface NavireResponse {
  items: any[];
  totalItems: number;
}

interface Navire {
  navire_Id: number;
  navire_Nom: string;
  navire_IMO: string;
  navire_CompagnieId: number;
  navire_ImmatriculationPaysId: number;
  navire_ImmatriculationPortId: number;
  navire_AnneeConstruction: number;
  navire_LongueurMettres: number;
  navire_LargeurMetres: number;
  navire_TonnageBrut: number;
  navire_TonnageNet: number;
  navire_DeadweightTonnage: number;
  navire_Observations: string;
  navire_ValidationStatutId: number;
  navire_Active: boolean;
  navire_UserId: string;
}

interface CreateNavireProps {
  show: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateNavire: React.FC<CreateNavireProps> = ({
  show,
  onClose,
  onCreated,
}) => {
  const [loading, setLoading] = useState(false);
  const [pays, setPays] = useState<Pay[]>([]);
  const [compagnies, setCompagnies] = useState<CompagnieMaritime[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const paysResponse: NavireResponse = await fetchPays(1, "");
        setPays(paysResponse.items);
        const compagnieResponse: NavireResponse = await fetchCompagnieMaritime(1, "");
        setCompagnies(compagnieResponse.items);
        const portResponse: NavireResponse = await fetchPorts(1, "");
        setPorts(portResponse.items);
      } catch (err) {
        const error = err as Error;
        console.error("Erreur lors du chargement des données :", error);
        Swal.fire(
          "Erreur",
          error.message || "Échec du chargement des données",
          "error"
        );
      }
    };
    loadData();
  }, []);

  const formik = useFormik({
    initialValues: {
      navire_Nom: "",
      navire_IMO: "",
      navire_CompagnieId: 0,
      navire_ImmatriculationPaysId: 0,
      navire_ImmatriculationPortId: 0,
      navire_AnneeConstruction: 0,
      navire_LongueurMettres: 0,
      navire_LargeurMetres: 0,
      navire_TonnageBrut: 0,
      navire_TonnageNet: 0,
      navire_DeadweightTonnage: 0,
      navire_Observations: "",
      navire_ValidationStatutId: 0,
      navire_Active: true,
      navire_UserId: "",
    },
    validationSchema: Yup.object({
      navire_Nom: Yup.string()
        .required("Le nom du navire est requis")
        .min(2, "Minimum 2 caractères"),
      navire_IMO: Yup.string()
        .required("Le code IMO est requis")
        .matches(
          /IMO\d{7}/,
          "Le code IMO doit être au format IMO suivi de 7 chiffres"
        ),
      navire_CompagnieId: Yup.number()
        .required("La compagnie est requise")
        .min(1, "Sélectionnez une compagnie"),
      navire_ImmatriculationPaysId: Yup.number()
        .required("Le pays d'immatriculation est requis")
        .min(1, "Sélectionnez un pays"),
      navire_ImmatriculationPortId: Yup.number()
        .required("Le port d'immatriculation est requis")
        .min(1, "Sélectionnez un port"),
      navire_AnneeConstruction: Yup.number()
        .required("L'année de construction est requise")
        .min(1800, "L'année doit être supérieure à 1800")
        .max(new Date().getFullYear(), "L'année ne peut pas être dans le futur"),
      navire_LongueurMettres: Yup.number()
        .required("La longueur est requise")
        .min(0, "La longueur doit être positive"),
      navire_LargeurMetres: Yup.number()
        .required("La largeur est requise")
        .min(0, "La largeur doit être positive"),
      navire_TonnageBrut: Yup.number()
        .required("Le tonnage brut est requis")
        .min(0, "Le tonnage brut doit être positif"),
      navire_TonnageNet: Yup.number()
        .required("Le tonnage net est requis")
        .min(0, "Le tonnage net doit être positif"),
      navire_DeadweightTonnage: Yup.number()
        .required("Le tonnage de port en lourd est requis")
        .min(0, "Le tonnage de port en lourd doit être positif"),
      navire_Observations: Yup.string().nullable(),
      navire_ValidationStatutId: Yup.number()
        .required("Le statut de validation est requis")
        .min(0, "Sélectionnez un statut de validation"),
      navire_Active: Yup.boolean().required("Le statut est requis"),
      navire_UserId: Yup.string().required("L'ID utilisateur est requis"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await createNavire(values);
        Swal.fire(
          "Succès",
          "Le navire a été créé avec succès",
          "success"
        );
        onCreated();
        onClose();
      } catch (err) {
        const error = err as Error;
        Swal.fire("Erreur", error.message || "Échec de la création", "error");
        console.error("Erreur création :", error);
      } finally {
        setLoading(false);
      }
    },
  });

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">
              Créer un nouveau navire
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nom du navire</label>
                  <input
                    type="text"
                    name="navire_Nom"
                    className={`form-control ${
                      formik.errors.navire_Nom &&
                      formik.touched.navire_Nom
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.navire_Nom}
                  />
                  {formik.errors.navire_Nom &&
                    formik.touched.navire_Nom && (
                      <div className="invalid-feedback">
                        {formik.errors.navire_Nom}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Code IMO</label>
                  <input
                    type="text"
                    name="navire_IMO"
                    className={`form-control ${
                      formik.errors.navire_IMO &&
                      formik.touched.navire_IMO
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.navire_IMO}
                  />
                  {formik.errors.navire_IMO &&
                    formik.touched.navire_IMO && (
                      <div className="invalid-feedback">
                        {formik.errors.navire_IMO}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Compagnie</label>
                  <select
                    name="navire_CompagnieId"
                    className={`form-control ${
                      formik.errors.navire_CompagnieId &&
                      formik.touched.navire_CompagnieId
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.navire_CompagnieId}
                  >
                    <option value={0}>Sélectionner une compagnie</option>
                    {compagnies.map((c) => (
                      <option key={c.compagnie_Id} value={c.compagnie_Id}>
                        {c.compagnie_NomCompagnie}
                      </option>
                    ))}
                  </select>
                  {formik.errors.navire_CompagnieId &&
                    formik.touched.navire_CompagnieId && (
                      <div className="invalid-feedback">
                        {formik.errors.navire_CompagnieId}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Pays d'immatriculation</label>
                  <select
                    name="navire_ImmatriculationPaysId"
                    className={`form-control ${
                      formik.errors.navire_ImmatriculationPaysId &&
                      formik.touched.navire_ImmatriculationPaysId
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.navire_ImmatriculationPaysId}
                  >
                    <option value={0}>Sélectionner un pays</option>
                    {pays.map((p) => (
                      <option key={p.pays_id} value={p.pays_id}>
                        {p.pays_Nom}
                      </option>
                    ))}
                  </select>
                  {formik.errors.navire_ImmatriculationPaysId &&
                    formik.touched.navire_ImmatriculationPaysId && (
                      <div className="invalid-feedback">
                        {formik.errors.navire_ImmatriculationPaysId}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Port d'immatriculation</label>
                  <select
                    name="navire_ImmatriculationPortId"
                    className={`form-control ${
                      formik.errors.navire_ImmatriculationPortId &&
                      formik.touched.navire_ImmatriculationPortId
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.navire_ImmatriculationPortId}
                  >
                    <option value={0}>Sélectionner un port</option>
                    {ports.map((p) => (
                      <option key={p.port_ID} value={p.port_ID}>
                        {p.port_Nom}
                      </option>
                    ))}
                  </select>
                  {formik.errors.navire_ImmatriculationPortId &&
                    formik.touched.navire_ImmatriculationPortId && (
                      <div className="invalid-feedback">
                        {formik.errors.navire_ImmatriculationPortId}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Année de construction</label>
                  <input
                    type="number"
                    name="navire_AnneeConstruction"
                    className={`form-control ${
                      formik.errors.navire_AnneeConstruction &&
                      formik.touched.navire_AnneeConstruction
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.navire_AnneeConstruction}
                  />
                  {formik.errors.navire_AnneeConstruction &&
                    formik.touched.navire_AnneeConstruction && (
                      <div className="invalid-feedback">
                        {formik.errors.navire_AnneeConstruction}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Longueur (mètres)</label>
                  <input
                    type="number"
                    name="navire_LongueurMettres"
                    className={`form-control ${
                      formik.errors.navire_LongueurMettres &&
                      formik.touched.navire_LongueurMettres
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.navire_LongueurMettres}
                  />
                  {formik.errors.navire_LongueurMettres &&
                    formik.touched.navire_LongueurMettres && (
                      <div className="invalid-feedback">
                        {formik.errors.navire_LongueurMettres}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Largeur (mètres)</label>
                  <input
                    type="number"
                    name="navire_LargeurMetres"
                    className={`form-control ${
                      formik.errors.navire_LargeurMetres &&
                      formik.touched.navire_LargeurMetres
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.navire_LargeurMetres}
                  />
                  {formik.errors.navire_LargeurMetres &&
                    formik.touched.navire_LargeurMetres && (
                      <div className="invalid-feedback">
                        {formik.errors.navire_LargeurMetres}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tonnage brut</label>
                  <input
                    type="number"
                    name="navire_TonnageBrut"
                    className={`form-control ${
                      formik.errors.navire_TonnageBrut &&
                      formik.touched.navire_TonnageBrut
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.navire_TonnageBrut}
                  />
                  {formik.errors.navire_TonnageBrut &&
                    formik.touched.navire_TonnageBrut && (
                      <div className="invalid-feedback">
                        {formik.errors.navire_TonnageBrut}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tonnage net</label>
                  <input
                    type="number"
                    name="navire_TonnageNet"
                    className={`form-control ${
                      formik.errors.navire_TonnageNet &&
                      formik.touched.navire_TonnageNet
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.navire_TonnageNet}
                  />
                  {formik.errors.navire_TonnageNet &&
                    formik.touched.navire_TonnageNet && (
                      <div className="invalid-feedback">
                        {formik.errors.navire_TonnageNet}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tonnage de port en lourd</label>
                  <input
                    type="number"
                    name="navire_DeadweightTonnage"
                    className={`form-control ${
                      formik.errors.navire_DeadweightTonnage &&
                      formik.touched.navire_DeadweightTonnage
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.navire_DeadweightTonnage}
                  />
                  {formik.errors.navire_DeadweightTonnage &&
                    formik.touched.navire_DeadweightTonnage && (
                      <div className="invalid-feedback">
                        {formik.errors.navire_DeadweightTonnage}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Observations</label>
                  <textarea
                    name="navire_Observations"
                    className={`form-control ${
                      formik.errors.navire_Observations &&
                      formik.touched.navire_Observations
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.navire_Observations}
                  ></textarea>
                  {formik.errors.navire_Observations &&
                    formik.touched.navire_Observations && (
                      <div className="invalid-feedback">
                        {formik.errors.navire_Observations}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Statut de validation</label>
                  <select
                    name="navire_ValidationStatutId"
                    className={`form-control ${
                      formik.errors.navire_ValidationStatutId &&
                      formik.touched.navire_ValidationStatutId
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.navire_ValidationStatutId}
                  >
                    <option value={0}>Sélectionner un statut</option>
                    <option value={1}>Validé</option>
                    <option value={2}>En attente</option>
                  </select>
                  {formik.errors.navire_ValidationStatutId &&
                    formik.touched.navire_ValidationStatutId && (
                      <div className="invalid-feedback">
                        {formik.errors.navire_ValidationStatutId}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Statut</label>
                  <select
                    name="navire_Active"
                    className={`form-control ${
                      formik.errors.navire_Active &&
                      formik.touched.navire_Active
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.navire_Active.toString()}
                  >
                    <option value="true">Actif</option>
                    <option value="false">Inactif</option>
                  </select>
                  {formik.errors.navire_Active &&
                    formik.touched.navire_Active && (
                      <div className="invalid-feedback">
                        {formik.errors.navire_Active}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Utilisateur</label>
                  <input
                    type="text"
                    name="navire_UserId"
                    className={`form-control ${
                      formik.errors.navire_UserId &&
                      formik.touched.navire_UserId
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.navire_UserId}
                  />
                  {formik.errors.navire_UserId &&
                    formik.touched.navire_UserId && (
                      <div className="invalid-feedback">
                        {formik.errors.navire_UserId}
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Création..." : "Créer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateNavire;