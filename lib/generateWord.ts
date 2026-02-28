// Generate Word document from SKKN content
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  convertInchesToTwip,
} from 'docx'
import { WrittenSection } from './types'

export interface DocxOptions {
  title: string
  author: string
  school: string
  sections: WrittenSection[]
}

export async function generateWordDocument(
  options: DocxOptions
): Promise<Blob> {
  const { title, author, school, sections } = options

  // Create title page
  const titleParagraphs = [
    new Paragraph({
      text: school.toUpperCase(),
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      text: '───────────',
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: 'SÁNG KIẾN KINH NGHIỆM',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 200 },
    }),
    new Paragraph({
      text: title.toUpperCase(),
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: '',
      spacing: { after: 2000 },
    }),
    new Paragraph({
      text: `Người thực hiện: ${author}`,
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
    }),
    new Paragraph({
      text: `Năm học: ${new Date().getFullYear()} - ${new Date().getFullYear() + 1}`,
      alignment: AlignmentType.RIGHT,
      spacing: { after: 400 },
    }),
  ]

  // Create content sections
  const contentParagraphs: Paragraph[] = []

  sections
    .sort((a, b) => a.order - b.order)
    .forEach((section) => {
      // Section heading
      contentParagraphs.push(
        new Paragraph({
          text: section.title,
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        })
      )

      // Section content - split by paragraphs
      const paragraphs = section.content.split('\n\n')
      paragraphs.forEach((para) => {
        if (para.trim()) {
          contentParagraphs.push(
            new Paragraph({
              text: para.trim(),
              spacing: { after: 200 },
              alignment: AlignmentType.JUSTIFIED,
            })
          )
        }
      })
    })

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.98), // 2.5cm
              bottom: convertInchesToTwip(0.98), // 2.5cm
              left: convertInchesToTwip(1.18), // 3cm
              right: convertInchesToTwip(0.79), // 2cm
            },
          },
        },
        children: [...titleParagraphs, ...contentParagraphs],
      },
    ],
    styles: {
      default: {
        document: {
          run: {
            font: 'Times New Roman',
            size: 26, // 13pt
          },
          paragraph: {
            spacing: {
              line: 360, // 1.5 line spacing
            },
          },
        },
        heading1: {
          run: {
            size: 28, // 14pt
            bold: true,
            font: 'Times New Roman',
          },
          paragraph: {
            spacing: {
              before: 400,
              after: 200,
            },
          },
        },
        heading2: {
          run: {
            size: 26, // 13pt
            bold: true,
            font: 'Times New Roman',
          },
          paragraph: {
            spacing: {
              before: 240,
              after: 120,
            },
          },
        },
      },
    },
  })

  // Generate blob
  const blob = await Packer.toBlob(doc)
  return blob
}

export function generateFileName(title: string): string {
  const date = new Date()
  const dateStr = date.toISOString().split('T')[0]
  const safeName = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/gi, '')
    .replace(/\s+/g, '-')
    .substring(0, 50)
  return `SKKN-${safeName}-${dateStr}.docx`
}
