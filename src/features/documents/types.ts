export type DocumentStatus = "missing" | "preparing" | "ready" | "expired";
export type DocumentCategory =
  "travel" | "study" | "housing" | "health" | "finance";

export type PersonalDocument = {
  id: string;
  title: string;
  category: DocumentCategory;
  status: DocumentStatus;
  expiresAt: string;
  contact: string;
  location: string;
  note: string;
};
