const fs = require('fs')
const { FSPdfManager } = require('./FSPdfManager')

async function parseXrefTable(path, size, checkDeadline) {
  if (size === 0) {
    return []
  }

  const file = await fs.promises.open(path)
  try {
    const manager = new FSPdfManager(0, { fh: file, size, checkDeadline })

    await manager.ensureDoc('checkHeader')
    checkDeadline('pdfjs: after checkHeader')
    await manager.ensureDoc('parseStartXRef')
    checkDeadline('pdfjs: after parseStartXRef')
    await manager.ensureDoc('parse')
    checkDeadline('pdfjs: after parse')
    const xRefEntries = manager.pdfDocument.xref.entries || []
    const startXRefTable = manager.pdfDocument.xref.topDict?.get('Prev')
    return { xRefEntries, startXRefTable }
  } finally {
    file.close()
  }
}

module.exports = {
  parseXrefTable,
}
