const { Router } = require("express")
const onboarding = require('../use_cases/company/onboarding')
const getAll = require('../use_cases/company/getAll')

const router = new Router()

router.post('/onboarding', async (req, res, next) => {
    await onboarding(req).then(_ => res.status(201).send(0)).catch(e => next(e))
})

router.get('/', async (_, res, next) => {
    await getAll().then(r => res.status(200).json(r)).catch(e => next(e))
})

module.exports = router
