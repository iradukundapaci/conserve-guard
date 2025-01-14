interface Ranger {
  id: number;
  names: string;
}

interface Incident {
  id: number;
  createdAt: string;
  updatedAt: string;
  dateCaught: string;
  description: string;
  evidence: string[];
  ranger: Ranger;
}

interface IncidentResponse {
  message: string;
  payload: {
    items: Incident[];
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  };
}
