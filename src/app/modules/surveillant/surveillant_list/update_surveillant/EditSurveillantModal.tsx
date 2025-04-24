import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { fetchPays, updateSurveillant } from "../../_requests/apiRequests";
// import { updateSurveillant, fetchPays } from "../_requests/apiRequests";

interface Pay {
  pays_id: number;
  pays_Nom: string;
}

interface TypeSurveillant {
  typeSurveillant_Id: number;
  typeSurveillant_Nom: string;
}

interface Surveillant {
  surveillant_Id: number;
  surveillant_TypeSuveillantId: number;
  surveillant_RaisonSociale: string;
  surveillant_Nom: string;
  surveillant_Prenom: string;
  surveillant_Telephone: string;
  surveillant_Email: string;
  surveillant_PaysId: number;
  surveillant_Statut: boolean;
  surveillant_Observations: string;
  surveillant_UserId: string;
}

interface FetchResponse<T> {
  items: T[];
  totalItems: number;
}

// Static list for TypeSurveillant as a workaround
const STATIC_TYPE_SURVEILLANTS: TypeSurveillant[] = [
  { typeSurveillant_Id: 1, typeSurveillant_Nom: "Individuel" },
  { typeSurveillant_Id: 2, typeSurveillant_Nom: "Entreprise" },
];

interface EditSurveillantModalProps {
  show: boolean;
  onClose: () => void;
  onUpdated: () => void;
  surveillant: Surveillant;
}

