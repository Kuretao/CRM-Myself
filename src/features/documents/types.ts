export type DocumentStatus = "missing" | "preparing" | "ready" | "expired";
export type DocumentCategory =
  "travel" | "study" | "housing" | "health" | "finance";

export type DocumentAttachment = {
  name: string;
  uri: string;
  mimeType: string;
  size: number;
  addedAt: string;
};

export type PersonalDocument = {
  id: string;
  title: string;
  category: DocumentCategory;
  status: DocumentStatus;
  expiresAt: string;
  contact: string;
  location: string;
  note: string;
  attachment?: DocumentAttachment;
};
