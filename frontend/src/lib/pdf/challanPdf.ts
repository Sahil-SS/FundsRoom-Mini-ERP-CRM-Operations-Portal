import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type { Challan } from "@/types/challan";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function sanitizeFileName(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function getStatusLabel(status: Challan["status"]) {
  switch (status) {
    case "DRAFT":
      return "DRAFT";

    case "CONFIRMED":
      return "CONFIRMED";

    case "CANCELLED":
      return "CANCELLED";

    default:
      return status;
  }
}

function getStatusColor(status: Challan["status"]): [number, number, number] {
  switch (status) {
    case "CONFIRMED":
      return [22, 163, 74];

    case "CANCELLED":
      return [220, 38, 38];

    case "DRAFT":
    default:
      return [217, 119, 6];
  }
}

export function downloadChallanPdf(challan: Challan) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  const pageHeight = doc.internal.pageSize.getHeight();

  const margin = 14;

  /*
   * ============================================================
   * HEADER
   * ============================================================
   */

  doc.setFillColor(15, 23, 42);

  doc.rect(0, 0, pageWidth, 34, "F");

  doc.setTextColor(255, 255, 255);

  doc.setFont("helvetica", "bold");

  doc.setFontSize(20);

  doc.text("FUNDSROOM", margin, 14);

  doc.setFontSize(9);

  doc.setFont("helvetica", "normal");

  doc.text("ERP & Business Operations", margin, 20);

  doc.setFont("helvetica", "bold");

  doc.setFontSize(15);

  doc.text("SALES CHALLAN", pageWidth - margin, 14, {
    align: "right",
  });

  doc.setFont("helvetica", "normal");

  doc.setFontSize(9);

  doc.text(challan.challanNumber, pageWidth - margin, 20, {
    align: "right",
  });

  /*
   * ============================================================
   * STATUS
   * ============================================================
   */

  const statusLabel = getStatusLabel(challan.status);

  const [statusR, statusG, statusB] = getStatusColor(challan.status);

  const statusWidth = 42;
  const statusHeight = 10;

  const statusX = pageWidth - margin - statusWidth;

  const statusY = 39;

  doc.setFillColor(statusR, statusG, statusB);

  doc.roundedRect(statusX, statusY, statusWidth, statusHeight, 2, 2, "F");

  doc.setTextColor(255, 255, 255);

  doc.setFont("helvetica", "bold");

  doc.setFontSize(9);

  doc.text(statusLabel, statusX + statusWidth / 2, statusY + 6.5, {
    align: "center",
  });

  /*
   * ============================================================
   * CHALLAN INFORMATION TABLE
   * ============================================================
   */

  autoTable(doc, {
    startY: 55,

    theme: "grid",

    margin: {
      left: margin,
      right: margin,
    },

    head: [["Challan Information", "", "", ""]],

    body: [
      ["Challan Number", challan.challanNumber, "Status", statusLabel],
      [
        "Created Date",
        formatDate(challan.createdAt),
        "Last Updated",
        formatDate(challan.updatedAt),
      ],
    ],

    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 4,
      lineColor: [220, 225, 232],
      lineWidth: 0.2,
      textColor: [51, 65, 85],
    },

    headStyles: {
      fillColor: [241, 245, 249],
      textColor: [15, 23, 42],
      fontStyle: "bold",
      fontSize: 10,
    },

    columnStyles: {
      0: {
        fontStyle: "bold",
        cellWidth: 38,
      },

      1: {
        cellWidth: 57,
      },

      2: {
        fontStyle: "bold",
        cellWidth: 30,
      },

      3: {
        cellWidth: 57,
      },
    },

    didParseCell: (data) => {
      if (data.section === "head" && data.column.index === 0) {
        data.cell.colSpan = 4;
      }

      if (
        data.section === "body" &&
        data.column.index === 3 &&
        data.row.index === 0
      ) {
        data.cell.styles.fontStyle = "bold";

        data.cell.styles.textColor = [statusR, statusG, statusB];
      }
    },
  });

  /*
   * ============================================================
   * CUSTOMER INFORMATION
   * ============================================================
   */

  const customerY =
    ((
      doc as jsPDF & {
        lastAutoTable?: {
          finalY: number;
        };
      }
    ).lastAutoTable?.finalY ?? 0) + 8;

  autoTable(doc, {
    startY: customerY,

    theme: "grid",

    margin: {
      left: margin,
      right: margin,
    },

    head: [["Customer Information", "", "", ""]],

    body: [
      [
        "Customer",
        challan.customer?.name ?? "—",
        "Business",
        challan.customer?.businessName ?? "—",
      ],
    ],

    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 4,
      lineColor: [220, 225, 232],
      lineWidth: 0.2,
      textColor: [51, 65, 85],
    },

    headStyles: {
      fillColor: [241, 245, 249],
      textColor: [15, 23, 42],
      fontStyle: "bold",
      fontSize: 10,
    },

    columnStyles: {
      0: {
        fontStyle: "bold",
        cellWidth: 30,
      },

      1: {
        cellWidth: 65,
      },

      2: {
        fontStyle: "bold",
        cellWidth: 30,
      },

      3: {
        cellWidth: 57,
      },
    },

    didParseCell: (data) => {
      if (data.section === "head" && data.column.index === 0) {
        data.cell.colSpan = 4;
      }
    },
  });

  /*
   * ============================================================
   * CREATED BY
   * ============================================================
   */

  const createdByY =
    ((
      doc as jsPDF & {
        lastAutoTable?: {
          finalY: number;
        };
      }
    ).lastAutoTable?.finalY ?? 0) + 8;

  autoTable(doc, {
    startY: createdByY,

    theme: "grid",

    margin: {
      left: margin,
      right: margin,
    },

    head: [["Document Information", "", "", ""]],

    body: [
      [
        "Created By",
        challan.createdBy?.name ?? "—",
        "Role",
        challan.createdBy?.role ?? "—",
      ],
    ],

    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 4,
      lineColor: [220, 225, 232],
      lineWidth: 0.2,
      textColor: [51, 65, 85],
    },

    headStyles: {
      fillColor: [241, 245, 249],
      textColor: [15, 23, 42],
      fontStyle: "bold",
      fontSize: 10,
    },

    columnStyles: {
      0: {
        fontStyle: "bold",
        cellWidth: 30,
      },

      1: {
        cellWidth: 65,
      },

      2: {
        fontStyle: "bold",
        cellWidth: 30,
      },

      3: {
        cellWidth: 57,
      },
    },

    didParseCell: (data) => {
      if (data.section === "head" && data.column.index === 0) {
        data.cell.colSpan = 4;
      }
    },
  });

  /*
   * ============================================================
   * PRODUCT TABLE
   * ============================================================
   */

  const productsY =
    ((
      doc as jsPDF & {
        lastAutoTable?: {
          finalY: number;
        };
      }
    ).lastAutoTable?.finalY ?? 0) + 10;

  const productRows = challan.items.map((item, index) => {
    const quantity = Number(item.quantity);

    const unitPrice = Number(item.unitPriceSnapshot);

    const lineTotal = quantity * unitPrice;

    return [
      String(index + 1),
      item.productNameSnapshot,
      item.skuSnapshot,
      quantity.toLocaleString("en-IN"),
      formatCurrency(unitPrice),
      formatCurrency(lineTotal),
    ];
  });

  autoTable(doc, {
    startY: productsY,

    theme: "grid",

    margin: {
      left: margin,
      right: margin,
    },

    head: [["#", "Product", "SKU", "Quantity", "Unit Price", "Amount"]],

    body: productRows,

    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 4,
      valign: "middle",
      lineColor: [220, 225, 232],
      lineWidth: 0.2,
      textColor: [51, 65, 85],
    },

    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },

    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },

    columnStyles: {
      0: {
        halign: "center",
        cellWidth: 10,
      },

      1: {
        cellWidth: 58,
      },

      2: {
        cellWidth: 40,
      },

      3: {
        halign: "right",
        cellWidth: 24,
      },

      4: {
        halign: "right",
        cellWidth: 30,
      },

      5: {
        halign: "right",
        cellWidth: 32,
      },
    },
  });

  /*
   * ============================================================
   * SUMMARY TABLE
   * ============================================================
   */

  const summaryY =
    (
      doc as jsPDF & {
        lastAutoTable?: {
          finalY: number;
        };
      }
    ).lastAutoTable?.finalY ?? 0 + 8;

  autoTable(doc, {
    startY: summaryY,

    theme: "grid",

    tableWidth: 92,

    margin: {
      left: pageWidth - margin - 92,
    },

    body: [
      ["Total Quantity", challan.totalQuantity.toLocaleString("en-IN")],
      ["Total Amount", formatCurrency(Number(challan.totalAmount))],
    ],

    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 4,
      lineColor: [220, 225, 232],
      lineWidth: 0.2,
      textColor: [51, 65, 85],
    },

    columnStyles: {
      0: {
        fontStyle: "bold",
        cellWidth: 52,
      },

      1: {
        halign: "right",
        fontStyle: "bold",
        cellWidth: 40,
      },
    },

    didParseCell: (data) => {
      if (data.section === "body" && data.row.index === 1) {
        data.cell.styles.fontSize = 10;
      }
    },
  });

  /*
   * ============================================================
   * FOOTER
   * ============================================================
   */

  const generatedAt = formatDate(new Date().toISOString());

  doc.setDrawColor(220, 225, 232);

  doc.line(margin, pageHeight - 25, pageWidth - margin, pageHeight - 25);

  doc.setFont("helvetica", "normal");

  doc.setFontSize(7.5);

  doc.setTextColor(100, 116, 139);

  doc.text("FundsRoom ERP — Sales Challan", margin, pageHeight - 17);

  doc.text(`Generated: ${generatedAt}`, pageWidth - margin, pageHeight - 17, {
    align: "right",
  });

  doc.text(`Status: ${statusLabel}`, margin, pageHeight - 11);

  doc.text(
    `Created By: ${challan.createdBy?.name ?? "—"}`,
    pageWidth - margin,
    pageHeight - 11,
    {
      align: "right",
    },
  );

  /*
   * ============================================================
   * FILE NAME
   * ============================================================
   */

  const userName = sanitizeFileName(challan.createdBy?.name ?? "User");

  const challanNumber = sanitizeFileName(challan.challanNumber);

  const fileName = `${userName}_${challanNumber}.pdf`;

  doc.save(fileName);
}
