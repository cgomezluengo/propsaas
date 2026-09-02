import initSqlJs, { Database } from 'sql.js';
import { Lead, PropertyItem, ContractItem, TenantPortalData } from '../types';
import { mockLeadsList, mockProperties, mockContracts, mockTenantPortalData } from '../data/mockData';

let dbInstance: Database | null = null;
let sqlPromise: Promise<Database> | null = null;

const DB_STORAGE_KEY = 'propsaas_sqlite_db_v1';

export async function getDatabase(): Promise<Database> {
  if (dbInstance) return dbInstance;
  if (sqlPromise) return sqlPromise;

  sqlPromise = (async () => {
    const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
    const SQL = await initSqlJs({
      locateFile: (file) => `${base}/${file}`
    });

    // Check if we have saved DB in localStorage
    const savedDbBase64 = localStorage.getItem(DB_STORAGE_KEY);
    let db: Database;

    if (savedDbBase64) {
      try {
        const binaryString = window.atob(savedDbBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        db = new SQL.Database(bytes);
      } catch (e) {
        console.warn('Error loading SQLite from localStorage, creating fresh DB:', e);
        db = new SQL.Database();
        initSchemaAndSeed(db);
      }
    } else {
      db = new SQL.Database();
      initSchemaAndSeed(db);
    }

    dbInstance = db;
    saveDatabase();
    return db;
  })();

  return sqlPromise;
}

export function saveDatabase(): void {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    let binary = '';
    const len = data.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(data[i]);
    }
    const base64 = window.btoa(binary);
    localStorage.setItem(DB_STORAGE_KEY, base64);
  } catch (err) {
    console.error('Error saving SQLite DB to localStorage:', err);
  }
}

