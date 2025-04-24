import axios from "axios";

const BASE_URL =
  "https://referentialapi-afbwgre0e9hgffhx.francecentral-01.azurewebsites.net";

interface Pay {
  pays_id: number;
  pays_Nom: string;
}

interface Ville {
  ville_id: number;
  ville_Nom: string;
}

interface Port {
  port_ID: number;
  port_Nom: string;
  port_CodeIATA: string;
  port_CodeUNLOCODE: string;
  port_PaysId: number;
  port_PaysNom?: string;
  port_VilleId: number;
  port_VilleNom?: string;
  port_Latitude: number;
  port_Longitude: number;
  port_DateCreation: string;
  port_UserId: string;
}

interface CompagnieMaritime {
  compagnie_Id: number;
  compagnie_NomCompagnie: string;
  compagnie_CodeIMO: string;
  compagnie_PaysId: number;
  compagnie_PaysNom?: string;
  compagnie_Adresse: string;
  compagnie_Telephone: string;
  compagnie_Email: string;
  compagnie_SiteWeb: string;
  compagnie_Active: boolean;
  compagnie_DateCreation: string;
}

interface Navire {
  navire_Id: number;
  navire_Nom: string;
  navire_IMO: string;
  navire_CompagnieId: number;
  navire_CompagnieNom?: string;
  navire_ImmatriculationPaysId: number;
  navire_ImmatriculationPaysNom?: string;
  navire_ImmatriculationPortId: number;
  navire_ImmatriculationPortNom?: string;
  navire_AnneeConstruction: number;
  navire_LongueurMettres: number;
  navire_LargeurMetres: number;
  navire_TonnageBrut: number;
  navire_TonnageNet: number;
  navire_DeadweightTonnage: number;
  navire_Observations: string;
  navire_ValidationStatutId: number;
  navire_DateValidationStatut: string;
  navire_Active: boolean;
  navire_DateCreation: string;
  navire_UserId: string;
}

interface Surveillant {
  surveillant_Id: number;
  surveillant_TypeSuveillantId: number;
  surveillant_TypeSuveillantNom?: string;
  surveillant_RaisonSociale: string;
  surveillant_Nom: string;
  surveillant_Prenom: string;
  surveillant_Telephone: string;
  surveillant_Email: string;
  surveillant_PaysId: number;
  surveillant_PaysNom?: string;
  surveillant_Statut: boolean;
  surveillant_Observations: string;
  surveillant_DateCreation: string;
  surveillant_UserId: string;
}

interface FetchResponse<T> {
  items: T[];
  totalItems: number;
}

export const fetchPays = async (page = 1, search = "") => {
  const pageSize = 100;
  let url = `${BASE_URL}/api/GetEntityFieldsWithFilters?entityName=Pay&pageSize=${pageSize}&page=${page}&fields=Pays_id,Pays_Nom`;

  if (search && search.length > 0) {
    url += `&filters=Pays_Nom:contains:${search}`;
  }

  try {
    const response = await axios.get(url);
    console.log("Pays response:", response.data);
    return response.data;
  } catch (err) {
    const error = err as Error;
    console.error("Erreur lors de la récupération des pays :", error);
    throw new Error("Échec de la récupération des pays. Veuillez réessayer.");
  }
};

export const fetchVilles = async (page = 1, search = "", paysId = 0) => {
  const pageSize = 100;
  let url = `${BASE_URL}/api/GetEntityFieldsWithFilters?entityName=Ville&pageSize=${pageSize}&page=${page}&fields=Ville_id,Ville_Nom`;

  const filters = [];
  if (search && search.length > 0) {
    filters.push(`Ville_Nom:contains:${search}`);
  }
  if (paysId > 0) {
    filters.push(`Ville_PaysId:eq:${paysId}`);
  }
  if (filters.length > 0) {
    url += `&filters=${filters.join(",")}`;
  }

  try {
    const response = await axios.get(url);
    console.log("Villes response:", response.data);
    return response.data;
  } catch (err) {
    const error = err as Error;
    console.error("Erreur lors de la récupération des villes :", error);
    throw new Error("Échec de la récupération des villes. Veuillez réessayer.");
  }
};

