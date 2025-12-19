import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import SKU from '../models/SKU';
import StockMovement from '../models/StockMovement';
import AuditLog from '../models/AuditLog';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await SKU.deleteMany({});
    await StockMovement.deleteMany({});
    await AuditLog.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await User.create({
      name: 'Rahul Sharma',
      email: 'admin@insyd.com',
      password: hashedPassword,
      role: 'admin',
    });

    const staff = await User.create({
      name: 'Priya Patel',
      email: 'staff@insyd.com',
      password: hashedPassword,
      role: 'staff',
    });

    console.log('Created users');

    // Create SKUs - Tiles
    const tiles = [
      {
        skuCode: 'TILE-VIT-001',
        name: 'Vitrified Floor Tiles 600x600mm Glossy White',
        category: 'tiles',
        subcategory: 'vitrified',
        description: 'Premium glossy white vitrified tiles for modern interiors',
        supplier: 'Kajaria Ceramics',
        costPrice: 45,
        sellingPrice: 65,
        currentStock: 500,
        unit: 'pieces',
        minReorderQuantity: 100,
        maxStockLevel: 800,
        location: 'warehouse',
        attributes: new Map([
          ['size', '600x600mm'],
          ['finish', 'glossy'],
          ['color', 'white'],
        ]),
        isActive: true,
      },
      {
        skuCode: 'TILE-VIT-002',
        name: 'Vitrified Floor Tiles 600x600mm Matte Grey',
        category: 'tiles',
        subcategory: 'vitrified',
        description: 'Contemporary matte grey tiles',
        supplier: 'Kajaria Ceramics',
        costPrice: 48,
        sellingPrice: 70,
        currentStock: 250,
        unit: 'pieces',
        minReorderQuantity: 100,
        maxStockLevel: 600,
        location: 'warehouse',
        attributes: new Map([
          ['size', '600x600mm'],
          ['finish', 'matte'],
          ['color', 'grey'],
        ]),
        isActive: true,
      },
      {
        skuCode: 'TILE-CER-001',
        name: 'Ceramic Wall Tiles 300x450mm Ivory',
        category: 'tiles',
        subcategory: 'ceramic',
        description: 'Classic ivory ceramic wall tiles',
        supplier: 'Somany Ceramics',
        costPrice: 25,
        sellingPrice: 38,
        currentStock: 800,
        unit: 'pieces',
        minReorderQuantity: 200,
        maxStockLevel: 1000,
        location: 'showroom',
        attributes: new Map([
          ['size', '300x450mm'],
          ['finish', 'glossy'],
          ['color', 'ivory'],
        ]),
        isActive: true,
      },
      {
        skuCode: 'TILE-MAR-001',
        name: 'Marble Look Porcelain 800x1600mm',
        category: 'tiles',
        subcategory: 'porcelain',
        description: 'Premium marble look large format tiles',
        supplier: 'RAK Ceramics',
        costPrice: 120,
        sellingPrice: 180,
        currentStock: 50,
        unit: 'pieces',
        minReorderQuantity: 20,
        maxStockLevel: 100,
        location: 'warehouse',
        attributes: new Map([
          ['size', '800x1600mm'],
          ['finish', 'polished'],
          ['color', 'carrara white'],
        ]),
        isActive: true,
      },
    ];

    // Create SKUs - Sanitaryware
    const sanitaryware = [
      {
        skuCode: 'SAN-WC-001',
        name: 'Western Toilet Single Piece White',
        category: 'sanitaryware',
        subcategory: 'wc',
        description: 'Premium single piece WC with soft close seat',
        supplier: 'Hindware',
        costPrice: 5500,
        sellingPrice: 7500,
        currentStock: 25,
        unit: 'pieces',
        minReorderQuantity: 5,
        maxStockLevel: 40,
        location: 'showroom',
        attributes: new Map([
          ['type', 'single-piece'],
          ['color', 'white'],
          ['flush', 'dual-flush'],
        ]),
        isActive: true,
      },
      {
        skuCode: 'SAN-BSN-001',
        name: 'Counter Basin Oval White',
        category: 'sanitaryware',
        subcategory: 'basin',
        description: 'Elegant oval counter basin',
        supplier: 'Cera',
        costPrice: 2200,
        sellingPrice: 3200,
        currentStock: 40,
        unit: 'pieces',
        minReorderQuantity: 10,
        maxStockLevel: 60,
        location: 'showroom',
        attributes: new Map([
          ['type', 'counter'],
          ['shape', 'oval'],
          ['color', 'white'],
        ]),
        isActive: true,
      },
      {
        skuCode: 'SAN-FAU-001',
        name: 'Basin Mixer Chrome Finish',
        category: 'sanitaryware',
        subcategory: 'faucet',
        description: 'Premium chrome basin mixer',
        supplier: 'Jaquar',
        costPrice: 3500,
        sellingPrice: 5000,
        currentStock: 15,
        unit: 'pieces',
        minReorderQuantity: 8,
        maxStockLevel: 30,
        location: 'showroom',
        attributes: new Map([
          ['type', 'mixer'],
          ['finish', 'chrome'],
          ['mounting', 'wall'],
        ]),
        isActive: true,
      },
    ];

    // Create SKUs - Lighting
    const lighting = [
      {
        skuCode: 'LGT-LED-001',
        name: 'LED Panel Light 600x600mm 40W',
        category: 'lighting',
        subcategory: 'panel',
        description: 'Energy efficient LED panel light',
        supplier: 'Philips',
        costPrice: 800,
        sellingPrice: 1200,
        currentStock: 100,
        unit: 'pieces',
        minReorderQuantity: 30,
        maxStockLevel: 150,
        location: 'warehouse',
        attributes: new Map([
          ['wattage', '40W'],
          ['color-temp', '4000K'],
          ['size', '600x600mm'],
        ]),
        isActive: true,
      },
      {
        skuCode: 'LGT-CHD-001',
        name: 'Crystal Chandelier 8 Lights',
        category: 'lighting',
        subcategory: 'chandelier',
        description: 'Luxury crystal chandelier',
        supplier: 'Fos Lighting',
        costPrice: 15000,
        sellingPrice: 22000,
        currentStock: 5,
        unit: 'pieces',
        minReorderQuantity: 2,
        maxStockLevel: 10,
        location: 'showroom',
        attributes: new Map([
          ['lights', '8'],
          ['material', 'crystal'],
          ['finish', 'chrome'],
        ]),
        isActive: true,
      },
      {
        skuCode: 'LGT-SPT-001',
        name: 'LED Spot Light 7W COB',
        category: 'lighting',
        subcategory: 'spotlight',
        description: 'Adjustable LED spotlight',
        supplier: 'Syska',
        costPrice: 450,
        sellingPrice: 700,
        currentStock: 200,
        unit: 'pieces',
        minReorderQuantity: 50,
        maxStockLevel: 300,
        location: 'warehouse',
        attributes: new Map([
          ['wattage', '7W'],
          ['type', 'COB'],
          ['beam-angle', '38°'],
        ]),
        isActive: true,
      },
    ];

    // Create SKUs - Stone
    const stone = [
      {
        skuCode: 'STN-GRN-001',
        name: 'Indian Granite Black Galaxy',
        category: 'stone',
        subcategory: 'granite',
        description: 'Premium black galaxy granite',
        supplier: 'Kerala Granites',
        costPrice: 180,
        sellingPrice: 250,
        currentStock: 500,
        unit: 'sqft',
        minReorderQuantity: 200,
        maxStockLevel: 800,
        location: 'warehouse',
        attributes: new Map([
          ['origin', 'India'],
          ['color', 'black'],
          ['finish', 'polished'],
        ]),
        isActive: true,
      },
      {
        skuCode: 'STN-MAR-001',
        name: 'Italian Marble Carrara White',
        category: 'stone',
        subcategory: 'marble',
        description: 'Imported Carrara white marble',
        supplier: 'Italy Stones',
        costPrice: 350,
        sellingPrice: 500,
        currentStock: 150,
        unit: 'sqft',
        minReorderQuantity: 100,
        maxStockLevel: 300,
        location: 'warehouse',
        attributes: new Map([
          ['origin', 'Italy'],
          ['color', 'white'],
          ['finish', 'polished'],
        ]),
        isActive: true,
      },
    ];

    // Create SKUs - Plywood
    const plywood = [
      {
        skuCode: 'PLY-BWP-001',
        name: 'BWP Grade Plywood 8x4 18mm',
        category: 'plywood',
        subcategory: 'bwp',
        description: 'Waterproof plywood for kitchens',
        supplier: 'Century Ply',
        costPrice: 2200,
        sellingPrice: 2800,
        currentStock: 80,
        unit: 'pieces',
        minReorderQuantity: 20,
        maxStockLevel: 120,
        location: 'warehouse',
        attributes: new Map([
          ['grade', 'BWP'],
          ['size', '8x4 feet'],
          ['thickness', '18mm'],
        ]),
        isActive: true,
      },
      {
        skuCode: 'PLY-MR-001',
        name: 'MR Grade Plywood 8x4 12mm',
        category: 'plywood',
        subcategory: 'mr',
        description: 'Moisture resistant plywood',
        supplier: 'Greenply',
        costPrice: 1400,
        sellingPrice: 1800,
        currentStock: 120,
        unit: 'pieces',
        minReorderQuantity: 30,
        maxStockLevel: 180,
        location: 'warehouse',
        attributes: new Map([
          ['grade', 'MR'],
          ['size', '8x4 feet'],
          ['thickness', '12mm'],
        ]),
        isActive: true,
      },
    ];

    const allSKUs = [...tiles, ...sanitaryware, ...lighting, ...stone, ...plywood];
    const createdSKUs = await SKU.insertMany(allSKUs);
    console.log(`Created ${createdSKUs.length} SKUs`);

    // Create some sample stock movements
    const movements = [];
    const now = new Date();

    // Simulate past 30 days of activity
    for (let i = 0; i < 50; i++) {
      const randomSKU = createdSKUs[Math.floor(Math.random() * createdSKUs.length)];
      const movementTypes = ['inward', 'outward', 'damage'];
      const movementType = movementTypes[Math.floor(Math.random() * movementTypes.length)] as any;
      const quantity = Math.floor(Math.random() * 20) + 1;
      
      const createdAt = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);

      movements.push({
        sku: randomSKU._id,
        skuCode: randomSKU.skuCode,
        skuName: randomSKU.name,
        movementType,
        quantity,
        unit: randomSKU.unit,
        previousStock: randomSKU.currentStock,
        newStock: randomSKU.currentStock + (movementType === 'inward' ? quantity : -quantity),
        costPrice: randomSKU.costPrice,
        sellingPrice: randomSKU.sellingPrice,
        totalValue: movementType === 'outward' ? quantity * randomSKU.sellingPrice : quantity * randomSKU.costPrice,
        reason: movementType === 'damage' ? 'Handling damage' : undefined,
        performedBy: Math.random() > 0.5 ? admin._id : staff._id,
        performedByName: Math.random() > 0.5 ? admin.name : staff.name,
        createdAt,
      });
    }

    await StockMovement.insertMany(movements);
    console.log(`Created ${movements.length} stock movements`);

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('Admin: admin@insyd.com / password123');
    console.log('Staff: staff@insyd.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