function initSchemaAndSeed(db: Database) {
  // 1. Schema
  db.run(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      initials TEXT,
      phone TEXT,
      channel TEXT,
      channelIcon TEXT,
      propertyTitle TEXT,
      propertyPrice TEXT,
      propertyImage TEXT,
      propertyAddress TEXT,
      bedrooms INTEGER,
      bathrooms INTEGER,
      timeAgo TEXT,
      unansweredHours INTEGER,
      urgencyLevel TEXT,
      aiScore INTEGER,
      aiIntentLevel TEXT,
      lastMessage TEXT,
      status TEXT,
      lockboxCode TEXT,
      martilleroName TEXT,
      visitTime TEXT,
      guaranteeStatus TEXT
    );

    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      address TEXT NOT NULL,
      price TEXT,
      operation TEXT,
      type TEXT,
      bedrooms INTEGER,
      bathrooms INTEGER,
      coveredM2 INTEGER,
      status TEXT,
      image TEXT,
      featured INTEGER
    );

    CREATE TABLE IF NOT EXISTS contracts (
      id TEXT PRIMARY KEY,
      tenantName TEXT NOT NULL,
      tenantPhone TEXT,
      propertyAddress TEXT,
      currentAmount REAL,
      indexType TEXT,
      nextAdjustmentDate TEXT,
      monthsToAdjustment INTEGER,
      status TEXT,
      paymentStatus TEXT,
      lastIncreasePercent REAL
    );

    CREATE TABLE IF NOT EXISTS receipts (
      id TEXT PRIMARY KEY,
      contractId TEXT,
      tenantName TEXT,
      month TEXT,
      amount REAL,
      date TEXT,
      pdfUrl TEXT
    );
  `);

  // 2. Seed Leads
  const insertLeadStmt = db.prepare(`
    INSERT INTO leads VALUES (
      $id, $name, $initials, $phone, $channel, $channelIcon, $propertyTitle,
      $propertyPrice, $propertyImage, $propertyAddress, $bedrooms, $bathrooms,
      $timeAgo, $unansweredHours, $urgencyLevel, $aiScore, $aiIntentLevel,
      $lastMessage, $status, $lockboxCode, $martilleroName, $visitTime, $guaranteeStatus
    )
  `);

  for (const l of mockLeadsList) {
    insertLeadStmt.run({
      $id: l.id,
      $name: l.name,
      $initials: l.initials || '',
      $phone: l.phone,
      $channel: l.channel,
      $channelIcon: l.channelIcon,
      $propertyTitle: l.propertyTitle,
      $propertyPrice: l.propertyPrice,
      $propertyImage: l.propertyImage,
      $propertyAddress: l.propertyAddress,
      $bedrooms: l.bedrooms,
      $bathrooms: l.bathrooms,
      $timeAgo: l.timeAgo,
      $unansweredHours: l.unansweredHours,
      $urgencyLevel: l.urgencyLevel,
      $aiScore: l.aiScore,
      $aiIntentLevel: l.aiIntentLevel,
      $lastMessage: l.lastMessage,
      $status: l.status,
      $lockboxCode: l.lockboxCode,
      $martilleroName: l.martilleroName,
      $visitTime: l.visitTime || null,
      $guaranteeStatus: l.guaranteeStatus
    });
  }
  insertLeadStmt.free();

  // 3. Seed Properties
  const insertPropStmt = db.prepare(`
    INSERT INTO properties VALUES (
      $id, $title, $address, $price, $operation, $type, $bedrooms, $bathrooms, $coveredM2, $status, $image, $featured
    )
  `);
  for (const p of mockProperties) {
    insertPropStmt.run({
      $id: p.id,
      $title: p.title,
      $address: p.address,
      $price: p.price,
      $operation: p.operation,
      $type: p.type,
      $bedrooms: p.bedrooms,
      $bathrooms: p.bathrooms,
      $coveredM2: p.coveredM2,
      $status: p.status,
      $image: p.image,
      $featured: p.featured ? 1 : 0
    });
  }
  insertPropStmt.free();

  // 4. Seed Contracts
  const insertContStmt = db.prepare(`
    INSERT INTO contracts VALUES (
      $id, $tenantName, $tenantPhone, $propertyAddress, $currentAmount, $indexType, $nextAdjustmentDate, $monthsToAdjustment, $status, $paymentStatus, $lastIncreasePercent
    )
  `);
  for (const c of mockContracts) {
    insertContStmt.run({
      $id: c.id,
      $tenantName: c.tenantName,
      $tenantPhone: c.tenantPhone,
      $propertyAddress: c.propertyAddress,
      $currentAmount: c.currentAmount,
      $indexType: c.indexType,
      $nextAdjustmentDate: c.nextAdjustmentDate,
      $monthsToAdjustment: c.monthsToAdjustment,
      $status: c.status,
      $paymentStatus: c.paymentStatus,
      $lastIncreasePercent: c.lastIncreasePercent
    });
  }
  insertContStmt.free();

  // 5. Seed Receipts
  const insertRecStmt = db.prepare(`
    INSERT INTO receipts VALUES (
      $id, $contractId, $tenantName, $month, $amount, $date, $pdfUrl
    )
  `);
  for (const r of mockTenantPortalData.receipts) {
    insertRecStmt.run({
      $id: `rec-${Math.random().toString(36).substring(2, 9)}`,
      $contractId: 'cont-101',
      $tenantName: mockTenantPortalData.tenantName,
      $month: r.month,
      $amount: r.amount,
      $date: r.date,
      $pdfUrl: r.pdfUrl
    });
  }
  insertRecStmt.free();
}

// Helpers for CRUD
export async function queryAllLeads(): Promise<Lead[]> {
  const db = await getDatabase();
  const res = db.exec("SELECT * FROM leads ORDER BY unansweredHours DESC, id DESC");
  if (!res.length || !res[0].values) return [];
  const cols = res[0].columns;
  return res[0].values.map((row) => {
    const obj: any = {};
    cols.forEach((col, idx) => {
      obj[col] = row[idx];
    });
    return obj as Lead;
  });
}

export async function queryAllProperties(): Promise<PropertyItem[]> {
  const db = await getDatabase();
  const res = db.exec("SELECT * FROM properties");
  if (!res.length || !res[0].values) return [];
  const cols = res[0].columns;
  return res[0].values.map((row) => {
    const obj: any = {};
    cols.forEach((col, idx) => {
      obj[col] = col === 'featured' ? Boolean(row[idx]) : row[idx];
    });
    return obj as PropertyItem;
  });
}

export async function queryAllContracts(): Promise<ContractItem[]> {
  const db = await getDatabase();
  const res = db.exec("SELECT * FROM contracts ORDER BY id DESC");
  if (!res.length || !res[0].values) return [];
  const cols = res[0].columns;
  return res[0].values.map((row) => {
    const obj: any = {};
    cols.forEach((col, idx) => {
      obj[col] = row[idx];
    });
    return obj as ContractItem;
  });
}

export async function queryReceiptsForContract(contractId: string, tenantName: string): Promise<TenantPortalData['receipts']> {
  const db = await getDatabase();
  const stmt = db.prepare("SELECT * FROM receipts WHERE contractId = $cid OR tenantName = $tname ORDER BY date DESC");
  stmt.bind({ $cid: contractId, $tname: tenantName });
  const list: TenantPortalData['receipts'] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject();
    list.push({
      month: row.month as string,
      amount: row.amount as number,
      date: row.date as string,
      pdfUrl: (row.pdfUrl as string) || '#'
    });
  }
  stmt.free();
  return list;
}

export async function insertOrUpdateLead(lead: Lead): Promise<void> {
  const db = await getDatabase();
  db.run(`
    INSERT INTO leads (
      id, name, initials, phone, channel, channelIcon, propertyTitle,
      propertyPrice, propertyImage, propertyAddress, bedrooms, bathrooms,
      timeAgo, unansweredHours, urgencyLevel, aiScore, aiIntentLevel,
      lastMessage, status, lockboxCode, martilleroName, visitTime, guaranteeStatus
    ) VALUES (
      $id, $name, $initials, $phone, $channel, $channelIcon, $propertyTitle,
      $propertyPrice, $propertyImage, $propertyAddress, $bedrooms, $bathrooms,
      $timeAgo, $unansweredHours, $urgencyLevel, $aiScore, $aiIntentLevel,
      $lastMessage, $status, $lockboxCode, $martilleroName, $visitTime, $guaranteeStatus
    )
    ON CONFLICT(id) DO UPDATE SET
      status = excluded.status,
      unansweredHours = excluded.unansweredHours,
      lastMessage = excluded.lastMessage,
      visitTime = excluded.visitTime
  `, {
    $id: lead.id,
    $name: lead.name,
    $initials: lead.initials || '',
    $phone: lead.phone,
    $channel: lead.channel,
    $channelIcon: lead.channelIcon,
    $propertyTitle: lead.propertyTitle,
    $propertyPrice: lead.propertyPrice,
    $propertyImage: lead.propertyImage,
    $propertyAddress: lead.propertyAddress,
    $bedrooms: lead.bedrooms,
    $bathrooms: lead.bathrooms,
    $timeAgo: lead.timeAgo,
    $unansweredHours: lead.unansweredHours,
    $urgencyLevel: lead.urgencyLevel,
    $aiScore: lead.aiScore,
    $aiIntentLevel: lead.aiIntentLevel,
    $lastMessage: lead.lastMessage,
    $status: lead.status,
    $lockboxCode: lead.lockboxCode,
    $martilleroName: lead.martilleroName,
    $visitTime: lead.visitTime || null,
    $guaranteeStatus: lead.guaranteeStatus
  });
  saveDatabase();
}

export async function deleteLeadById(id: string): Promise<void> {
  const db = await getDatabase();
  db.run("DELETE FROM leads WHERE id = ?", [id]);
  saveDatabase();
}

export async function insertOrUpdateContract(contract: ContractItem): Promise<void> {
  const db = await getDatabase();
  db.run(`
    INSERT INTO contracts (
      id, tenantName, tenantPhone, propertyAddress, currentAmount, indexType, nextAdjustmentDate, monthsToAdjustment, status, paymentStatus, lastIncreasePercent
    ) VALUES (
      $id, $tenantName, $tenantPhone, $propertyAddress, $currentAmount, $indexType, $nextAdjustmentDate, $monthsToAdjustment, $status, $paymentStatus, $lastIncreasePercent
    )
    ON CONFLICT(id) DO UPDATE SET
      currentAmount = excluded.currentAmount,
      status = excluded.status,
      paymentStatus = excluded.paymentStatus,
      lastIncreasePercent = excluded.lastIncreasePercent,
      nextAdjustmentDate = excluded.nextAdjustmentDate,
      monthsToAdjustment = excluded.monthsToAdjustment
  `, {
    $id: contract.id,
    $tenantName: contract.tenantName,
    $tenantPhone: contract.tenantPhone,
    $propertyAddress: contract.propertyAddress,
    $currentAmount: contract.currentAmount,
    $indexType: contract.indexType,
    $nextAdjustmentDate: contract.nextAdjustmentDate,
    $monthsToAdjustment: contract.monthsToAdjustment,
    $status: contract.status,
    $paymentStatus: contract.paymentStatus,
    $lastIncreasePercent: contract.lastIncreasePercent
  });
  saveDatabase();
}

export async function deleteContractById(id: string): Promise<void> {
  const db = await getDatabase();
  db.run("DELETE FROM contracts WHERE id = ?", [id]);
  saveDatabase();
}

export async function insertReceipt(receipt: { contractId: string; tenantName: string; month: string; amount: number; date: string; pdfUrl?: string }): Promise<void> {
  const db = await getDatabase();
  db.run(`
    INSERT INTO receipts (id, contractId, tenantName, month, amount, date, pdfUrl)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [`rec-${Date.now()}`, receipt.contractId, receipt.tenantName, receipt.month, receipt.amount, receipt.date, receipt.pdfUrl || '#']);
  saveDatabase();
}

export async function resetSqliteDatabase(): Promise<void> {
  localStorage.removeItem(DB_STORAGE_KEY);
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
  sqlPromise = null;
  await getDatabase();
}

export async function exportSqliteBlob(): Promise<Uint8Array | null> {
  const db = await getDatabase();
  return db.export();
}
