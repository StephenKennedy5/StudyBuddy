import { promises as fs } from 'fs'; // To save the file temporarily
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server'; // To handle the request and response
import PDFParser from 'pdf2json'; // To parse the pdf
import { v4 as uuidv4 } from 'uuid'; // To generate a unique filename

import knex from './../../../database/knex';

// const uuid = require('uuid');

/*
  Upload PDF as formData to backend
  print pdf as text
  write text to .txt

*/

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function ParesePdf(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({ text: `hello` });
}
