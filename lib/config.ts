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
    primaryColor: "#1E3AD9",
    secondaryColor: "#0F25A8",
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
    passingThreshold: 80,
    dimensions: [
      { id: "photos", label: "Fotos", weight: 20 },
      { id: "description", label: "Descripción", weight: 20 },
      { id: "price", label: "Precio", weight: 20 },
      { id: "freshness", label: "Info actualizada", weight: 15 },
      { id: "location", label: "Ubicación granular", weight: 10 },
      { id: "characteristics", label: "Características numéricas", weight: 8 },
      { id: "amenities", label: "Amenidades", weight: 4 },
      { id: "video", label: "Video o tour virtual", weight: 3 },
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
