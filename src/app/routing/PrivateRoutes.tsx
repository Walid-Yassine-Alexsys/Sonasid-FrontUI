import { FC, lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { MasterLayout } from "../../_metronic/layout/MasterLayout";
import TopBarProgress from "react-topbar-progress-indicator";
import { DashboardWrapper } from "../pages/dashboard/DashboardWrapper";
import { MenuTestPage } from "../pages/MenuTestPage";
import { getCSSVariableValue } from "../../_metronic/assets/ts/_utils";
import { WithChildren } from "../../_metronic/helpers";

import Fournisseur from "../modules/gestion_des_referenciels/fournisseur/list/Fournisseur";
import AddFournisseur from "../modules/gestion_des_referenciels/fournisseur/add/AddFournisseur";
import DetailsFournisseur from "../modules/gestion_des_referenciels/fournisseur/details/DetailsFournisseur";
import Arrivage from "../modules/arrivages/Arrivage";
import AddArrivage from "../modules/arrivages/AddArrivage";
import Consultation from "../modules/arrivages/Consultation";
import Logistique from "../modules/arrivages/Logistique";
import GestionShifts from "../modules/pont-bascule/gestion-des-shifts/GestionShifts";
import Pesage from "../modules/pont-bascule/pesage/Pesage";
import Parametrage from "../modules/pont-bascule/parametrage/Parametrage";
import PayList from "../modules/pays/paysList/PayList";
import CompagnieMaritimeList from "../modules/compagnie_maritime/compagnie_maritime_list/CompagnieMaritimeList";
import PortList from "../modules/port/port_list/PortList";

import NavireList from "../modules/navire/navire_list/NavireList";
import SurveillantList from "../modules/surveillant/surveillant_list/SurveillantList";


import CreatePlanning from "../modules/port-ops/plannings/createPlanning/CreatePlanning";
import UpdatePlanning from "../modules/port-ops/plannings/updatePlanning/UpdatePlanning";

// import CompagnieMaritimeDetails from "../modules/compagnie_maritime/compagnie_maritime_list/details_compagnie_maritime/CompagnieMaritimeDetails";

import Paiement from "../modules/arrivages/Paiement ";
import FournisseurTypeList from "../modules/gestion_des_referenciels/fournisseurType/FournisseurTypeList/FournisseurTypeList";
import VilleList from "../modules/gestion_des_referenciels/ville/villeList/VilleList";
import BanqueList from "../modules/gestion_des_referenciels/banque/banqueList/BanqueList";
import DeviseList from "../modules/gestion_des_referenciels/devises/devisesList/DevisesList";
import QualiteList from "../modules/gestion_des_referenciels/qualite/qualiteList/QualiteList";
import ConditionList from "../modules/gestion_des_referenciels/conditionContrat/ConditionContratList/ConditionContratList";

import PieceTypeList from "../modules/gestion_des_referenciels/pieceType/PieceTypeList/PieceTypeList";
import SiteList from "../modules/gestion_des_referenciels/Sites/siteList/SiteList";
import ZoneDestinationList from "../modules/gestion_des_referenciels/zoneDestination/ZoneDestinationList/ZoneDestinationList";
import Planification from "../modules/port-ops/plannings/calendar-planning/Planification";



//
/* Import Fournisseur Start */

/* Import Fournisseur End */

/* Import Pays End */

const PrivateRoutes = () => {
  const AccountPage = lazy(() => import("../modules/accounts/AccountPage"));
  const WidgetsPage = lazy(() => import("../modules/widgets/WidgetsPage"));
  const ChatPage = lazy(() => import("../modules/apps/chat/ChatPage"));
  const UsersPage = lazy(
    () => import("../modules/apps/user-management/UsersPage")
  );

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path="auth/*" element={<Navigate to="/arrivage" />} />
        {/* Pages */}
        <Route path="dashboard" element={<DashboardWrapper />} />

        {/* <Route
          path="builder"
          element={
            <SuspensedView>
              <BuilderPageWrapper />
            </SuspensedView>
          }
        /> */}
        {/* <Route path="menu-test" element={<MenuTestPage />} /> */}

        <Route path="menu-test" element={<MenuTestPage />} />
        {/* Lazy Modules */}
        <Route path="menu-test" element={<MenuTestPage />} />

        <Route path="menu-test" element={<MenuTestPage />} />

        <Route
          path="pays"
          element={
            <SuspensedView>
              <PayList />
            </SuspensedView>
          }
        />

        {/* Compagnies Maritimes Routes */}
        <Route
          path="compagnies-maritimes"
          element={
            <SuspensedView>
              <CompagnieMaritimeList />
            </SuspensedView>
          }
        />

        {/* ports Routes */}
        <Route
          path="ports"
          element={
            <SuspensedView>
              <PortList />
            </SuspensedView>
          }
        />


         {/* navires Routes */}
         <Route
          path="navires"
          element={
            <SuspensedView>
              <NavireList />
            </SuspensedView>
          }
        />

         {/* surveillants Routes */}
         <Route
          path="surveillants"
          element={
            <SuspensedView>
              <SurveillantList />
            </SuspensedView>
          }
        />

{/* <Route

        {/* <Route

          path="compagnies-maritimes/:id"
          element={
            <SuspensedView>
              <CompagnieMaritimeDetails />
            </SuspensedView>
          }
        /> */}


        
        <Route
          path="fournisseur-type"
          element={
            <SuspensedView>
              <FournisseurTypeList />
            </SuspensedView>
          }
 
        />
         <Route
          path="ville"
          element={
            <SuspensedView>
              <VilleList />
            </SuspensedView>
          }
        />
        <Route
           path="banque"
           element={
                 <SuspensedView>
               <BanqueList />
             </SuspensedView>
           }
         />
         <Route
          path="devises"
          element={
            <SuspensedView>
              <DeviseList />
            </SuspensedView>
          }
        />
        <Route
          path="qualite"
          element={
            <SuspensedView>
              <QualiteList />
            </SuspensedView>
          }
        />
        <Route
  path="conditions"
  element={
    <SuspensedView>
      <ConditionList />
    </SuspensedView>
  }
/>
<Route
  path="piece-types"
  element={
    <SuspensedView>
      <PieceTypeList />
    </SuspensedView>
  }
/>
<Route
  path="sites"
  element={
    <SuspensedView>
      <SiteList />
    </SuspensedView>
  }
/>
<Route
  path="zonedestinations"
  element={
    <SuspensedView>
      <ZoneDestinationList />
    </SuspensedView>
  }
/>
 


        <Route
          path="crafted/widgets/*"
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />

        <Route
          path="crafted/account/*"
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />

        <Route
          path="apps/chat/*"
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />

        <Route
          path="apps/user-management/*"
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        />

        {/*BEGIN Fourniseur Routes*/}
        <Route
          path="fournisseurs"
          element={
            <SuspensedView>
              <Fournisseur />
            </SuspensedView>
          }
        />
        <Route
          path="add-fournisseur"
          element={
            <SuspensedView>
              <AddFournisseur />
            </SuspensedView>
          }
        />

        <Route
          path="details-fournisseur/:id"
          element={
            <SuspensedView>
              <DetailsFournisseur />
            </SuspensedView>
          }
        />
        <Route
          path="details-fournisseur/:id/edit"
          element={
            <SuspensedView>
              <DetailsFournisseur />
            </SuspensedView>
          }
        />

        {/*END Fourniseur Routes*/}

        {/* Begin Arrivage */}
        <Route
          path="arrivage"
          element={
            <SuspensedView>
              <Arrivage />
            </SuspensedView>
          }
        />
        {/* <Route
          path="planning"
          element={
            <SuspensedView>
              <Planning />
            </SuspensedView>
          }
        /> */}
        <Route
          path="add-arrivage"
          element={
            <SuspensedView>
              <AddArrivage />
            </SuspensedView>
          }
        />
        <Route
          path="/consultation/:id"
          element={
            <SuspensedView>
              <Consultation />
            </SuspensedView>
          }
        />
        <Route
          path="/paiement/:id"
          element={
            <SuspensedView>
              <Paiement />
            </SuspensedView>
          }
        />
        <Route
          path="/logistique/:id"
          element={
            <SuspensedView>
              <Logistique />
            </SuspensedView>
          }
        />
        {/* End Arrivage */}

        {/* Begin Pont bascule */}
        <Route
          path="shifts"
          element={
            <SuspensedView>
              <GestionShifts />
            </SuspensedView>
          }
        />
        <Route
          path="pesage"
          element={
            <SuspensedView>
              <Pesage />
            </SuspensedView>
          }
        />
        <Route
          path="parametrage"
          element={
            <SuspensedView>
              <Parametrage />
            </SuspensedView>
          }
        />
        {/* End Pont bascule */}

        {/*Begin Plannings */}

        <Route
          path="create-planning"
          element={
            <SuspensedView>
              <CreatePlanning />
            </SuspensedView>
          }
        />
                <Route
          path="calendar-planning"
          element={
            <SuspensedView>
              <Planification />
            </SuspensedView>
          }
        />
        <Route
          path="edit-planning/:id"
          element={
            <SuspensedView>
              <UpdatePlanning />
            </SuspensedView>
          }
        />
        
        {/*Eegin Plannings */}

        {/* Page Not Found */}
        <Route path="*" element={<Navigate to="/error/404" />} />
      </Route>
    </Routes>
  );
};

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue("--bs-primary");
  TopBarProgress.config({
    barColors: {
      "0": baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  });
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
};

export { PrivateRoutes };
