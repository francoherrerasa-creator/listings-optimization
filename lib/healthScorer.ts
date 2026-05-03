import { FORM_SECTIONS, evaluateField } from "./sections";

export interface FieldStatus {
  key: string;
  label: string;
  filled: boolean;
  hasFlag: boolean;
  healthy: boolean;
}

export interface SectionHealth {
  sectionId: string;
  sectionLabel: string;
  apiAvailable: boolean;
  apiGapNote?: string;
  totalFields: number;
  filledFields: number;
  fieldsWithFlags: number;
  healthyFields: number;
  healthPercent: number;
  fieldStatus: FieldStatus[];
}

export interface ListingHealth {
  publicId: string;
  totalFields: number;
  totalHealthy: number;
  overallHealthPercent: number;
  sections: SectionHealth[];
  hasRedFlags: boolean;
  redFlagsCount: number;
}

export function calculateListingHealth(
  listing: Record<string, unknown>,
  flagsForListing: string[],
  redFlagsForListing: string[],
): ListingHealth {
  const sections: SectionHealth[] = [];
  let totalFields = 0;
  let totalHealthy = 0;

  for (const section of FORM_SECTIONS) {
    if (!section.apiAvailable) {
      sections.push({
        sectionId: section.id,
        sectionLabel: section.label,
        apiAvailable: false,
        apiGapNote: section.apiGapNote,
        totalFields: section.fields.length,
        filledFields: 0,
        fieldsWithFlags: 0,
        healthyFields: 0,
        healthPercent: 0,
        fieldStatus: section.fields.map((f) => ({
          key: f.key,
          label: f.label,
          filled: false,
          hasFlag: false,
          healthy: false,
        })),
      });
      continue;
    }

    const fieldStatus: FieldStatus[] = section.fields.map((field) => {
      const filled = evaluateField(listing, field);
      const hasFlag = flagsForListing.some(
        (flag) =>
          flag.toLowerCase().includes(field.label.toLowerCase()) ||
          flag.toLowerCase().includes(field.key.replace(/\[.*\]/g, "").split(".").pop()!.toLowerCase()),
      );
      const healthy = filled && !hasFlag;
      return { key: field.key, label: field.label, filled, hasFlag, healthy };
    });

    const filledFields = fieldStatus.filter((f) => f.filled).length;
    const fieldsWithFlags = fieldStatus.filter((f) => f.hasFlag).length;
    const healthyFields = fieldStatus.filter((f) => f.healthy).length;
    const healthPercent =
      section.fields.length > 0 ? Math.round((healthyFields / section.fields.length) * 100) : 0;

    totalFields += section.fields.length;
    totalHealthy += healthyFields;

    sections.push({
      sectionId: section.id,
      sectionLabel: section.label,
      apiAvailable: true,
      totalFields: section.fields.length,
      filledFields,
      fieldsWithFlags,
      healthyFields,
      healthPercent,
      fieldStatus,
    });
  }

  const measurableTotalFields = sections
    .filter((s) => s.apiAvailable)
    .reduce((sum, s) => sum + s.totalFields, 0);
  const measurableHealthy = sections
    .filter((s) => s.apiAvailable)
    .reduce((sum, s) => sum + s.healthyFields, 0);

  const overallHealthPercent =
    measurableTotalFields > 0 ? Math.round((measurableHealthy / measurableTotalFields) * 100) : 0;

  return {
    publicId: (listing.public_id as string) || (listing.publicId as string) || "",
    totalFields: measurableTotalFields,
    totalHealthy: measurableHealthy,
    overallHealthPercent,
    sections,
    hasRedFlags: redFlagsForListing.length > 0,
    redFlagsCount: redFlagsForListing.length,
  };
}
