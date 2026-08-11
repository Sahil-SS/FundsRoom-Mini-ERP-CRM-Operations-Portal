require("dotenv").config();

const bcrypt = require("bcrypt");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const seed = async () => {
  console.log("Starting database seed...");

  // =====================================================
  // 1. CREATE USERS
  // =====================================================

  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const salesPassword = await bcrypt.hash("Sales@123", 10);
  const warehousePassword = await bcrypt.hash("Warehouse@123", 10);
  const accountsPassword = await bcrypt.hash("Accounts@123", 10);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@fundsroom.local",
    },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@fundsroom.local",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  const sales = await prisma.user.upsert({
    where: {
      email: "sales@fundsroom.local",
    },
    update: {},
    create: {
      name: "Sales User",
      email: "sales@fundsroom.local",
      passwordHash: salesPassword,
      role: "SALES",
    },
  });

  const warehouse = await prisma.user.upsert({
    where: {
      email: "warehouse@fundsroom.local",
    },
    update: {},
    create: {
      name: "Warehouse User",
      email: "warehouse@fundsroom.local",
      passwordHash: warehousePassword,
      role: "WAREHOUSE",
    },
  });

  const accounts = await prisma.user.upsert({
    where: {
      email: "accounts@fundsroom.local",
    },
    update: {},
    create: {
      name: "Accounts User",
      email: "accounts@fundsroom.local",
      passwordHash: accountsPassword,
      role: "ACCOUNTS",
    },
  });

  console.log("Users created.");

  // =====================================================
  // 2. CREATE CUSTOMERS
  // =====================================================

  const retailCustomer = await prisma.customer.upsert({
    where: {
      id: "customer-retail-001",
    },
    update: {},
    create: {
      id: "customer-retail-001",
      name: "Rahul Sharma",
      mobile: "9876543210",
      email: "rahul@example.com",
      businessName: "Rahul Retail Store",
      gstNumber: "29ABCDE1234F1Z5",
      type: "RETAIL",
      address: "MG Road, Bengaluru",
      status: "ACTIVE",
      followUpDate: new Date("2026-08-15"),
      notes: "Regular retail customer.",
      createdById: sales.id,
    },
  });

  const wholesaleCustomer = await prisma.customer.upsert({
    where: {
      id: "customer-wholesale-001",
    },
    update: {},
    create: {
      id: "customer-wholesale-001",
      name: "Amit Verma",
      mobile: "9876543211",
      email: "amit@example.com",
      businessName: "Verma Wholesale Mart",
      gstNumber: "29FGHIJ5678K1Z2",
      type: "WHOLESALE",
      address: "Peenya Industrial Area, Bengaluru",
      status: "ACTIVE",
      followUpDate: new Date("2026-08-18"),
      notes: "High-volume wholesale customer.",
      createdById: sales.id,
    },
  });

  const distributorCustomer = await prisma.customer.upsert({
    where: {
      id: "customer-distributor-001",
    },
    update: {},
    create: {
      id: "customer-distributor-001",
      name: "Priya Enterprises",
      mobile: "9876543212",
      email: "priya@example.com",
      businessName: "Priya Distributors",
      gstNumber: "29LMNOP9012Q1Z8",
      type: "DISTRIBUTOR",
      address: "Electronic City, Bengaluru",
      status: "ACTIVE",
      followUpDate: new Date("2026-08-20"),
      notes: "Distributor for South Bengaluru region.",
      createdById: sales.id,
    },
  });

  const leadCustomer = await prisma.customer.upsert({
    where: {
      id: "customer-lead-001",
    },
    update: {},
    create: {
      id: "customer-lead-001",
      name: "Karan Mehta",
      mobile: "9876543213",
      email: "karan@example.com",
      businessName: "Mehta Electronics",
      type: "RETAIL",
      address: "Indiranagar, Bengaluru",
      status: "LEAD",
      followUpDate: new Date("2026-08-13"),
      notes: "Interested in bulk purchase.",
      createdById: sales.id,
    },
  });

  console.log("Customers created.");

  // =====================================================
  // 3. CREATE PRODUCTS
  // =====================================================

  const products = [
    {
      id: "product-001",
      name: "Wireless Mouse",
      sku: "MOUSE-001",
      category: "Electronics",
      unitPrice: "500.00",
      currentStock: 50,
      minimumStock: 10,
      warehouseLocation: "Warehouse A - Rack 1",
    },
    {
      id: "product-002",
      name: "Mechanical Keyboard",
      sku: "KEYBOARD-001",
      category: "Electronics",
      unitPrice: "2500.00",
      currentStock: 25,
      minimumStock: 5,
      warehouseLocation: "Warehouse A - Rack 2",
    },
    {
      id: "product-003",
      name: "USB-C Cable",
      sku: "CABLE-001",
      category: "Accessories",
      unitPrice: "350.00",
      currentStock: 100,
      minimumStock: 20,
      warehouseLocation: "Warehouse A - Rack 3",
    },
    {
      id: "product-004",
      name: "Laptop Stand",
      sku: "STAND-001",
      category: "Accessories",
      unitPrice: "1200.00",
      currentStock: 8,
      minimumStock: 10,
      warehouseLocation: "Warehouse B - Rack 1",
    },
    {
      id: "product-005",
      name: "Webcam",
      sku: "WEBCAM-001",
      category: "Electronics",
      unitPrice: "3200.00",
      currentStock: 15,
      minimumStock: 5,
      warehouseLocation: "Warehouse B - Rack 2",
    },
    {
      id: "product-006",
      name: "Bluetooth Speaker",
      sku: "SPEAKER-001",
      category: "Audio",
      unitPrice: "1800.00",
      currentStock: 30,
      minimumStock: 8,
      warehouseLocation: "Warehouse B - Rack 3",
    },
    {
      id: "product-007",
      name: "HDMI Cable",
      sku: "HDMI-001",
      category: "Accessories",
      unitPrice: "600.00",
      currentStock: 6,
      minimumStock: 10,
      warehouseLocation: "Warehouse A - Rack 4",
    },
    {
      id: "product-008",
      name: "Wireless Headphones",
      sku: "HEADPHONE-001",
      category: "Audio",
      unitPrice: "2800.00",
      currentStock: 20,
      minimumStock: 5,
      warehouseLocation: "Warehouse B - Rack 4",
    },
  ];

  const createdProducts = [];

  for (const product of products) {
    const createdProduct = await prisma.product.upsert({
      where: {
        sku: product.sku,
      },
      update: {},
      create: product,
    });

    createdProducts.push(createdProduct);
  }

  console.log("Products created.");

  // =====================================================
  // 4. CREATE INITIAL STOCK MOVEMENTS
  // =====================================================

  const existingInitialMovements = await prisma.stockMovement.count({
    where: {
      reason: "Initial stock",
    },
  });

  if (existingInitialMovements === 0) {
    for (const product of createdProducts) {
      await prisma.stockMovement.create({
        data: {
          productId: product.id,
          quantity: product.currentStock,
          type: "IN",
          reason: "Initial stock",
          createdById: warehouse.id,
        },
      });
    }

    console.log("Initial stock movements created.");
  } else {
    console.log("Initial stock movements already exist. Skipping.");
  }

  // =====================================================
  // 5. CREATE FOLLOW-UP HISTORY
  // =====================================================

  await prisma.followUp.upsert({
    where: {
      id: "followup-001",
    },
    update: {},
    create: {
      id: "followup-001",
      customerId: retailCustomer.id,
      note: "Customer requested pricing for next order.",
      followUpDate: new Date("2026-08-15"),
      createdById: sales.id,
    },
  });

  await prisma.followUp.upsert({
    where: {
      id: "followup-002",
    },
    update: {},
    create: {
      id: "followup-002",
      customerId: wholesaleCustomer.id,
      note: "Discuss bulk order requirements.",
      followUpDate: new Date("2026-08-18"),
      createdById: sales.id,
    },
  });

  await prisma.followUp.upsert({
    where: {
      id: "followup-003",
    },
    update: {},
    create: {
      id: "followup-003",
      customerId: leadCustomer.id,
      note: "Initial sales call completed. Follow up for quotation.",
      followUpDate: new Date("2026-08-13"),
      createdById: sales.id,
    },
  });
  console.log("Follow-ups created.");

  console.log("\nDatabase seed completed successfully.");
};

seed()
  .catch((error) => {
    console.error("\nDatabase seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
