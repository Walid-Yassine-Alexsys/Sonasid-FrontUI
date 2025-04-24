import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg, EventContentArg } from "@fullcalendar/core";
import { Modal } from "react-bootstrap";

interface CalendarViewProps {
  events: any[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ events }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedEvent(clickInfo.event);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  const renderEventContent = (eventInfo: EventContentArg) => (
    <>
      <b>{eventInfo.timeText}</b> <i>{eventInfo.event.title}</i>
    </>
  );

  return (
    <div className="w-100 card mb-9 p-4">
      <div className="card-body">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // ✅ Ajout timeGridPlugin
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay", // ✅ Ajout des vues
          }}
          events={events}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
        />

        {/* Modal d'information */}
        <Modal show={modalVisible} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Détails de l'événement</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedEvent && (
              <div style={{ fontFamily: "Readex Pro", fontSize: "1rem" }}>
                <p>
                  <strong>Statut:</strong>{" "}
                  {selectedEvent.extendedProps.PlanningArrivage_Statut}
                </p>
                <p>
                  <strong>Date création:</strong>{" "}
                  {selectedEvent.extendedProps.PlanningArrivage_DateCreation}
                </p>
                <p>
                  <strong>Date statut:</strong>{" "}
                  {selectedEvent.extendedProps.PlanningArrivage_DateStatut}
                </p>
                <p>
                  <strong>Motif rejet:</strong>{" "}
                  {selectedEvent.extendedProps.PlanningArrivage_MotifRejet || "—"}
                </p>
                <p>
                  <strong>Créé par:</strong>{" "}
                  {selectedEvent.extendedProps.PlanningArrivage_UserId}
                </p>
              </div>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default CalendarView;
