import { AsideMenuItemWithSub } from "./AsideMenuItemWithSub";
import { AsideMenuItem } from "./AsideMenuItem";

interface AsideMenuMainProps {
  isCollapsed?: boolean;
}

export function AsideMenuMain({ isCollapsed = false }: AsideMenuMainProps) {
  return (
    <>
      {/* BEGIN gestion ref */}
      <AsideMenuItemWithSub
        to="#"
        icon="folder" // For managing references
        title="Gestion des référentiels"
        isCollapsed={isCollapsed}
      >
        {/* BEGIN gestion fournisseur */}
        <AsideMenuItemWithSub
          to="#"
          icon="user" // For suppliers (people/companies)
          title="Gestion des Fournisseurs"
          isCollapsed={isCollapsed}
        >
          <AsideMenuItem
            to="/add-fournisseur"
            icon="plus-circle" // For creating a supplier
            title="Création d'un Fournisseur"
            isCollapsed={isCollapsed}
          />
          <AsideMenuItem
            to="/fournisseurs"
            icon="menu" // Three-line list icon
            title="Liste des fournisseurs"
            isCollapsed={isCollapsed}
          />
        </AsideMenuItemWithSub>

        <AsideMenuItemWithSub
          to="#"
          icon="flag" // For countries
          title="Gestion des Pays"
          isCollapsed={isCollapsed}
        >
          <AsideMenuItem
            to="/pays"
            icon="menu" // Three-line list icon
            title="Liste des pays"
            isCollapsed={isCollapsed}
          />
        </AsideMenuItemWithSub>

        {/* BEGIN Gestion des Compagnies Maritimes */}
        <AsideMenuItemWithSub
          to="#"
          icon="ship" // For maritime companies
          title="Gestion des Compagnies Maritimes"
          isCollapsed={isCollapsed}
        >
          <AsideMenuItem
            to="/compagnies-maritimes"
            icon="menu" // Three-line list icon
            title="Liste des compagnies maritimes"
            isCollapsed={isCollapsed}
          />
        </AsideMenuItemWithSub>
        {/* END Gestion des Compagnies Maritimes */}


         {/* BEGIN Gestion des Navires */}
         <AsideMenuItemWithSub
          to="#"
          icon="shield-tick"
          title="Gestion des Navires"
          isCollapsed={isCollapsed}
        >
          <AsideMenuItem
            to="/navires"
            icon="list"
            title="Liste des navires"
            isCollapsed={isCollapsed}
          />
        </AsideMenuItemWithSub>
        {/* END Gestion des Navires */}

         {/* BEGIN Gestion des Surveillants */}
         <AsideMenuItemWithSub
          to="#"
          icon="shield-tick"
          title="Gestion des Surveillants"
          isCollapsed={isCollapsed}
        >
          <AsideMenuItem
            to="/surveillants"
            icon="list"
            title="Liste des surveillants"
            isCollapsed={isCollapsed}
          />
        </AsideMenuItemWithSub>
        {/* END Gestion des Surveillants */}

         {/* BEGIN Gestion des Compagnies Maritimes */}
        


        <AsideMenuItemWithSub

          to="#"
          icon="ship" // Changed to "ship" for ports (reliable, matches maritime theme)
          title="Gestion des Ports"
          isCollapsed={isCollapsed}
        >
          <AsideMenuItem
            to="/ports"
            icon="menu" // Three-line list icon
            title="Liste des ports"
            isCollapsed={isCollapsed}
          />
        </AsideMenuItemWithSub>
        {/* END Gestion des Ports */}
        <AsideMenuItemWithSub
          to="#"
          icon="tag" // For supplier types
          title="Gestion des Types de Fournisseur"
          isCollapsed={isCollapsed}
        >
          <AsideMenuItem
            to="/fournisseur-type"
            icon="menu" // Three-line list icon
            title="Liste des Types de Fournisseur"
            isCollapsed={isCollapsed}
          />
        </AsideMenuItemWithSub>

        <AsideMenuItemWithSub
          to="#"
          icon="map" // For cities
          title="Gestion des Villes"
          isCollapsed={isCollapsed}
        >
          <AsideMenuItem
            to="/ville"
            icon="menu" // Three-line list icon
            title="Liste des villes"
            isCollapsed={isCollapsed}
          />
        </AsideMenuItemWithSub>
        <AsideMenuItemWithSub
          to="#"
          icon="bank" // For banks
          title="Gestion des Banques"
          isCollapsed={isCollapsed}
        >
          <AsideMenuItem
            to="/banque"
            icon="menu" // Three-line list icon
            title="Liste des Banques"
            isCollapsed={isCollapsed}
          />
        </AsideMenuItemWithSub>
        <AsideMenuItemWithSub
          to="#"
          icon="dollar" // For currencies
          title="Gestion des Devises"
          isCollapsed={isCollapsed}
        >
          <AsideMenuItem
            to="/devises"
            icon="menu" // Three-line list icon
            title="Liste des Devises"
            isCollapsed={isCollapsed}
          />
        </AsideMenuItemWithSub>
        <AsideMenuItemWithSub
          to="#"
          icon="star" // For quality
          title="Gestion des Qualite"
          isCollapsed={isCollapsed}
        >
          <AsideMenuItem
            to="/qualite"
            icon="menu" // Three-line list icon
            title="Liste des Qualite"
            isCollapsed={isCollapsed}
          />
        </AsideMenuItemWithSub>

        <AsideMenuItemWithSub
          to="#"
          icon="document" // For contract conditions
          title="Gestion des Conditions de Contract"
          isCollapsed={isCollapsed}
        >
          <AsideMenuItem
            to="/conditions"
            icon="menu" // Three-line list icon
            title="Liste des Conditions"
            isCollapsed={isCollapsed}
          />
        </AsideMenuItemWithSub>
        
        <AsideMenuItemWithSub
          to="#"
          icon="archive" // For piece types
          title="Gestion des Types de Pièce"
          isCollapsed={isCollapsed}
        >
          <AsideMenuItem
            to="/piece-types"
            icon="menu" // Three-line list icon
            title="Liste des Types de Pièce"
            isCollapsed={isCollapsed}
          />
        </AsideMenuItemWithSub>
        <AsideMenuItemWithSub
          to="#"
          icon="home" // For sites
          title="Gestion des Sites"
          isCollapsed={isCollapsed}
        >
          <AsideMenuItem
            to="/sites"
            icon="menu" // Three-line list icon
            title="Liste des Sites"
            isCollapsed={isCollapsed}
          />
        </AsideMenuItemWithSub>
        <AsideMenuItemWithSub
          to="#"
          icon="map" // For zones
          title="Gestion des Zones"
          isCollapsed={isCollapsed}
        >
          <AsideMenuItem
            to="/zonedestinations"
            icon="menu" // Three-line list icon
            title="Liste des Zones"
            isCollapsed={isCollapsed}
          />
        </AsideMenuItemWithSub>

        {/* END Gestion Fournisseur */}
      </AsideMenuItemWithSub>
      {/* End gestion ref */}

      {/* Gestion d'arrivage */}
      <AsideMenuItemWithSub
        to="#"
        icon="truck" // For arrivals/delivery
        title="Gestion d'arrivage "
        isCollapsed={isCollapsed}
      >
        {/* <AsideMenuItem
          to="/planning"
          title="Planning d'arrivage"
          isCollapsed={isCollapsed}
        /> */}
        <AsideMenuItem
          to="/add-arrivage"
          icon="plus-circle" // For creating an arrival
          title="Création d'arrivage"
          isCollapsed={isCollapsed}
        />
        <AsideMenuItem
          to="/arrivage"
          icon="menu" // Three-line list icon
          title="Liste des arrivages"
          isCollapsed={isCollapsed}
        />
      </AsideMenuItemWithSub>

      {/* Pont à bascule */}
      <AsideMenuItemWithSub
        to="#"
        icon="scales" // For weighbridge
        title="Pont à bascule "
        isCollapsed={isCollapsed}
      >
        <AsideMenuItem
          to="/shifts"
          icon="clock" // For managing shifts
          title="Gestion des shifts "
          isCollapsed={isCollapsed}
        />
        <AsideMenuItem
          to="/pesage"
          icon="weight" // For weighing
          title="Pesage"
          isCollapsed={isCollapsed}
        />
        <AsideMenuItem
          to="/parametrage"
          icon="gear" // For settings/parameters
          title="Parametrage"
          isCollapsed={isCollapsed}
        />
      </AsideMenuItemWithSub>

      <AsideMenuItemWithSub
        to="#"
        icon="shield-tick"
        title="Plannings"
        isCollapsed={isCollapsed}
      >
        <AsideMenuItem
          to="/create-planning"
          title="Creation des Plannings"
          isCollapsed={isCollapsed}
        />
                <AsideMenuItem
          to="/calendar-planning"
          title="Calendrier des plannings"
          isCollapsed={isCollapsed}
        />
      </AsideMenuItemWithSub>

      {/*Plannings*/}

      {/* <AsideMenuItem
        to="/dashboard"
        icon="element-11"
        title={intl.formatMessage({ id: 'MENU.DASHBOARD' })}
      /> */}
      {/* <AsideMenuItem to="/builder" icon="switch" title="Layout Builder" /> */}
    </>
  );
}