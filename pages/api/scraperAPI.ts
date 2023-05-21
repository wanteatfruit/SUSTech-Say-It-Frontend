import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const filePath = path.join(process.cwd(), 'qs.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = fs.readFileSync(filePath, 'utf8');
  const records = JSON.parse(data);
  res.status(200).json(records);
}
