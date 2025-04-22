const { Router } = require("express")
const { 
    register, 
    validation, 
    login, 
    onboarding, 
    getUserByJwt,
    deleteUserByJwt
} = require('../use_cases/user')
// store file url
// store type mime
// store size

const router = new Router()

router.post('/register', async (req, res, next) => {
    try {
        const r = await register(req)
        res.set('Authorization', `Bearer ${r.token}`)
        res.status(201).json(r)
    } catch (e) {
        next(e)
    }
})

router.put('/validation', async (req, res, next) => {
    await validation(req)
        .then(_ => res.status(200).send())
        .catch(e => next(e))
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

router.put('/register', async (req, res, next) => {
    await onboarding(req)
        .then(r => res.status(200).json(r))
        .catch(e => next(e))
})

router.get('/', async (req, res, next) => {
    await getUserByJwt(req)
        .then(r => res.status(200).json(r))
        .catch(e => next(e))
})

router.delete('/', async (req, res, next) => {
    await deleteUserByJwt(req)
        .then(r => res.status(200).send())
        .catch(e => next(e))
})

module.exports = router
