const { Router } = require("express")
const multer = require('multer')

const create = require('../use_cases/deliveryNote/create')
const get = require('../use_cases/deliveryNote/get')
const getAll = require('../use_cases/deliveryNote/getAll')
const remove = require('../use_cases/deliveryNote/remove')
const pdf = require('../use_cases/deliveryNote/pdf')
const sign = require('../use_cases/deliveryNote/sign')
const { SIGNATURES_PATH } = require('../infra/constants')

const upload = multer({ 
    dest: SIGNATURES_PATH,
    limits: { fileSize: 1048576 } // 1MB
})

const router = new Router()

router.post('/', async (req, res, next) => {
    await create(req).then(r => res.status(201).json(r)).catch(e => next(e))
})

router.get('/', async (req, res, next) => {
    await getAll(req).then(r => res.status(200).json(r)).catch(e => next(e))
})

router.get('/:id', async (req, res, next) => {
    await get(req).then(r => res.status(200).json(r)).catch(e => next(e))
})

router.delete('/:id', async (req, res, next) => {
    await remove(req).then(_ => res.status(200).send()).catch(e => next(e))
})


router.patch('/sign/:id', upload.single('signature'), async (req, res, next) => {
    const mimes = [ 'image/jpeg', 'image/png', 'image/webp' ]
    if (!mimes.includes(req.file.mimetype)) 
        res.status(415).send(`${req.file.mimetype} not supported (please give of ${mimes}`)

    await sign(req).then(_ => res.status(200).send()).catch(e => next(e))    
})


router.get('/pdf/:id', async (req, res, next) => {
    try {
        const pdfBuffer = await pdf(req)
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=deliveryNote.pdf')
        res.send(pdfBuffer)
    } catch (e) {
        next(e)
    }
})


module.exports = router
