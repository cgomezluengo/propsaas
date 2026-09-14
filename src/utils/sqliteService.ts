import initSqlJs, { Database } from 'sql.js';
import { 
  Lead, 
  PropertyItem, 
  ContractItem, 
  TenantPortalData,
  MaintenanceIncident,
  ReceptionEntry,
  KeyCustodyItem,
  AdCampaign
} from '../types';
import { 
  mockLeadsList, 
  mockProperties, 
  mockContracts, 
  mockTenantPortalData,
  mockIncidents,
  mockReceptionEntries,
  mockKeyCustodyList,
  mockAdCampaigns
} from '../data/mockData';

let dbInstance: Database | null = null;
let sqlPromise: Promise<Database> | null = null;

const DB_STORAGE_KEY = 'propsaas_sqlite_db_v2';

export async function getDatabase(): Promise<Database> {
  if (dbInstance) return dbInstance;
  if (sqlPromise) return sqlPromise;

  sqlPromise = (async () => {
    const base = (((import.meta as any).env?.BASE_URL as string) || '/propsaas/').replace(/\/$/, '');
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
      lastIncreasePercent REAL,
      adjustmentPeriodMonths INTEGER DEFAULT 4,
      lastAdjustmentDate TEXT,
      ipcMonthlyRates TEXT,
      internalAuditStatus TEXT,
      contractStartDate TEXT
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

    CREATE TABLE IF NOT EXISTS incidents (
      id TEXT PRIMARY KEY,
      propertyAddress TEXT NOT NULL,
      tenantName TEXT,
      tenantPhone TEXT,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      urgency TEXT NOT NULL,
      responsibility TEXT NOT NULL,
      status TEXT NOT NULL,
      assignedTrade TEXT,
      estimatedCost REAL,
      dateReported TEXT NOT NULL,
      resolutionDate TEXT,
      lockboxCode TEXT
    );

    CREATE TABLE IF NOT EXISTS reception_entries (
      id TEXT PRIMARY KEY,
      visitorName TEXT NOT NULL,
      visitorType TEXT NOT NULL,
      reason TEXT NOT NULL,
      assignedMartillero TEXT NOT NULL,
      status TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      contactPhone TEXT
    );

    CREATE TABLE IF NOT EXISTS key_custody (
      id TEXT PRIMARY KEY,
      propertyTitle TEXT NOT NULL,
      propertyAddress TEXT NOT NULL,
      keyTag TEXT NOT NULL,
      takenBy TEXT NOT NULL,
      takenAt TEXT NOT NULL,
      returnedAt TEXT,
      status TEXT NOT NULL,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS ad_campaigns (
      id TEXT PRIMARY KEY,
      platform TEXT NOT NULL,
      campaignTitle TEXT NOT NULL,
      budgetMonthly REAL NOT NULL,
      spendSoFar REAL NOT NULL,
      leadsCount INTEGER NOT NULL,
      costPerLead REAL NOT NULL,
      status TEXT NOT NULL,
      syncStatus TEXT NOT NULL
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
      $id, $tenantName, $tenantPhone, $propertyAddress, $currentAmount, $indexType, $nextAdjustmentDate, $monthsToAdjustment, $status, $paymentStatus, $lastIncreasePercent,
      $adjustmentPeriodMonths, $lastAdjustmentDate, $ipcMonthlyRates, $internalAuditStatus, $contractStartDate
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
      $lastIncreasePercent: c.lastIncreasePercent,
      $adjustmentPeriodMonths: c.adjustmentPeriodMonths || 4,
      $lastAdjustmentDate: c.lastAdjustmentDate || '',
      $ipcMonthlyRates: c.ipcMonthlyRates ? JSON.stringify(c.ipcMonthlyRates) : '[]',
      $internalAuditStatus: c.internalAuditStatus || 'al_dia',
      $contractStartDate: c.contractStartDate || ''
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

  // 6. Seed Incidents
  const insertIncStmt = db.prepare(`
    INSERT INTO incidents VALUES (
      $id, $propertyAddress, $tenantName, $tenantPhone, $category, $description, $urgency, $responsibility, $status, $assignedTrade, $estimatedCost, $dateReported, $resolutionDate, $lockboxCode
    )
  `);
  for (const inc of mockIncidents) {
    insertIncStmt.run({
      $id: inc.id,
      $propertyAddress: inc.propertyAddress,
      $tenantName: inc.tenantName,
      $tenantPhone: inc.tenantPhone,
      $category: inc.category,
      $description: inc.description,
      $urgency: inc.urgency,
      $responsibility: inc.responsibility,
      $status: inc.status,
      $assignedTrade: inc.assignedTrade || '',
      $estimatedCost: inc.estimatedCost || 0,
      $dateReported: inc.dateReported,
      $resolutionDate: inc.resolutionDate || '',
      $lockboxCode: inc.lockboxCode || ''
    });
  }
  insertIncStmt.free();

  // 7. Seed Reception Entries
  const insertRecepStmt = db.prepare(`
    INSERT INTO reception_entries VALUES (
      $id, $visitorName, $visitorType, $reason, $assignedMartillero, $status, $timestamp, $contactPhone
    )
  `);
  for (const rec of mockReceptionEntries) {
    insertRecepStmt.run({
      $id: rec.id,
      $visitorName: rec.visitorName,
      $visitorType: rec.visitorType,
      $reason: rec.reason,
      $assignedMartillero: rec.assignedMartillero,
      $status: rec.status,
      $timestamp: rec.timestamp,
      $contactPhone: rec.contactPhone || ''
    });
  }
  insertRecepStmt.free();

  // 8. Seed Key Custody
  const insertKeyStmt = db.prepare(`
    INSERT INTO key_custody VALUES (
      $id, $propertyTitle, $propertyAddress, $keyTag, $takenBy, $takenAt, $returnedAt, $status, $notes
    )
  `);
  for (const key of mockKeyCustodyList) {
    insertKeyStmt.run({
      $id: key.id,
      $propertyTitle: key.propertyTitle,
      $propertyAddress: key.propertyAddress,
      $keyTag: key.keyTag,
      $takenBy: key.takenBy,
      $takenAt: key.takenAt,
      $returnedAt: key.returnedAt || '',
      $status: key.status,
      $notes: key.notes || ''
    });
  }
  insertKeyStmt.free();

  // 9. Seed Ad Campaigns
  const insertAdStmt = db.prepare(`
    INSERT INTO ad_campaigns VALUES (
      $id, $platform, $campaignTitle, $budgetMonthly, $spendSoFar, $leadsCount, $costPerLead, $status, $syncStatus
    )
  `);
  for (const ad of mockAdCampaigns) {
    insertAdStmt.run({
      $id: ad.id,
      $platform: ad.platform,
      $campaignTitle: ad.campaignTitle,
      $budgetMonthly: ad.budgetMonthly,
      $spendSoFar: ad.spendSoFar,
      $leadsCount: ad.leadsCount,
      $costPerLead: ad.costPerLead,
      $status: ad.status,
      $syncStatus: ad.syncStatus
    });
  }
  insertAdStmt.free();
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
      if (col === 'ipcMonthlyRates') {
        try {
          obj[col] = JSON.parse(String(row[idx] || '[]'));
        } catch {
          obj[col] = [];
        }
      } else {
        obj[col] = row[idx];
      }
    });
    return obj as ContractItem;
  });
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
      id, tenantName, tenantPhone, propertyAddress, currentAmount, indexType, nextAdjustmentDate, monthsToAdjustment, status, paymentStatus, lastIncreasePercent,
      adjustmentPeriodMonths, lastAdjustmentDate, ipcMonthlyRates, internalAuditStatus, contractStartDate
    ) VALUES (
      $id, $tenantName, $tenantPhone, $propertyAddress, $currentAmount, $indexType, $nextAdjustmentDate, $monthsToAdjustment, $status, $paymentStatus, $lastIncreasePercent,
      $adjustmentPeriodMonths, $lastAdjustmentDate, $ipcMonthlyRates, $internalAuditStatus, $contractStartDate
    )
    ON CONFLICT(id) DO UPDATE SET
      currentAmount = excluded.currentAmount,
      status = excluded.status,
      paymentStatus = excluded.paymentStatus,
      lastIncreasePercent = excluded.lastIncreasePercent,
      nextAdjustmentDate = excluded.nextAdjustmentDate,
      monthsToAdjustment = excluded.monthsToAdjustment,
      adjustmentPeriodMonths = excluded.adjustmentPeriodMonths,
      lastAdjustmentDate = excluded.lastAdjustmentDate,
      ipcMonthlyRates = excluded.ipcMonthlyRates,
      internalAuditStatus = excluded.internalAuditStatus
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
    $lastIncreasePercent: contract.lastIncreasePercent,
    $adjustmentPeriodMonths: contract.adjustmentPeriodMonths || 4,
    $lastAdjustmentDate: contract.lastAdjustmentDate || '',
    $ipcMonthlyRates: contract.ipcMonthlyRates ? JSON.stringify(contract.ipcMonthlyRates) : '[]',
    $internalAuditStatus: contract.internalAuditStatus || 'al_dia',
    $contractStartDate: contract.contractStartDate || ''
  });
  saveDatabase();
}

