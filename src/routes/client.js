const { Router } = require("express")

const create = require('../use_cases/client/create')
const get = require('../use_cases/client/get')
const getAll = require('../use_cases/client/getAll')
const update = require('../use_cases/client/update')
const remove = require('../use_cases/client/remove')
const getArchived = require('../use_cases/client/getArchived')


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

router.put('/:id', async (req, res, next) => {
    await update(req).then(r => res.status(200).json(r)).catch(e => next(e))
})

router.delete('/:id', async (req, res, next) => {
    await remove(req).then(_ => res.status(200).send()).catch(e => next(e))
})

router.get('/archived', async (req, res, next) => {
    await getArchived(req).then(r => res.status(200).json(r)).catch(e => next(e))
})


module.exports = router