export const fetchPorts = async (
  page = 1,
  search = "",
  codeIATA = "",
  codeUNLOCODE = "",
  paysId = 0,
  villeId = 0,
  dateCreation: Date | null = null
) => {
  const pageSize = 100;
  let url = `${BASE_URL}/api/GetEntityFieldsWithFilters?entityName=Port&pageSize=${pageSize}&page=${page}&fields=Port_ID,Port_Nom,Port_CodeIATA,Port_CodeUNLOCODE,Port_PaysId,Port_VilleId,Port_Latitude,Port_Longitude,Port_DateCreation,Port_UserId`;

  const filters = [];
  if (search && search.length > 0) {
    filters.push(`Port_Nom:contains:${search}`);
  }
  if (codeIATA && codeIATA.length > 0) {
    filters.push(`Port_CodeIATA:contains:${codeIATA}`);
  }
  if (codeUNLOCODE && codeUNLOCODE.length > 0) {
    filters.push(`Port_CodeUNLOCODE:contains:${codeUNLOCODE}`);
  }
  if (paysId > 0) {
    filters.push(`Port_PaysId:eq:${paysId}`);
  }
  if (villeId > 0) {
    filters.push(`Port_VilleId:eq:${villeId}`);
  }
  if (dateCreation) {
    const formattedDate = dateCreation.toISOString().split("T")[0];
    filters.push(`Port_DateCreation:eq:${formattedDate}`);
  }

  if (filters.length > 0) {
    url += `&filters=${filters.join(",")}`;
  }

  try {
    const response = await axios.get(url);
    console.log("Ports response:", response.data);
    const portData = response.data.items || [];

    const paysResponse = await fetchPays(1, "");
    const paysData = paysResponse.items || [];
    if (!paysData.length) {
      console.warn("No pays data received");
    }

    const villeResponse = await fetchVilles(1, "");
    const villeData = villeResponse.items || [];
    if (!villeData.length) {
      console.warn("No villes data received");
    }

    const enrichedData = portData.map((port: Port) => {
      const pays = paysData.find((p: Pay) => p.pays_id === port.port_PaysId);
      const ville = villeData.find((v: Ville) => v.ville_id === port.port_VilleId);
      console.log(
        `Mapping port ${port.port_ID}: PaysId=${port.port_PaysId}, VilleId=${
          port.port_VilleId
        }, PaysNom=${pays?.pays_Nom}, VilleNom=${ville?.ville_Nom}`
      );
      return {
        ...port,
        port_PaysNom: pays ? pays.pays_Nom : "Pays non trouvé",
        port_VilleNom: ville ? ville.ville_Nom : "Ville non trouvée",
      };
    });

    return {
      items: enrichedData,
      totalItems: response.data.totalItems || 0,
    };
  } catch (err) {
    const error = err as Error;
    console.error("Erreur lors de la récupération des ports :", error);
    throw new Error("Échec de la récupération des ports. Veuillez réessayer.");
  }
};

