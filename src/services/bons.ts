import { slogan } from "@/assets/icons/slogan";
import { formatDateToDDMMYYYY, generateFileName } from "@/lib/utils";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import apiClient from "@/lib/apiClient";
import type { OrderAvance, OrderProduct } from "@/types/models";

/**
 * Download PDF bon in the browser
 */
export async function downloadBon(
  order: (OrderProduct | OrderAvance) & {
    bon_number: number;
    faconnier?: string;
    stylist?: string;
    client?: string;
  }
) {
  const doc = new jsPDF();

  const items = [
    "Numéro SIREN : 123 456 789",
    "Forme Juridique : SARL",
    "Siège Social : 123 Rue ABC, Ville, Code Postal, Pays",
    "Téléphone : 01 23 45 67 89",
    "Courriel : info@entrepriseXYZ.com",
  ];

  // Header: Company name & logo
  doc.addImage(slogan, "PNG", 0, 0, 210, 50);
  doc.setFontSize(25);
  doc.setTextColor("#00042E");
  doc.setFont("courier", "bold");
  doc.text(
    order.type === "AVANCE" ? "BON D'AVANCE" : "BON DE COMMANDE",
    10,
    60,
    { align: "left" }
  );

  doc.setFontSize(15);
  doc.setTextColor("#FF4C5F");
  doc.text(`Numéro de Bon : #${order.bon_number}`, 10, 70, { align: "left" });

  // Address info
  doc.setTextColor("#00042E");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("Entreprise XYZ", 10, 80);
  doc.setFontSize(8);
  items.forEach((item, index) => {
    doc.text("•", 10, 85 + index * 5);
    doc.text(item, 15, 85 + index * 5);
  });

  // Faconnier info
  doc.text("PRÉPARÉ POUR", 10, 120);
  doc.setFontSize(15);
  if (order.faconnier) doc.text(`Faconnier : ${order.faconnier}`, 10, 130);
  if (order.stylist) doc.text(`Stylist : ${order.stylist}`, 10, 140);
  if (order.client) doc.text(`Client : ${order.client}`, 10, 150);

  // Date
  doc.setFontSize(8);
  doc.text("Date:", 10, 160);
  doc.setFont("courier", "bold");
  doc.text(formatDateToDDMMYYYY(order.createdAt), 20, 160);

  // Table content
  const tableStartY = 170;
  if (order.type === "AVANCE") {
    autoTable(doc, {
      startY: tableStartY,
      head: [["Avance", "Méthode", "Description"]],
      body: [[`${order.amount} MAD`, order.method, order.description]],
      styles: { halign: "center" },
      headStyles: { fillColor: "#00042E" },
    });
  } else {
    autoTable(doc, {
      startY: tableStartY,
      head: [
        [
          { content: "Article", colSpan: 2, styles: { halign: "left" } },
          "Quantité",
          "Prix Unitaire",
          "Total",
        ],
      ],
      body: [
        [
          order.productName,
          "",
          order.quantity_sent.toString(),
          order.unit_price.toFixed(2) + " MAD",
          (order.unit_price * order.quantity_sent).toFixed(2) + " MAD",
        ],
      ],
      styles: { halign: "center", fillColor: "#00042E" },
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "center" },
        2: { halign: "center" },
        3: { halign: "center" },
        4: { halign: "right" },
      },
    });
  }

  // Footer note
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const notesBoxHeight = 30;

  doc.setDrawColor(0);
  doc.rect(margin, pageHeight - notesBoxHeight - 30, 90, notesBoxHeight);
  doc.text("Notes:", margin + 2, pageHeight - notesBoxHeight - 35 + 8);
  doc.text(
    "Signature:",
    doc.internal.pageSize.getWidth() - margin - 35,
    pageHeight - notesBoxHeight - 35 + 8
  );
  doc.setFontSize(10);
  doc.text(
    "Merci pour votre confiance.",
    doc.internal.pageSize.getWidth() / 2,
    pageHeight - 10,
    { align: "center" }
  );

  // Trigger browser download
  const pdfBuffer = doc.output("arraybuffer");
  const blob = new Blob([pdfBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = generateFileName(order);
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Download Excel bon in the browser
 */
export async function downloadExcelBon(
  bonId: string,
  type: "faconnier" | "stylist" | "client"
) {
  try {
    const result = await apiClient.get(
      `/api/v1/${type}/bon/download/${bonId}`,
      {
        responseType: "arraybuffer",
      }
    );

    const blob = new Blob([result.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bon-${bonId}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading excel bon:", error);
    throw error;
  }
}