export async function deleteContractById(id: string): Promise<void> {
  const db = await getDatabase();
  db.run("DELETE FROM contracts WHERE id = ?", [id]);
  saveDatabase();
}

// Incidents CRUD
export async function queryAllIncidents(): Promise<MaintenanceIncident[]> {
  const db = await getDatabase();
  const res = db.exec("SELECT * FROM incidents ORDER BY id DESC");
  if (!res.length || !res[0].values) return [];
  const cols = res[0].columns;
  return res[0].values.map((row) => {
    const obj: any = {};
    cols.forEach((col, idx) => {
      obj[col] = row[idx];
    });
    return obj as MaintenanceIncident;
  });
}

export async function insertOrUpdateIncident(incident: MaintenanceIncident): Promise<void> {
  const db = await getDatabase();
  db.run(`
    INSERT INTO incidents (
      id, propertyAddress, tenantName, tenantPhone, category, description, urgency, responsibility, status, assignedTrade, estimatedCost, dateReported, resolutionDate, lockboxCode
    ) VALUES (
      $id, $propertyAddress, $tenantName, $tenantPhone, $category, $description, $urgency, $responsibility, $status, $assignedTrade, $estimatedCost, $dateReported, $resolutionDate, $lockboxCode
    )
    ON CONFLICT(id) DO UPDATE SET
      status = excluded.status,
      assignedTrade = excluded.assignedTrade,
      estimatedCost = excluded.estimatedCost,
      resolutionDate = excluded.resolutionDate
  `, {
    $id: incident.id,
    $propertyAddress: incident.propertyAddress,
    $tenantName: incident.tenantName,
    $tenantPhone: incident.tenantPhone,
    $category: incident.category,
    $description: incident.description,
    $urgency: incident.urgency,
    $responsibility: incident.responsibility,
    $status: incident.status,
    $assignedTrade: incident.assignedTrade || '',
    $estimatedCost: incident.estimatedCost || 0,
    $dateReported: incident.dateReported,
    $resolutionDate: incident.resolutionDate || '',
    $lockboxCode: incident.lockboxCode || ''
  });
  saveDatabase();
}

