export interface ScoringDimension {
  id: string;
  label: string;
  weight: number;
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
  sheets: {
    syntheticListingsSheetId: string;
  };
  scoring: {
    passingThreshold: number;
    dimensions: ScoringDimension[];
  };
}

export const config: Config = {
  brand: {
    name: "Franco Herrera Growth Lab",
    shortName: "FHGL",
    tagline: "Growth systems built with AI",
    primaryColor: "#0F172A",
    secondaryColor: "#3B82F6",
    ownerName: "Francisco Franco Herrera Sánchez",
    ownerLinkedIn: "https://www.linkedin.com/in/franco-herrera/",
  },
  project: {
    name: "Listing Quality Sync",
    description: "AI-powered quality scoring para listings inmobiliarios",
    context: "Prototipo construido para EasyBroker/Pincali",
    demoMode: true,
  },
  urls: {
    dashboardUrl: "https://listing-quality-sync.vercel.app",
    githubUrl: "https://github.com/francoherrerasa-creator/listing-quality-sync",
    parentLabUrl: "https://github.com/francoherrerasa-creator/franco-herrera-growth-lab",
  },
  sheets: {
    syntheticListingsSheetId: "13numKGQmet5NsSe3qYFUqLm-tjWCOLWfTHUHuOxQV7U",
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
};
