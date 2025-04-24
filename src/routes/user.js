const { Router } = require("express")
const multer = require('multer')

const register = require('../use_cases/user/register')
const validate = require('../use_cases/user/validate')
const login = require('../use_cases/user/login')
const onboarding = require('../use_cases/user/onboarding')
const getByJwt = require('../use_cases/user/getByJwt')
const deleteByJwt = require('../use_cases/user/deleteByJwt')
const passwordRecovery = require('../use_cases/user/passwordRecovery')
const passwordReset = require('../use_cases/user/passwordReset')
const pfp = require('../use_cases/user/pfp')

const upload = multer({ 
    dest: __dirname + '../uploads',
    limits: { fileSize: 1048576 } // 1MB
})

const router = new Router()

router.post('/register', async (req, res, next) => {
    try {
        const r = await register(req.body)
        res.set('Authorization', `Bearer ${r.token}`)
        res.status(201).json(r)
    } catch (e) {
        next(e)
    }
})

router.put('/validation', async (req, res, next) => {
    await validate(req).then(_ => res.status(200).send()).catch(e => next(e))
})

router.post('/login', async (req, res, next) => {
    try {
        const result = await login(req)
        res.set('Authorization', `Bearer ${result.token}`)
        res.status(200).json(result)
    } catch (e) {
        next(e)
    }
})

router.patch('/onboarding', async (req, res, next) => {
    await onboarding(req).then(_ => res.status(200).send()).catch(e => next(e))
})

router.get('/', async (req, res, next) => {
    await getByJwt(req).then(r => res.status(200).json(r)).catch(e => next(e))
})

router.delete('/', async (req, res, next) => {
    await deleteByJwt(req).then(_ => res.status(200).send()).catch(e => next(e))
})

router.post('/password_recovery', async (req, res, next) => {
    await passwordRecovery(req).then(r => res.status(200).json(r)).catch(e => next(e))
})

router.put('/password_reset', async (req, res, next) => {
    await passwordReset(req).then(r => res.status(200).json(r)).catch(e => next(e))
})

router.patch('/pfp', upload.single('pfp'), async (req, res, next) => {
    await pfp(req).then(_ => res.status(201).send()).catch(e => next(e))
})

module.exports = router