const EditSurveillantModal: React.FC<EditSurveillantModalProps> = ({
  show,
  onClose,
  onUpdated,
  surveillant,
}) => {
  const [loading, setLoading] = useState(false);
  const [pays, setPays] = useState<Pay[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const paysResponse: FetchResponse<Pay> = await fetchPays(1, "");
        setPays(paysResponse.items);
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
      surveillant_TypeSuveillantId: surveillant.surveillant_TypeSuveillantId,
      surveillant_RaisonSociale: surveillant.surveillant_RaisonSociale,
      surveillant_Nom: surveillant.surveillant_Nom,
      surveillant_Prenom: surveillant.surveillant_Prenom,
      surveillant_Telephone: surveillant.surveillant_Telephone,
      surveillant_Email: surveillant.surveillant_Email,
      surveillant_PaysId: surveillant.surveillant_PaysId,
      surveillant_Statut: surveillant.surveillant_Statut,
      surveillant_Observations: surveillant.surveillant_Observations,
      surveillant_UserId: surveillant.surveillant_UserId,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      surveillant_TypeSuveillantId: Yup.number()
        .required("Le type de surveillant est requis")
        .min(1, "Sélectionnez un type de surveillant"),
      surveillant_RaisonSociale: Yup.string()
        .required("La raison sociale est requise")
        .min(2, "Minimum 2 caractères"),
      surveillant_Nom: Yup.string()
        .required("Le nom est requis")
        .min(2, "Minimum 2 caractères"),
      surveillant_Prenom: Yup.string()
        .required("Le prénom est requis")
        .min(2, "Minimum 2 caractères"),
      surveillant_Telephone: Yup.string()
        .required("Le téléphone est requis")
        .matches(
          /^\+?\d{10,15}$/,
          "Le numéro de téléphone doit contenir 10 à 15 chiffres"
        ),
      surveillant_Email: Yup.string()
        .email("Adresse email invalide")
        .required("L'email est requis"),
      surveillant_PaysId: Yup.number()
        .required("Le pays est requis")
        .min(1, "Sélectionnez un pays"),
      surveillant_Statut: Yup.boolean().required("Le statut est requis"),
      surveillant_Observations: Yup.string().nullable(),
      surveillant_UserId: Yup.string().required("L'ID utilisateur est requis"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await updateSurveillant(surveillant.surveillant_Id, values);
        Swal.fire(
          "Succès",
          "Le surveillant a été modifié avec succès",
          "success"
        );
        onUpdated();
        onClose();
      } catch (err) {
        const error = err as Error;
        Swal.fire(
          "Erreur",
          error.message || "Échec de la modification",
          "error"
        );
        console.error("Erreur modification :", error);
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
            <h5 className="modal-title">Modifier le surveillant</h5>
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
                  <label className="form-label">Type de surveillant</label>
                  <select
                    name="surveillant_TypeSuveillantId"
                    className={`form-control ${
                      formik.errors.surveillant_TypeSuveillantId &&
                      formik.touched.surveillant_TypeSuveillantId
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.surveillant_TypeSuveillantId}
                  >
                    <option value={0}>Sélectionner un type</option>
                    {STATIC_TYPE_SURVEILLANTS.map((t) => (
                      <option key={t.typeSurveillant_Id} value={t.typeSurveillant_Id}>
                        {t.typeSurveillant_Nom}
                      </option>
                    ))}
                  </select>
                  {formik.errors.surveillant_TypeSuveillantId &&
                    formik.touched.surveillant_TypeSuveillantId && (
                      <div className="invalid-feedback">
                        {formik.errors.surveillant_TypeSuveillantId}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Raison sociale</label>
                  <input
                    type="text"
                    name="surveillant_RaisonSociale"
                    className={`form-control ${
                      formik.errors.surveillant_RaisonSociale &&
                      formik.touched.surveillant_RaisonSociale
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.surveillant_RaisonSociale}
                  />
                  {formik.errors.surveillant_RaisonSociale &&
                    formik.touched.surveillant_RaisonSociale && (
                      <div className="invalid-feedback">
                        {formik.errors.surveillant_RaisonSociale}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nom</label>
                  <input
                    type="text"
                    name="surveillant_Nom"
                    className={`form-control ${
                      formik.errors.surveillant_Nom &&
                      formik.touched.surveillant_Nom
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.surveillant_Nom}
                  />
                  {formik.errors.surveillant_Nom &&
                    formik.touched.surveillant_Nom && (
                      <div className="invalid-feedback">
                        {formik.errors.surveillant_Nom}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Prénom</label>
                  <input
                    type="text"
                    name="surveillant_Prenom"
                    className={`form-control ${
                      formik.errors.surveillant_Prenom &&
                      formik.touched.surveillant_Prenom
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.surveillant_Prenom}
                  />
                  {formik.errors.surveillant_Prenom &&
                    formik.touched.surveillant_Prenom && (
                      <div className="invalid-feedback">
                        {formik.errors.surveillant_Prenom}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Téléphone</label>
                  <input
                    type="text"
                    name="surveillant_Telephone"
                    className={`form-control ${
                      formik.errors.surveillant_Telephone &&
                      formik.touched.surveillant_Telephone
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.surveillant_Telephone}
                  />
                  {formik.errors.surveillant_Telephone &&
                    formik.touched.surveillant_Telephone && (
                      <div className="invalid-feedback">
                        {formik.errors.surveillant_Telephone}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="surveillant_Email"
                    className={`form-control ${
                      formik.errors.surveillant_Email &&
                      formik.touched.surveillant_Email
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.surveillant_Email}
                  />
                  {formik.errors.surveillant_Email &&
                    formik.touched.surveillant_Email && (
                      <div className="invalid-feedback">
                        {formik.errors.surveillant_Email}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Pays</label>
                  <select
                    name="surveillant_PaysId"
                    className={`form-control ${
                      formik.errors.surveillant_PaysId &&
                      formik.touched.surveillant_PaysId
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.surveillant_PaysId}
                  >
                    <option value={0}>Sélectionner un pays</option>
                    {pays.map((p) => (
                      <option key={p.pays_id} value={p.pays_id}>
                        {p.pays_Nom}
                      </option>
                    ))}
                  </select>
                  {formik.errors.surveillant_PaysId &&
                    formik.touched.surveillant_PaysId && (
                      <div className="invalid-feedback">
                        {formik.errors.surveillant_PaysId}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Statut</label>
                  <select
                    name="surveillant_Statut"
                    className={`form-control ${
                      formik.errors.surveillant_Statut &&
                      formik.touched.surveillant_Statut
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.surveillant_Statut.toString()}
                  >
                    <option value="true">Actif</option>
                    <option value="false">Inactif</option>
                  </select>
                  {formik.errors.surveillant_Statut &&
                    formik.touched.surveillant_Statut && (
                      <div className="invalid-feedback">
                        {formik.errors.surveillant_Statut}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Observations</label>
                  <textarea
                    name="surveillant_Observations"
                    className={`form-control ${
                      formik.errors.surveillant_Observations &&
                      formik.touched.surveillant_Observations
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.surveillant_Observations}
                  ></textarea>
                  {formik.errors.surveillant_Observations &&
                    formik.touched.surveillant_Observations && (
                      <div className="invalid-feedback">
                        {formik.errors.surveillant_Observations}
                      </div>
                    )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Utilisateur</label>
                  <input
                    type="text"
                    name="surveillant_UserId"
                    className={`form-control ${
                      formik.errors.surveillant_UserId &&
                      formik.touched.surveillant_UserId
                        ? "is-invalid"
                        : ""
                    }`}
                    onChange={formik.handleChange}
                    value={formik.values.surveillant_UserId}
                  />
                  {formik.errors.surveillant_UserId &&
                    formik.touched.surveillant_UserId && (
                      <div className="invalid-feedback">
                        {formik.errors.surveillant_UserId}
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
                {loading ? "Modification..." : "Modifier"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSurveillantModal;