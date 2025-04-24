import { useAuth } from "../../../../app/modules/auth";
import { useEffect, useState } from "react";
import noUiSlider, { target } from "nouislider";
import { useLayout } from "../../core";
import { DefaultTitle } from "./page-title/DefaultTitle";
import { HeaderUserMenu } from "../../../partials";
import { useRef } from "react"; // ⬅️ Ajoute useRef

const HeaderToolbar = () => {
  const { classes } = useLayout();
  const { currentUser } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null); // ⬅️ Référence de la box

  // 📥 Exemples de notifications (mock)
  const notifications = [
    { id: 1, message: "Nouvelle demande de constat reçue", date: "24/04/2025" },
    {
      id: 2,
      message: "Signature requise pour le document ABC",
      date: "23/04/2025",
    },
    {
      id: 3,
      message: "Mise à jour du statut d'une commande",
      date: "22/04/2025",
    },
  ];
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="toolbar d-flex align-items-stretch position-relative">
      <div
        className={`${classes.headerContainer.join(
          " "
        )} py-6 py-lg-0 d-flex flex-column flex-lg-row align-items-lg-stretch justify-content-lg-end`}
      >
        <DefaultTitle />

        <div className="mt-3 d-flex align-items-center gap-4 me-9">
          {/* 🔔 Icône notification */}
          <div
            style={{ paddingLeft: "16px", cursor: "pointer" }}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#fc5421"
            >
              <path d="M12 2C9.243 2 7 4.243 7 7v1.586C7 9.864 6.632 10.632 6 11.172V16l-2 2v1h16v-1l-2-2v-4.828c-.632-.54-1-1.308-1-2.586V7c0-2.757-2.243-5-5-5zm0 20c1.104 0 2-.896 2-2h-4c0 1.104.896 2 2 2z" />
            </svg>
          </div>

          {/* 👤 Avatar utilisateur */}
          <div style={{ paddingLeft: "16px" }}>
            <div
              className="user-avatar-initials"
              title={`${currentUser?.first_name} ${currentUser?.last_name}`}
              data-kt-menu-trigger="click"
              data-kt-menu-placement="bottom-start"
              data-kt-menu-overflow="false"
            >
              {`${currentUser?.first_name?.[0] ?? ""}${
                currentUser?.last_name?.[0] ?? ""
              }`.toUpperCase()}
            </div>
            <HeaderUserMenu />
          </div>
        </div>
      </div>

      {/* 📦 Affichage notifications */}
      {showNotifications && (
        <div
          ref={boxRef} // 👈 Ici
          className="shadow rounded bg-white px-4 py-3"
          style={{
            position: "absolute",
            top: "70px",
            right: "20px",
            width: "320px",
            zIndex: 1000,
            borderRadius: "12px",
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <strong className="text-dark">Notifications</strong>
            <span className="text-muted small">
              {notifications.length} reçues
            </span>
          </div>

          <div className="d-flex flex-column gap-2">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="border-bottom pb-2 text-dark"
                style={{ fontSize: "14px" }}
              >
                <div>{notif.message}</div>
                <div className="text-muted" style={{ fontSize: "12px" }}>
                  {notif.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { HeaderToolbar };
