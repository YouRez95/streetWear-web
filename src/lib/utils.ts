import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import defaultProductImage from "@/assets/placeholder-image/default-product.webp";
import defaultImage from "@/assets/placeholder-image/default-user.png";
import { SERVER_URL } from "./env";
import type {
  CreateProductInput,
  OrderAvance,
  OrderProduct,
} from "@/types/models";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This function removes empty/null/undefined values from an object
export function removeEmptyValues<T extends object>(obj: T): T {
  const result = {} as T;

  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== "") {
      result[key as keyof T] = value as any;
    }
  }

  return result;
}

export const getImageUrl = (
  imageUrl: string | null | undefined,
  type = "user"
): string => {
  const DEFAULT_IMAGE = type === "user" ? defaultImage : defaultProductImage;
  if (imageUrl && imageUrl.trim()) {
    console.log(`${SERVER_URL}/${imageUrl.trim()}`);
    return `${SERVER_URL}/${imageUrl.trim()}`;
  }
  return DEFAULT_IMAGE;
};

export function getPaginationPages(
  current: number,
  total: number
): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];

  const addPage = (page: number) => {
    if (!pages.includes(page)) pages.push(page);
  };

  addPage(1);
  if (total >= 2) addPage(2);

  if (current > 4) pages.push("ellipsis");

  for (let i = current - 1; i <= current + 1; i++) {
    if (i > 2 && i < total - 1) addPage(i);
  }

  if (current < total - 3) pages.push("ellipsis");

  if (total - 1 > 2) addPage(total - 1);
  if (total > 1) addPage(total);

  return pages;
}

export function validateUserForm(formData: FormData): string | null {
  if (!formData.name || formData.name.trim() === "") {
    return "Name is required.";
  }

  if (!formData.email || formData.email.trim() === "") {
    return "Email is required.";
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(formData.email)) {
    return "Please enter a valid email address.";
  }

  const isUpdateOperation =
    formData.skipPasswordValidation ||
    (formData.id !== undefined &&
      !formData.password &&
      !formData.confirmPassword);

  if (isUpdateOperation && !formData.password && !formData.confirmPassword) {
    return null;
  }

  if (
    !isUpdateOperation ||
    (formData.password && formData.password.length > 0)
  ) {
    if (!formData.password) {
      return "Password is required.";
    }

    if (formData.password.length < 5) {
      return "Password must be at least 5 characters long.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }
  }

  // All validations passed
  return null;
}

type FormData = {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  address?: string;
  imageUrl?: string;
  role?: string;
  id?: string | number;
  skipPasswordValidation?: boolean;
};

export function validateProductForm(
  formData: CreateProductInput
): string | null {
  if (!formData.reference || formData.reference.trim() === "") {
    return "La référence est requise.";
  }

  if (!formData.name || formData.name.trim() === "") {
    return "Le nom est requis.";
  }

  if (!formData.totalQty || formData.totalQty <= 0) {
    return "La quantité totale est requise.";
  }

  if (!formData.createdAt) {
    return "La date est requise.";
  }

  return null;
}

export function formatDateToDDMMYYYY(dateInput: string | Date): string {
  const date = new Date(dateInput);

  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export const getMimeTypeFromFileName = (fileName: string): string => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";

  // Ensure the file has a valid extension
  if (!ext || ext === fileName) return "application/octet-stream";

  const mimeTypes: { [key: string]: string } = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
  };

  // Return the MIME type or default to 'application/octet-stream'
  return mimeTypes[ext] || "application/octet-stream";
};

export const cleanText = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "_") // replace spaces/symbols with _
    .replace(/^_+|_+$/g, "") // trim underscores
    .slice(0, 40); // optional: limit length

export const generateFileName = (
  order: (OrderProduct | OrderAvance) & {
    bon_number: number;
    faconnier?: string;
    stylist?: string;
  }
) => {
  const date = formatDateToDDMMYYYY(order.createdAt).replaceAll("/", "-");
  //console.log('date', date)
  const bon = order.bon_number || "bon";
  if (order.type === "AVANCE") {
    return `${date}_BON_Avance_${bon}.pdf`;
  }
  const product = cleanText(order.productName || "Produit");
  return `${date}_BON_Commande_${bon}_${product}.pdf`;
};

export function formatIndex(index: number): string {
  return index < 9 ? `0${index + 1}` : `${index + 1}`;
}
