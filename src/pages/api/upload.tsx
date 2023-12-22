import formidable from 'formidable';
import fs from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import pdf from 'pdf-parse';
import PDFParser from 'pdf2json';

import knex from './../../../database/knex';

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

const readFile = (
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  options.uploadDir = '/public/savePdfs';
  console.log(options.uploadDir);
  const form = formidable();
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const parsePdf = async (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    const newFilePath = filePath.replace(/^blob:/, '');

    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      const textContent = pdfData.formImage.Pages[0].Texts.map(
        (text) => text.R[0].T
      ).join(' ');

      resolve(textContent);
    });

    pdfParser.on('pdfParser_dataError', (error) => {
      reject(error);
    });

    // Read the PDF file and parse it
    const pdfBuffer = fs.readFile(newFilePath);
    pdfParser.parseBuffer(pdfBuffer);
  });
};

export default async function ParesePdf(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const files = await readFile(req);
  // console.log(files);

  // if (!files.fields.pdfFile[0]) {
  //   return res.status(400).json({ error: 'No PDF file uploaded.' });
  // }

  // const pdfFilePath = files.fields.pdfFile[0];

  // console.log(pdfFilePath);

  // // Parse PDF file
  // const parsedText = await parsePdf(pdfFilePath);

  // const pdfParser = new PDFParser();
  // pdfParser.on('pdfParser_dataError', (errData: any) =>
  //   console.error(errData.parserError)
  // );
  // pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
  //   console.log('PDFDATA');
  //   console.log(pdfData);
  //   console.log('PAGES');
  //   console.log(pdfData.Pages);
  //   console.log('pages text');
  //   // console.log(pdfData.Pages[0].Texts);
  //   console.log('Pages Text Actual Text');
  //   console.log(pdfData.Pages[0].Texts[1].R);
  // });

  // pdfParser.loadPDF('./public/pdfs/Testpdf_v2.pdf');
  // const pdfParser = new PDFParser(this, 1);

  // pdfParser.on('pdfParser_dataError', (errData) =>
  //   console.error(errData.parserError)
  // );
  // pdfParser.on('pdfParser_dataReady', (pdfData) => {
  //   fs.writeFile(
  //     './public/savePdfs/test2.txt',
  //     pdfParser.getRawTextContent(),
  //     () => {
  //       console.log('Done.');
  //     }
  //   );
  // });

  // pdfParser.loadPDF('./public/pdfs/testPdf_v2.pdf');

  // const dataBuffer = fs.readFileSync('./public/pdfs/dummy.pdf');

  // pdf(dataBuffer).then(function (data) {
  //   // number of pages
  //   console.log(data.numpages);
  //   // number of rendered pages
  //   console.log(data.numrender);
  //   // PDF info
  //   console.log(data.info);
  //   // PDF metadata
  //   console.log(data.metadata);
  //   // PDF.js version
  //   // check https://mozilla.github.io/pdf.js/getting_started/
  //   console.log(data.version);
  //   // PDF text
  //   console.log(data.text);
  // });

  const crawler = require('crawler-request');
  const url =
    'https://study-buddy-dev.s3.us-east-1.amazonaws.com/next-s3-uploads/ba35d15a-d5c5-45f1-828f-71e7a69a6dc7/TestPdf_v2.pdf';

  crawler(url).then(function (response) {
    // handle response
    console.log(response.text);
  });

  res.status(200).json({ text: `hello` });
}