export async function deleteIncidentById(id: string): Promise<void> {
  const db = await getDatabase();
  db.run("DELETE FROM incidents WHERE id = ?", [id]);
  saveDatabase();
}

// Reception Entries CRUD
export async function queryAllReceptionEntries(): Promise<ReceptionEntry[]> {
  const db = await getDatabase();
  const res = db.exec("SELECT * FROM reception_entries ORDER BY timestamp DESC");
  if (!res.length || !res[0].values) return [];
  const cols = res[0].columns;
  return res[0].values.map((row) => {
    const obj: any = {};
    cols.forEach((col, idx) => {
      obj[col] = row[idx];
    });
    return obj as ReceptionEntry;
  });
}

export async function insertOrUpdateReceptionEntry(entry: ReceptionEntry): Promise<void> {
  const db = await getDatabase();
  db.run(`
    INSERT INTO reception_entries (
      id, visitorName, visitorType, reason, assignedMartillero, status, timestamp, contactPhone
    ) VALUES (
      $id, $visitorName, $visitorType, $reason, $assignedMartillero, $status, $timestamp, $contactPhone
    )
    ON CONFLICT(id) DO UPDATE SET
      status = excluded.status,
      assignedMartillero = excluded.assignedMartillero
  `, {
    $id: entry.id,
    $visitorName: entry.visitorName,
    $visitorType: entry.visitorType,
    $reason: entry.reason,
    $assignedMartillero: entry.assignedMartillero,
    $status: entry.status,
    $timestamp: entry.timestamp,
    $contactPhone: entry.contactPhone || ''
  });
  saveDatabase();
}

