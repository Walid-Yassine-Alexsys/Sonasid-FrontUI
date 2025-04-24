import React from "react";
import { Formik, Form, Field } from "formik";

interface SearchFormProps {
  onSearch: (searchTerm: string, status: string, view?: string) => void;
  translate: (key: string) => string;
}

const ArrivageSearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  translate,
}) => {
  return (
    <div className="card-body">
      <Formik
        initialValues={{ searchTerm: "", status: "", view: "" }}
        onSubmit={(values) => {
          onSearch(values.searchTerm, values.status, values.view);
        }}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="search-form">
            <div className="row align-items-center">
              {/* Champ de recherche avec icône */}
              <div className="col-md-7 mb-3 search-icon-wrapper">
                <i className="bi bi-search"></i>
                <Field
                  name="searchTerm"
                  className="form-control"
                  placeholder="Rechercher par ID, commande ou fournisseur…"
                />
              </div>

              {/* Sélecteur de statut */}
              <div className="col-md-2 mb-3">
                <Field as="select" name="status" className="form-select">
                  <option value="">{translate("Tous les statuts")}</option>
                  <option value="En cours">En cours</option>
                  <option value="Planifié">Planifié</option>
                  <option value="En transit">En transit</option>
                </Field>
              </div>
              <div className="col-md-2 mb-3">
                <Field as="select" name="view" className="form-select">
                  <option value="">Toutes les vues</option>
                  <option value="Vue Service Achat">Vue Service Achat</option>
                  <option value="Vue Service Finance">
                    Vue Service Finance
                  </option>
                  <option value="Vue Service Logistique">
                    Vue Service Logistique
                  </option>
                </Field>
              </div>
              {/* Bouton filtre avec icône */}
              <div className="col-md-1 mb-3 d-flex justify-content-end">
                <button type="submit" className="btn btn-filter with-border">
                  <i className="bi bi-funnel"></i>
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ArrivageSearchForm;
