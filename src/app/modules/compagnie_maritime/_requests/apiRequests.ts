import axios from "axios";

const BASE_URL =
  "https://referentialapi-afbwgre0e9hgffhx.francecentral-01.azurewebsites.net";

interface Pay {
  pays_id: number;
  pays_Nom: string;
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
  // compagnie_UserId: string;
}

interface FetchResponse<T> {
  data: T[];
  totalPages: number;
}

export const fetchPays = async (page = 1, search = "") => {
  const pageSize = 100;
  let url = `${BASE_URL}/api/GetEntityFieldsWithFilters?entityName=Pay&pageSize=${pageSize}&page=${page}&fields=Pays_id,Pays_Nom`;

  if (search && search.length > 0) {
    url += `&filters=Pays_Nom:contains:${search}`;
  }

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    const error = err as Error; // Type cast to Error
    console.error("Erreur lors de la récupération des pays :", error);
    throw new Error("Échec de la récupération des pays. Veuillez réessayer.");
  }
};

// export const createPay = async (paysNom: string): Promise<void> => {
//   try {
//     await axios.post(
//       `${BASE_URL}/api/Pay`,
//       { pays_Nom: paysNom.trim() },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//   } catch (err) {
//     const error = err as Error; // Type cast to Error
//     console.error('Erreur lors de la création du pays :', error);
//     throw new Error('Échec de la création du pays. Veuillez réessayer.');
//   }
// };

// export const deletePay = async (pays_id: number): Promise<void> => {
//   try {
//     await axios.delete(`${BASE_URL}/api/Pay/${pays_id}`, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (err) {
//     const error = err as Error; // Type cast to Error
//     console.error('Erreur lors de la suppression du pays :', error);
//     throw new Error('Échec de la suppression du pays. Veuillez réessayer.');
//   }
// };

// export const updatePay = async (pays_id: number, pays_Nom: string): Promise<void> => {
//   try {
//     await axios.put(
//       `${BASE_URL}/api/Pay`,
//       {
//         pays_id,
//         pays_Nom: pays_Nom.trim(),
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//   } catch (err) {
//     const error = err as Error; // Type cast to Error
//     console.error('Erreur lors de la modification du pays :', error);
//     throw new Error('Échec de la modification du pays. Veuillez réessayer.');
//   }
// };

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
    // Fetch maritime companies
    const response = await axios.get(url);
    const compagnieData = response.data.items || [];

    // Fetch all countries
    const paysResponse = await fetchPays(1, "");
    const paysData = paysResponse.items || [];

    // Map pays_Nom to each CompagnieMaritime
    const enrichedData = compagnieData.map((compagnie: CompagnieMaritime) => {
      const pays = paysData.find(
        (p: Pay) => p.pays_id === compagnie.compagnie_PaysId
      );
      return {
        ...compagnie,
        compagnie_PaysNom: pays ? pays.pays_Nom : "Unknown", // Fallback if no match
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
        // compagnie_UserId: data.compagnie_UserId.trim(),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    const error = err as Error; // Type cast to Error
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
    const error = err as Error; // Type cast to Error
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
        // compagnie_UserId: data.compagnie_UserId.trim(),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    const error = err as Error; // Type cast to Error
    console.error(
      "Erreur lors de la modification de la compagnie maritime :",
      error
    );
    throw new Error(
      "Échec de la modification de la compagnie maritime. Veuillez réessayer."
    );
  }
};