// Key Custody CRUD
export async function queryAllKeyCustody(): Promise<KeyCustodyItem[]> {
  const db = await getDatabase();
  const res = db.exec("SELECT * FROM key_custody ORDER BY id DESC");
  if (!res.length || !res[0].values) return [];
  const cols = res[0].columns;
  return res[0].values.map((row) => {
    const obj: any = {};
    cols.forEach((col, idx) => {
      obj[col] = row[idx];
    });
    return obj as KeyCustodyItem;
  });
}

export async function insertOrUpdateKeyCustody(key: KeyCustodyItem): Promise<void> {
  const db = await getDatabase();
  db.run(`
    INSERT INTO key_custody (
      id, propertyTitle, propertyAddress, keyTag, takenBy, takenAt, returnedAt, status, notes
    ) VALUES (
      $id, $propertyTitle, $propertyAddress, $keyTag, $takenBy, $takenAt, $returnedAt, $status, $notes
    )
    ON CONFLICT(id) DO UPDATE SET
      status = excluded.status,
      takenBy = excluded.takenBy,
      takenAt = excluded.takenAt,
      returnedAt = excluded.returnedAt,
      notes = excluded.notes
  `, {
    $id: key.id,
    $propertyTitle: key.propertyTitle,
    $propertyAddress: key.propertyAddress,
    $keyTag: key.keyTag,
    $takenBy: key.takenBy,
    $takenAt: key.takenAt,
    $returnedAt: key.returnedAt || '',
    $status: key.status,
    $notes: key.notes || ''
  });
  saveDatabase();
}

// Ad Campaigns CRUD
export async function queryAllAdCampaigns(): Promise<AdCampaign[]> {
  const db = await getDatabase();
  const res = db.exec("SELECT * FROM ad_campaigns ORDER BY leadsCount DESC");
  if (!res.length || !res[0].values) return [];
  const cols = res[0].columns;
  return res[0].values.map((row) => {
    const obj: any = {};
    cols.forEach((col, idx) => {
      obj[col] = row[idx];
    });
    return obj as AdCampaign;
  });
}

export async function insertOrUpdateAdCampaign(ad: AdCampaign): Promise<void> {
  const db = await getDatabase();
  db.run(`
    INSERT INTO ad_campaigns (
      id, platform, campaignTitle, budgetMonthly, spendSoFar, leadsCount, costPerLead, status, syncStatus
    ) VALUES (
      $id, $platform, $campaignTitle, $budgetMonthly, $spendSoFar, $leadsCount, $costPerLead, $status, $syncStatus
    )
    ON CONFLICT(id) DO UPDATE SET
      budgetMonthly = excluded.budgetMonthly,
      spendSoFar = excluded.spendSoFar,
      leadsCount = excluded.leadsCount,
      costPerLead = excluded.costPerLead,
      status = excluded.status,
      syncStatus = excluded.syncStatus
  `, {
    $id: ad.id,
    $platform: ad.platform,
    $campaignTitle: ad.campaignTitle,
    $budgetMonthly: ad.budgetMonthly,
    $spendSoFar: ad.spendSoFar,
    $leadsCount: ad.leadsCount,
    $costPerLead: ad.costPerLead,
    $status: ad.status,
    $syncStatus: ad.syncStatus
  });
  saveDatabase();
}

export async function queryReceiptsForContract(contractId: string, tenantName?: string): Promise<TenantPortalData['receipts']> {
  const db = await getDatabase();
  const res = db.exec("SELECT month, amount, date, pdfUrl FROM receipts WHERE contractId = ? OR tenantName = ? ORDER BY id DESC", [contractId, tenantName || '']);
  if (!res.length || !res[0].values) return [];
  return res[0].values.map((row) => ({
    month: row[0] as string,
    amount: Number(row[1]),
    date: row[2] as string,
    pdfUrl: (row[3] as string) || '#'
  }));
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
