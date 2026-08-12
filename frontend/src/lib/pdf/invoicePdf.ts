import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type { Challan } from "@/types/challan";

/*
 * ================================================================
 * CONSTANTS
 * ================================================================
 */

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;

const MARGIN = 14;

const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2; // 182mm

/*
 * ================================================================
 * HELPERS
 * ================================================================
 */

function formatCurrency(value: number) {
  if (!Number.isFinite(value)) {
    return "INR 0.00";
  }

  return `INR ${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value?: string) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value?: string) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function sanitizeFileName(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function getInvoiceNumber(challan: Challan) {
  return `INV-${challan.challanNumber.replace(/^SC-/i, "")}`;
}

function getLastTableY(doc: jsPDF, fallback: number) {
  const lastAutoTable = (
    doc as jsPDF & {
      lastAutoTable?: {
        finalY: number;
      };
    }
  ).lastAutoTable;

  return lastAutoTable?.finalY ?? fallback;
}

/*
 * ================================================================
 * FOOTER
 * ================================================================
 */

function drawFooter(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);

  doc.line(MARGIN, pageHeight - 18, pageWidth - MARGIN, pageHeight - 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);

  doc.text("FundsRoom ERP • Official Tax Invoice", MARGIN, pageHeight - 10);

  doc.text(
    `Page ${doc.getNumberOfPages()}`,
    pageWidth - MARGIN,
    pageHeight - 10,
    {
      align: "right",
    },
  );
}

/*
 * ================================================================
 * MAIN FUNCTION
 * ================================================================
 */

export function downloadInvoicePdf(challan: Challan) {
  /*
   * --------------------------------------------------------------
   * VALIDATION
   * --------------------------------------------------------------
   */

  if (challan.status !== "CONFIRMED") {
    throw new Error("Only confirmed challans can generate invoices.");
  }

  /*
   * --------------------------------------------------------------
   * DOCUMENT
   * --------------------------------------------------------------
   */

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  const invoiceNumber = getInvoiceNumber(challan);

  /*
   * ==============================================================
   * 1. INVOICE HEADER
   * ==============================================================
   */

  doc.setFillColor(15, 23, 42);

  doc.rect(0, 0, pageWidth, 38, "F");

  /*
   * Company
   */

  doc.setTextColor(255, 255, 255);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(21);

  doc.text("FUNDSROOM", MARGIN, 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);

  doc.text("ERP & Business Operations", MARGIN, 22);

  doc.text("Sales • Inventory • Billing", MARGIN, 27);

  /*
   * Invoice title
   */

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);

  doc.text("TAX INVOICE", pageWidth - MARGIN, 15, {
    align: "right",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  doc.text(invoiceNumber, pageWidth - MARGIN, 22, {
    align: "right",
  });

  doc.text("CONFIRMED", pageWidth - MARGIN, 28, {
    align: "right",
  });

  /*
   * ==============================================================
   * 2. INVOICE INFORMATION
   * ==============================================================
   */

  let currentY = 48;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);

  doc.text("Invoice Information", MARGIN, currentY);

  currentY += 5;

  /*
   * EXACTLY 182mm TOTAL
   *
   * 32 + 59 + 32 + 59 = 182
   */

  autoTable(doc, {
    startY: currentY,

    margin: {
      left: MARGIN,
      right: MARGIN,
    },

    tableWidth: CONTENT_WIDTH,

    theme: "grid",

    head: [["Invoice Number", "Invoice Date", "Reference Challan", "Status"]],

    body: [
      [
        invoiceNumber,
        formatDate(challan.updatedAt ?? challan.createdAt),
        challan.challanNumber,
        challan.status,
      ],
    ],

    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 4,
      valign: "middle",
      lineColor: [226, 232, 240],
      lineWidth: 0.3,
      textColor: [51, 65, 85],
    },

    headStyles: {
      fillColor: [248, 250, 252],
      textColor: [71, 85, 105],
      fontStyle: "bold",
      fontSize: 8,
      halign: "left",
    },

    bodyStyles: {
      fillColor: [255, 255, 255],
      fontStyle: "bold",
      textColor: [15, 23, 42],
    },

    columnStyles: {
      0: {
        cellWidth: 32,
      },

      1: {
        cellWidth: 59,
      },

      2: {
        cellWidth: 32,
      },

      3: {
        cellWidth: 59,
      },
    },
  });

  currentY = getLastTableY(doc, currentY + 25);

  /*
   * ==============================================================
   * 3. BILL FROM / BILL TO
   * ==============================================================
   */

  currentY += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);

  doc.text("Billing Details", MARGIN, currentY);

  currentY += 5;

  /*
   * Two equal sections:
   *
   * 91 + 91 = 182
   */

  autoTable(doc, {
    startY: currentY,

    margin: {
      left: MARGIN,
      right: MARGIN,
    },

    tableWidth: CONTENT_WIDTH,

    theme: "grid",

    head: [["BILL FROM", "BILL TO"]],

    body: [
      [
        "FundsRoom\nERP & Business Operations\nSales & Distribution",
        `${challan.customer?.name ?? "Customer"}\n${
          challan.customer?.businessName ?? "Business Customer"
        }`,
      ],
    ],

    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 5,
      valign: "top",
      lineColor: [226, 232, 240],
      lineWidth: 0.3,
      textColor: [51, 65, 85],
      minCellHeight: 29,
    },

    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },

    bodyStyles: {
      fillColor: [255, 255, 255],
    },

    columnStyles: {
      0: {
        cellWidth: 91,
      },

      1: {
        cellWidth: 91,
      },
    },
  });

  currentY = getLastTableY(doc, currentY + 40);

  /*
   * ==============================================================
   * 4. ITEMS TABLE
   * ==============================================================
   */

  currentY += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);

  doc.text("Invoice Items", MARGIN, currentY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);

  doc.text(
    "Products and prices captured from the confirmed sales challan.",
    MARGIN,
    currentY + 5,
  );

  currentY += 10;

  const rows = challan.items.map((item, index) => {
    const quantity = Number(item.quantity) || 0;

    const unitPrice = Number(item.unitPriceSnapshot) || 0;

    const amount = quantity * unitPrice;

    return [
      String(index + 1).padStart(2, "0"),
      item.productNameSnapshot,
      item.skuSnapshot,
      quantity.toLocaleString("en-IN"),
      formatCurrency(unitPrice),
      formatCurrency(amount),
    ];
  });

  /*
   * EXACTLY 182mm TOTAL
   *
   * 10 + 59 + 31 + 18 + 32 + 32 = 182
   */

  autoTable(doc, {
    startY: currentY,

    margin: {
      left: MARGIN,
      right: MARGIN,
      bottom: 28,
    },

    tableWidth: CONTENT_WIDTH,

    theme: "grid",

    head: [["#", "DESCRIPTION", "SKU", "QTY", "UNIT PRICE", "AMOUNT"]],

    body: rows,

    styles: {
      font: "helvetica",
      fontSize: 8.5,
      cellPadding: 4,
      valign: "middle",
      lineColor: [226, 232, 240],
      lineWidth: 0.3,
      textColor: [51, 65, 85],
    },

    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7.5,
      valign: "middle",
    },

    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },

    columnStyles: {
      0: {
        cellWidth: 10,
        halign: "center",
      },

      1: {
        cellWidth: 59,
        halign: "left",
      },

      2: {
        cellWidth: 31,
        halign: "center",
      },

      3: {
        cellWidth: 18,
        halign: "right",
      },

      4: {
        cellWidth: 32,
        halign: "right",
      },

      5: {
        cellWidth: 32,
        halign: "right",
        fontStyle: "bold",
      },
    },

    didParseCell(data) {
      /*
       * Header alignment
       */

      if (data.section === "head") {
        if (
          data.column.index === 3 ||
          data.column.index === 4 ||
          data.column.index === 5
        ) {
          data.cell.styles.halign = "right";
        }

        if (data.column.index === 0) {
          data.cell.styles.halign = "center";
        }

        if (data.column.index === 2) {
          data.cell.styles.halign = "center";
        }
      }
    },

    didDrawPage() {
      drawFooter(doc);
    },
  });

  currentY = getLastTableY(doc, currentY + 30);

  /*
   * ==============================================================
   * 5. TOTALS
   * ==============================================================
   */

  currentY += 10;

  /*
   * Keep totals together.
   */

  if (currentY > 225) {
    doc.addPage();

    drawFooter(doc);

    currentY = 24;
  }

  /*
   * Summary title
   */

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);

  doc.text("Invoice Summary", MARGIN, currentY);

  currentY += 5;

  /*
   * Total box aligned to the right.
   *
   * Width = 100mm
   */

  const totalsWidth = 100;

  const totalsX = pageWidth - MARGIN - totalsWidth;

  autoTable(doc, {
    startY: currentY,

    margin: {
      left: totalsX,
      right: MARGIN,
    },

    tableWidth: totalsWidth,

    theme: "grid",

    body: [
      ["Total Quantity", challan.totalQuantity.toLocaleString("en-IN")],
      ["Subtotal", formatCurrency(Number(challan.totalAmount))],
      ["Grand Total", formatCurrency(Number(challan.totalAmount))],
    ],

    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 4,
      valign: "middle",
      lineColor: [226, 232, 240],
      lineWidth: 0.3,
      textColor: [51, 65, 85],
    },

    columnStyles: {
      0: {
        cellWidth: 60,
        fontStyle: "bold",
      },

      1: {
        cellWidth: 40,
        halign: "right",
      },
    },

    didParseCell(data) {
      /*
       * Grand total gets stronger visual hierarchy.
       */

      if (data.row.index === 2 && data.section === "body") {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fontSize = 10;
        data.cell.styles.textColor = [15, 23, 42];
      }

      /*
       * Every number is right aligned.
       */

      if (data.column.index === 1 && data.section === "body") {
        data.cell.styles.halign = "right";
      }
    },
  });

  currentY = getLastTableY(doc, currentY + 35);

  /*
   * ==============================================================
   * 6. TRANSACTION INFORMATION
   * ==============================================================
   */

  currentY += 10;

  if (currentY > 255) {
    doc.addPage();

    drawFooter(doc);

    currentY = 24;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);

  doc.text("Transaction Information", MARGIN, currentY);

  currentY += 5;

  /*
   * 32 + 59 + 32 + 59 = 182
   */

  autoTable(doc, {
    startY: currentY,

    margin: {
      left: MARGIN,
      right: MARGIN,
    },

    tableWidth: CONTENT_WIDTH,

    theme: "grid",

    body: [
      [
        "Created By",
        challan.createdBy?.name ?? "—",
        "Source Challan",
        challan.challanNumber,
      ],
      [
        "Created On",
        formatDateTime(challan.createdAt),
        "Invoice Status",
        challan.status,
      ],
    ],

    styles: {
      font: "helvetica",
      fontSize: 8.5,
      cellPadding: 4,
      valign: "middle",
      lineColor: [226, 232, 240],
      lineWidth: 0.3,
      textColor: [71, 85, 105],
    },

    columnStyles: {
      0: {
        cellWidth: 32,
        fontStyle: "bold",
      },

      1: {
        cellWidth: 59,
      },

      2: {
        cellWidth: 32,
        fontStyle: "bold",
      },

      3: {
        cellWidth: 59,
      },
    },
  });

  /*
   * ==============================================================
   * 7. NOTES
   * ==============================================================
   */

  currentY = getLastTableY(doc, currentY + 30);

  currentY += 9;

  if (currentY > 270) {
    doc.addPage();

    drawFooter(doc);

    currentY = 24;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);

  doc.text("Notes", MARGIN, currentY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);

  doc.text(
    "This invoice has been generated from the confirmed sales challan shown above.",
    MARGIN,
    currentY + 6,
  );

  doc.text(
    "Please retain this document for your business records.",
    MARGIN,
    currentY + 11,
  );

  /*
   * ==============================================================
   * 8. FOOTER ON EVERY PAGE
   * ==============================================================
   */

  const totalPages = doc.getNumberOfPages();

  for (let page = 1; page <= totalPages; page++) {
    doc.setPage(page);

    drawFooter(doc);

    /*
     * Page number is redrawn with current page count.
     */

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);

    doc.text(
      `Page ${page} of ${totalPages}`,
      pageWidth - MARGIN,
      PAGE_HEIGHT - 10,
      {
        align: "right",
      },
    );
  }

  /*
   * ==============================================================
   * 9. DOWNLOAD
   * ==============================================================
   */

  const userName = sanitizeFileName(challan.createdBy?.name ?? "User");

  const fileInvoiceNumber = sanitizeFileName(invoiceNumber);

  doc.save(`${userName}_${fileInvoiceNumber}.pdf`);
}
