const fs = require("fs");
const PDFDocument = require("pdfkit");

const generateFooter = (doc) => doc.fontSize(10).text("Delivery Note Invoice Generated with PDFKit", 50, 780, { align: "center", width: 500 })
const generateHr = (doc, y) => doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke()
const generateHeader = (doc) => doc.fontSize(20).text("Delivery Note", { align: 'center' }).fontSize(10).text(new Date().toString().split(' GMT')[0], { align: 'center' }).moveDown()
const addSignature = (doc, obj) => doc.moveDown().image(obj.signature, (doc.page.width - 100) / 2, doc.y, { width: 100, align: 'center' })


function generatePDF(obj, path) {
    let doc = new PDFDocument({ size: "A4", margin: 50 })
    doc.lineGap(5)
    generateHeader(doc)
    generateUserInfo(doc, obj)
    generateClientInfo(doc, obj)
    generateProjectInfo(doc, obj)
    generateDeliveryNoteInfo(doc, obj)

    console.log(fs.existsSync(obj.signature));
    if (obj.signature) addSignature(doc, obj)

    generateFooter(doc)
    doc.end()
    doc.pipe(fs.createWriteStream(path))
}


function generateUserInfo(doc, obj) {
    doc
        .fillColor('#444444')
        .fontSize(16)
        .text("User", { align: 'center' })
    generateHr(doc, doc.y)
    doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Name: ', 50, doc.y + 10, { continued: true })
        .font('Helvetica')
        .text(`${obj.user.name} ${obj.user.surname}, `, { continued: false })
        .font('Helvetica-Bold')
        .text('Email: ', { continued: true })
        .font('Helvetica')
        .text(`${obj.user.email}, `, { continued: false })
        .font('Helvetica-Bold')
        .text('NIF: ', { continued: true })
        .font('Helvetica')
        .text(`${obj.user.nif}`, { continued: false })
    generateHr(doc, doc.y)
}


function generateClientInfo(doc, obj) {
    doc
        .moveDown()
        .fillColor('#444444')
        .fontSize(16)
        .text("Client", { align: 'center' })
    generateHr(doc, doc.y)
    doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Name: ', 50, doc.y + 10, { continued: true })
        .font('Helvetica')
        .text(`${obj.client.name}`, { continued: false, align: 'right' })
        .font('Helvetica-Bold')
        .text('NIF: ', { continued: true })
        .font('Helvetica')
        .text(`${obj.user.nif}`, { continued: false, align: 'right' })
        .font('Helvetica-Bold')
        .text(`Address: `, { continued: true })
        .font('Helvetica')
        .text(`${obj.client.address}, ${obj.client.city}, ${obj.client.postalCode}, ${obj.client.province}`, { continued: false, align: 'right' })
    generateHr(doc, doc.y) 
}


function generateProjectInfo(doc, obj) {
    doc
        .moveDown()
        .fillColor('#444444')
        .fontSize(16)
        .text("Project", { align: 'center' })
    generateHr(doc, doc.y)
    doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Name: ', 50, doc.y + 10, { continued: true })
        .font('Helvetica')
        .text(`${obj.project.name}`, { continued: false, align: 'right' })
        .font('Helvetica-Bold')
        .text('Notes:', { continued: true })
        .font('Helvetica')
        .text(`${obj.project.notes}`, { continued: false, align: 'right' })
        .font('Helvetica-Bold')
        .text('Duration:', { continued: true })
        .font('Helvetica')
        .text(`${obj.project.begin} - ${obj.project.end}`, { continued: false, align: 'right' })
        .font('Helvetica-Bold')
        .text(`Address: `, { continued: true })
        .font('Helvetica')
        .text(`${obj.project.address}, ${obj.project.city}, ${obj.project.postalCode}, ${obj.project.province}`, { continued: false, align: 'right' })
    generateHr(doc, doc.y)
}


function generateDeliveryNoteInfo(doc, obj) {
    doc
        .moveDown()
        .fillColor('#444444')
        .fontSize(16)
        .text("Delivery Note", { align: 'center' })
    generateHr(doc, doc.y)
    doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Description: ', 50, doc.y + 10, { continued: true })
        .font('Helvetica')
        .text(`${obj.deliveryNote.description}`, { continued: false, align: 'right' })

        .font('Helvetica-Bold')
        .text('Units: ', { continued: true })
        .font('Helvetica')
        .text(`${obj.deliveryNote.units} ${obj.deliveryNote.format}`, { continued: false, align: 'right' })

        .font('Helvetica-Bold')
        .text('Pending: ', { continued: true })
        .font('Helvetica')
        .text(obj.deliveryNote.pending, { continued: false, align: 'right' })
    generateHr(doc, doc.y)
}


module.exports = generatePDF
