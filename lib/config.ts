export interface ScoringDimension {
  id: string;
  label: string;
  weight: number;
}

export interface Policy {
  id: string;
  description: string;
  autoValidatable: boolean;
}

export interface Config {
  brand: {
    name: string;
    shortName: string;
    tagline: string;
    primaryColor: string;
    secondaryColor: string;
    ownerName: string;
    ownerLinkedIn: string;
  };
  project: {
    name: string;
    description: string;
    context: string;
    demoMode: boolean;
  };
  urls: {
    dashboardUrl: string;
    githubUrl: string;
    parentLabUrl: string;
  };
  dataSources: {
    primary: "easybroker_api" | "sheets";
    easybroker: {
      baseUrl: string;
      environment: "staging" | "production";
      rateLimitPerSecond: number;
    };
    sheets: {
      syntheticListingsSheetId: string;
    };
  };
  scoring: {
    passingThreshold: number;
    dimensions: ScoringDimension[];
  };
  policies: {
    official: Policy[];
  };
}

export const config: Config = {
  brand: {
    name: "Franco Herrera Growth Lab",
    shortName: "INICIO",
    tagline: "Growth systems built with AI",
    primaryColor: "#2A2EBE",
    secondaryColor: "#5B5FE6",
    ownerName: "Franco Herrera",
    ownerLinkedIn: "https://www.linkedin.com/in/franco-herrera/",
  },
  project: {
    name: "Free-to-paid Engine",
    description: "Optimiza la calidad y conversión del inventario inmobiliario",
    context: "Prototipo construido para EasyBroker/Pincali",
    demoMode: true,
  },
  urls: {
    dashboardUrl: "https://listing-quality-sync.vercel.app",
    // TODO: actualizar cuando se pushee el repo real
    githubUrl: "https://github.com/francoherrerasa-creator/listings-optimization",
    parentLabUrl: "https://github.com/francoherrerasa-creator",
  },
  dataSources: {
    primary: "easybroker_api",
    easybroker: {
      baseUrl: process.env.EASYBROKER_BASE_URL || "https://api.stagingeb.com",
      environment: "staging",
      rateLimitPerSecond: 20,
    },
    sheets: {
      syntheticListingsSheetId: "13numKGQmet5NsSe3qYFUqLm-tjWCOLWfTHUHuOxQV7U",
    },
  },
  scoring: {
    passingThreshold: 70,
    dimensions: [
      { id: "description_quality", label: "Calidad de descripción", weight: 25 },
      { id: "price_plausibility", label: "Plausibilidad de precio", weight: 20 },
      { id: "data_completeness", label: "Completitud de datos", weight: 20 },
      { id: "photos_signal", label: "Señal de calidad de fotos", weight: 20 },
      { id: "location_clarity", label: "Claridad de ubicación", weight: 15 },
    ],
  },
  policies: {
    official: [
      {
        id: "no_duplicates",
        description: "No se permiten anuncios duplicados, aunque tengan diferentes ubicaciones o variantes",
        autoValidatable: true,
      },
      {
        id: "available_properties",
        description: "Los inmuebles deben estar disponibles (no vendidos/rentados)",
        autoValidatable: true,
      },
      {
        id: "no_fraudulent",
        description: "No se permiten anuncios fraudulentos, engañosos o tipo anzuelo",
        autoValidatable: false,
      },
      {
        id: "images_promote_property",
        description: "Las imágenes deben promover el inmueble real",
        autoValidatable: true,
      },
      {
        id: "real_price_location",
        description: "El precio y la ubicación deben ser reales y verificables",
        autoValidatable: true,
      },
      {
        id: "matching_characteristics",
        description: "Las características descritas deben coincidir con el inmueble real",
        autoValidatable: true,
      },
      {
        id: "bank_auctions_classified",
        description: "Los remates bancarios deben clasificarse como tal",
        autoValidatable: false,
      },
    ],
  },
};
