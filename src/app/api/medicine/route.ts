// src/app/api/medicine/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'medicines.txt');

// Ensure the directory exists
if (!fs.existsSync(path.dirname(filePath))) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

// Read file content or initialize empty
const getMedicines = (): string[] => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return data.split('\n').filter(Boolean);
  } catch {
    return [];
  }
};

const saveMedicine = (medicine: string) => {
  const medicines = getMedicines();
  if (!medicines.includes(medicine)) {
    medicines.push(medicine);
    fs.writeFileSync(filePath, medicines.join('\n'), 'utf8');
  }
};

export async function GET() {
  const medicines = getMedicines();
  return NextResponse.json(medicines);
}

export async function POST(request: Request) {
  const { medicine } = await request.json();
  if (medicine) {
    saveMedicine(medicine);
    return NextResponse.json({ message: 'Medicine saved successfully' });
  }
  return NextResponse.json({ error: 'Medicine name is required' }, { status: 400 });
}
