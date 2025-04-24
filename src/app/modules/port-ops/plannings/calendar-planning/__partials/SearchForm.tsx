import React from "react";
import { Formik, Form } from "formik";
import { Form as BootstrapForm, Button, Col, Row } from "react-bootstrap";

interface SearchFormProps {
  onSearch: (selectedDate: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  return (
    <div className="card-body">
      <Formik
        initialValues={{ dateBooking: "" }}
        onSubmit={(values) => {
          onSearch(values.dateBooking);
        }}
      >
        {({ values, handleChange, handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="search-form">
            <Row className="align-items-end">
              {/* Champ Date Booking */}
              <Col md={11} className="mb-3">
                <BootstrapForm.Group controlId="dateBooking">
                  <BootstrapForm.Label>Date planification</BootstrapForm.Label>
                  <BootstrapForm.Control
                    type="date"
                    name="dateBooking"
                    value={values.dateBooking}
                    onChange={handleChange}
                    className="form-control"
                  />
                </BootstrapForm.Group>
              </Col>

              {/* Bouton filtre avec icône */}
              <div className="col-md-1 mb-1 d-flex justify-content-end">
                <button type="submit" className="btn btn-filter with-border">
                  <i className="bi bi-funnel"></i>
                </button>
              </div>
            </Row>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SearchForm;