export const createPort = async (
  data: Omit<Port, "port_ID" | "port_DateCreation" | "port_UserId">
): Promise<void> => {
  try {
    await axios.post(
      `${BASE_URL}/api/Port`,
      {
        port_Nom: data.port_Nom.trim(),
        port_CodeIATA: data.port_CodeIATA.trim(),
        port_CodeUNLOCODE: data.port_CodeUNLOCODE.trim(),
        port_PaysId: data.port_PaysId,
        port_VilleId: data.port_VilleId,
        port_Latitude: data.port_Latitude,
        port_Longitude: data.port_Longitude,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    const error = err as Error;
    console.error("Erreur lors de la création du port :", error);
    throw new Error("Échec de la création du port. Veuillez réessayer.");
  }
};

export const deletePort = async (port_ID: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/api/Port?id=${port_ID}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    const error = err as Error;
    console.error("Erreur lors de la suppression du port :", error);
    throw new Error("Échec de la suppression du port. Veuillez réessayer.");
  }
};

export const updatePort = async (
  port_ID: number,
  data: Omit<Port, "port_ID" | "port_DateCreation" | "port_UserId">
): Promise<void> => {
  try {
    await axios.put(
      `${BASE_URL}/api/Port`,
      {
        id: port_ID,
        port_Nom: data.port_Nom.trim(),
        port_CodeIATA: data.port_CodeIATA.trim(),
        port_CodeUNLOCODE: data.port_CodeUNLOCODE.trim(),
        port_PaysId: data.port_PaysId,
        port_VilleId: data.port_VilleId,
        port_Latitude: data.port_Latitude,
        port_Longitude: data.port_Longitude,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    const error = err as Error;
    console.error("Erreur lors de la modification du port :", error);
    throw new Error("Échec de la modification du port. Veuillez réessayer.");
  }
};

export const fetchCompagnieMaritime = async (
  page = 1,
  search = "",
  codeIMO = "",
  paysId = 0,
  statut = "all",
  dateCreation: Date | null = null
) => {
  const pageSize = 10;
  let url = `${BASE_URL}/api/GetEntityFieldsWithFilters?entityName=CompagnieMaritime&pageSize=${pageSize}&page=${page}&fields=compagnie_Id,compagnie_NomCompagnie,compagnie_CodeIMO,compagnie_PaysId,compagnie_Adresse,compagnie_Telephone,compagnie_Email,compagnie_SiteWeb,compagnie_Active,compagnie_DateCreation`;

  const filters = [];

  if (search && search.length > 0) {
    filters.push(`compagnie_NomCompagnie:contains:${search}`);
  }

  if (codeIMO && codeIMO.length > 0) {
    filters.push(`compagnie_CodeIMO:contains:${codeIMO}`);
  }

  if (paysId > 0) {
    filters.push(`compagnie_PaysId:eq:${paysId}`);
  }

  if (statut !== "all") {
    filters.push(`compagnie_Active:eq:${statut}`);
  }

  if (dateCreation) {
    const formattedDate = dateCreation.toISOString().split("T")[0];
    filters.push(`compagnie_DateCreation:eq:${formattedDate}`);
  }

  if (filters.length > 0) {
    url += `&filters=${filters.join(",")}`;
  }

  try {
    const response = await axios.get(url);
    const compagnieData = response.data.items || [];
    const paysResponse = await fetchPays(1, "");
    const paysData = paysResponse.items || [];

    const enrichedData = compagnieData.map((compagnie: CompagnieMaritime) => {
      const pays = paysData.find(
        (p: Pay) => p.pays_id === compagnie.compagnie_PaysId
      );
      return {
        ...compagnie,
        compagnie_PaysNom: pays ? pays.pays_Nom : "Unknown",
      };
    });

    return {
      items: enrichedData,
      totalItems: response.data.totalItems || 0,
    };
  } catch (err) {
    const error = err as Error;
    console.error(
      "Erreur lors de la récupération des compagnies maritimes :",
      error
    );
    throw new Error(
      "Échec de la récupération des compagnies maritimes. Veuillez réessayer."
    );
  }
};

export const createCompagnieMaritime = async (
  data: Omit<CompagnieMaritime, "compagnie_Id" | "compagnie_DateCreation">
): Promise<void> => {
  try {
    var status = true;
    if (String(data.compagnie_Active) === "false") status = false;
    await axios.post(
      `${BASE_URL}/api/CompagnieMaritime`,
      {
        compagnie_NomCompagnie: data.compagnie_NomCompagnie.trim(),
        compagnie_CodeIMO: data.compagnie_CodeIMO.trim(),
        compagnie_PaysId: data.compagnie_PaysId,
        compagnie_Adresse: data.compagnie_Adresse.trim(),
        compagnie_Telephone: data.compagnie_Telephone.trim(),
        compagnie_Email: data.compagnie_Email.trim(),
        compagnie_SiteWeb: data.compagnie_SiteWeb
          ? data.compagnie_SiteWeb.trim()
          : null,
        compagnie_Active: status,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    const error = err as Error;
    console.error(
      "Erreur lors de la création de la compagnie maritime :",
      error
    );
    throw new Error(
      "Échec de la création de la compagnie maritime. Veuillez réessayer."
    );
  }
};

export const deleteCompagnieMaritime = async (
  compagnie_Id: number
): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/api/CompagnieMaritime?id=${compagnie_Id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    const error = err as Error;
    console.error(
      "Erreur lors de la suppression de la compagnie maritime :",
      error
    );
    throw new Error(
      "Échec de la suppression de la compagnie maritime. Veuillez réessayer."
    );
  }
};

export const updateCompagnieMaritime = async (
  compagnie_Id: number,
  data: Omit<CompagnieMaritime, "compagnie_Id" | "compagnie_DateCreation">
): Promise<void> => {
  try {
    await axios.put(
      `${BASE_URL}/api/CompagnieMaritime`,
      {
        id: compagnie_Id,
        compagnie_NomCompagnie: data.compagnie_NomCompagnie.trim(),
        compagnie_CodeIMO: data.compagnie_CodeIMO.trim(),
        compagnie_PaysId: data.compagnie_PaysId,
        compagnie_Adresse: data.compagnie_Adresse.trim(),
        compagnie_Telephone: data.compagnie_Telephone.trim(),
        compagnie_Email: data.compagnie_Email.trim(),
        compagnie_SiteWeb: data.compagnie_SiteWeb
          ? data.compagnie_SiteWeb.trim()
          : null,
        compagnie_Active: data.compagnie_Active,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    const error = err as Error;
    console.error(
      "Erreur lors de la modification de la compagnie maritime :",
      error
    );
    throw new Error(
      "Échec de la modification de la compagnie maritime. Veuillez réessayer."
    );
  }
};

export const fetchNavire = async (
  page = 1,
  search = "",
  imo = "",
  compagnieId = 0,
  paysId = 0,
  portId = 0,
  statut = "all",
  dateCreation: Date | null = null
) => {
  const pageSize = 10;
  let url = `${BASE_URL}/api/GetEntityFieldsWithFilters?entityName=Navire&pageSize=${pageSize}&page=${page}&fields=Navire_Id,Navire_Nom,Navire_IMO,Navire_CompagnieId,Navire_ImmatriculationPaysId,Navire_ImmatriculationPortId,Navire_AnneeConstruction,Navire_LongueurMettres,Navire_LargeurMetres,Navire_TonnageBrut,Navire_TonnageNet,Navire_DeadweightTonnage,Navire_Observations,Navire_ValidationStatutId,Navire_DateValidationStatut,Navire_Active,Navire_DateCreation,Navire_UserId`;

  const filters = [];

  if (search && search.length > 0) {
    filters.push(`Navire_Nom:contains:${search}`);
  }

  if (imo && imo.length > 0) {
    filters.push(`Navire_IMO:contains:${imo}`);
  }

  if (compagnieId > 0) {
    filters.push(`Navire_CompagnieId:eq:${compagnieId}`);
  }

  if (paysId > 0) {
    filters.push(`Navire_ImmatriculationPaysId:eq:${paysId}`);
  }

  if (portId > 0) {
    filters.push(`Navire_ImmatriculationPortId:eq:${portId}`);
  }

  if (statut !== "all") {
    filters.push(`Navire_Active:eq:${statut}`);
  }

  if (dateCreation) {
    const formattedDate = dateCreation.toISOString().split("T")[0];
    filters.push(`Navire_DateCreation:eq:${formattedDate}`);
  }

  if (filters.length > 0) {
    url += `&filters=${filters.join(",")}`;
  }

  try {
    const response = await axios.get(url);
    const navireData = response.data.items || [];
    const compagnieResponse = await fetchCompagnieMaritime(1, "");
    const compagnieData = compagnieResponse.items || [];
    const paysResponse = await fetchPays(1, "");
    const paysData = paysResponse.items || [];
    const portResponse = await fetchPorts(1, "");
    const portData = portResponse.items || [];

    const enrichedData = navireData.map((navire: Navire) => {
      const compagnie = compagnieData.find(
        (c: CompagnieMaritime) => c.compagnie_Id === navire.navire_CompagnieId
      );
      const pays = paysData.find(
        (p: Pay) => p.pays_id === navire.navire_ImmatriculationPaysId
      );
      const port = portData.find(
        (p: Port) => p.port_ID === navire.navire_ImmatriculationPortId
      );
      return {
        ...navire,
        navire_CompagnieNom: compagnie
          ? compagnie.compagnie_NomCompagnie
          : "Unknown",
        navire_ImmatriculationPaysNom: pays ? pays.pays_Nom : "Unknown",
        navire_ImmatriculationPortNom: port ? port.port_Nom : "Unknown",
      };
    });

    return {
      items: enrichedData,
      totalItems: response.data.totalItems || 0,
    };
  } catch (err) {
    const error = err as Error;
    console.error("Erreur lors de la récupération des navires :", error);
    throw new Error("Échec de la récupération des navires. Veuillez réessayer.");
  }
};

export const createNavire = async (
  data: Omit<
    Navire,
    "navire_Id" | "navire_DateCreation" | "navire_DateValidationStatut"
  >
): Promise<void> => {
  try {
    var status = true;
    if (String(data.navire_Active) === "false") status = false;
    await axios.post(
      `${BASE_URL}/api/Navire`,
      {
        navire_Nom: data.navire_Nom.trim(),
        navire_IMO: data.navire_IMO.trim(),
        navire_CompagnieId: data.navire_CompagnieId,
        navire_ImmatriculationPaysId: data.navire_ImmatriculationPaysId,
        navire_ImmatriculationPortId: data.navire_ImmatriculationPortId,
        navire_AnneeConstruction: data.navire_AnneeConstruction,
        navire_LongueurMettres: data.navire_LongueurMettres,
        navire_LargeurMetres: data.navire_LargeurMetres,
        navire_TonnageBrut: data.navire_TonnageBrut,
        navire_TonnageNet: data.navire_TonnageNet,
        navire_DeadweightTonnage: data.navire_DeadweightTonnage,
        navire_Observations: data.navire_Observations
          ? data.navire_Observations.trim()
          : null,
        navire_ValidationStatutId: data.navire_ValidationStatutId,
        navire_Active: status,
        navire_UserId: data.navire_UserId.trim(),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    const error = err as Error;
    console.error("Erreur lors de la création du navire :", error);
    throw new Error("Échec de la création du navire. Veuillez réessayer.");
  }
};

export const deleteNavire = async (navire_Id: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/api/Navire?id=${navire_Id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    const error = err as Error;
    console.error("Erreur lors de la suppression du navire :", error);
    throw new Error("Échec de la suppression du navire. Veuillez réessayer.");
  }
};

export const updateNavire = async (
  navire_Id: number,
  data: Omit<
    Navire,
    "navire_Id" | "navire_DateCreation" | "navire_DateValidationStatut"
  >
): Promise<void> => {
  try {
    await axios.put(
      `${BASE_URL}/api/Navire`,
      {
        id: navire_Id,
        navire_Nom: data.navire_Nom.trim(),
        navire_IMO: data.navire_IMO.trim(),
        navire_CompagnieId: data.navire_CompagnieId,
        navire_ImmatriculationPaysId: data.navire_ImmatriculationPaysId,
        navire_ImmatriculationPortId: data.navire_ImmatriculationPortId,
        navire_AnneeConstruction: data.navire_AnneeConstruction,
        navire_LongueurMettres: data.navire_LongueurMettres,
        navire_LargeurMetres: data.navire_LargeurMetres,
        navire_TonnageBrut: data.navire_TonnageBrut,
        navire_TonnageNet: data.navire_TonnageNet,
        navire_DeadweightTonnage: data.navire_DeadweightTonnage,
        navire_Observations: data.navire_Observations
          ? data.navire_Observations.trim()
          : null,
        navire_ValidationStatutId: data.navire_ValidationStatutId,
        navire_Active: data.navire_Active,
        navire_UserId: data.navire_UserId.trim(),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    const error = err as Error;
    console.error("Erreur lors de la modification du navire :", error);
    throw new Error("Échec de la modification du navire. Veuillez réessayer.");
  }
};

export const fetchSurveillants = async (
  page = 1,
  search = "",
  typeSurveillantId = 0,
  paysId = 0,
  statut = "all",
  dateCreation: Date | null = null
) => {
  const pageSize = 10;
  let url = `${BASE_URL}/api/GetEntityFieldsWithFilters?entityName=Surveillant&pageSize=${pageSize}&page=${page}&fields=Surveillant_Id,Surveillant_TypeSuveillantId,Surveillant_RaisonSociale,Surveillant_Nom,Surveillant_Prenom,Surveillant_Telephone,Surveillant_Email,Surveillant_PaysId,Surveillant_Statut,Surveillant_Observations,Surveillant_DateCreation,Surveillant_UserId`;

  const filters = [];

  if (search && search.length > 0) {
    filters.push(`Surveillant_Nom:contains:${search}`);
  }

  if (typeSurveillantId > 0) {
    filters.push(`Surveillant_TypeSuveillantId:eq:${typeSurveillantId}`);
  }

  if (paysId > 0) {
    filters.push(`Surveillant_PaysId:eq:${paysId}`);
  }

  if (statut !== "all") {
    filters.push(`Surveillant_Statut:eq:${statut}`);
  }

  if (dateCreation) {
    const formattedDate = dateCreation.toISOString().split("T")[0];
    filters.push(`Surveillant_DateCreation:eq:${formattedDate}`);
  }

  if (filters.length > 0) {
    url += `&filters=${filters.join(",")}`;
  }

  try {
    const response = await axios.get(url);
    const surveillantData = response.data.items || [];
    const paysResponse = await fetchPays(1, "");
    const paysData = paysResponse.items || [];

    const enrichedData = surveillantData.map((surveillant: Surveillant) => {
      const pays = paysData.find(
        (p: Pay) => p.pays_id === surveillant.surveillant_PaysId
      );
      return {
        ...surveillant,
        surveillant_PaysNom: pays ? pays.pays_Nom : "Unknown",
        // TypeSurveillantNom is not enriched due to API failure; will use static list in UI
      };
    });

    return {
      items: enrichedData,
      totalItems: response.data.totalItems || 0,
    };
  } catch (err) {
    const error = err as Error;
    console.error("Erreur lors de la récupération des surveillants :", error);
    throw new Error("Échec de la récupération des surveillants. Veuillez réessayer.");
  }
};

export const createSurveillant = async (
  data: Omit<Surveillant, "surveillant_Id" | "surveillant_DateCreation">
): Promise<void> => {
  try {
    var status = true;
    if (String(data.surveillant_Statut) === "false") status = false;
    await axios.post(
      `${BASE_URL}/api/Surveillant`,
      {
        surveillant_TypeSuveillantId: data.surveillant_TypeSuveillantId,
        surveillant_RaisonSociale: data.surveillant_RaisonSociale.trim(),
        surveillant_Nom: data.surveillant_Nom.trim(),
        surveillant_Prenom: data.surveillant_Prenom.trim(),
        surveillant_Telephone: data.surveillant_Telephone.trim(),
        surveillant_Email: data.surveillant_Email.trim(),
        surveillant_PaysId: data.surveillant_PaysId,
        surveillant_Statut: status,
        surveillant_Observations: data.surveillant_Observations
          ? data.surveillant_Observations.trim()
          : null,
        surveillant_UserId: data.surveillant_UserId.trim(),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    const error = err as Error;
    console.error("Erreur lors de la création du surveillant :", error);
    throw new Error("Échec de la création du surveillant. Veuillez réessayer.");
  }
};

export const deleteSurveillant = async (surveillant_Id: number): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/api/Surveillant?id=${surveillant_Id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    const error = err as Error;
    console.error("Erreur lors de la suppression du surveillant :", error);
    throw new Error("Échec de la suppression du surveillant. Veuillez réessayer.");
  }
};

export const updateSurveillant = async (
  surveillant_Id: number,
  data: Omit<Surveillant, "surveillant_Id" | "surveillant_DateCreation">
): Promise<void> => {
  try {
    await axios.put(
      `${BASE_URL}/api/Surveillant`,
      {
        id: surveillant_Id,
        surveillant_TypeSuveillantId: data.surveillant_TypeSuveillantId,
        surveillant_RaisonSociale: data.surveillant_RaisonSociale.trim(),
        surveillant_Nom: data.surveillant_Nom.trim(),
        surveillant_Prenom: data.surveillant_Prenom.trim(),
        surveillant_Telephone: data.surveillant_Telephone.trim(),
        surveillant_Email: data.surveillant_Email.trim(),
        surveillant_PaysId: data.surveillant_PaysId,
        surveillant_Statut: data.surveillant_Statut,
        surveillant_Observations: data.surveillant_Observations
          ? data.surveillant_Observations.trim()
          : null,
        surveillant_UserId: data.surveillant_UserId.trim(),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    const error = err as Error;
    console.error("Erreur lors de la modification du surveillant :", error);
    throw new Error("Échec de la modification du surveillant. Veuillez réessayer.");
  }
};