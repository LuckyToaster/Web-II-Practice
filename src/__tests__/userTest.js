const DB = require('../infra/db')

const dropTables = async (db) => {
    await db.query('drop table if exists deliveryNote')
    await db.query('drop table if exists project')
    await db.query('drop table if exists client')
    await db.query('drop table if exists user') 
    await db.query('drop table if exists company')
}

// test('Drop tables before testing', async () => {
//     await expect(dropTables(DB)).resolves.not.toThrow()
// })

const register = require('../use_cases/user/register')
const validate = require('../use_cases/user/validate')
const login = require('../use_cases/user/login')
const onboarding = require('../use_cases/user/onboarding')
const getByJwt = require('../use_cases/user/getByJwt')
const deleteByJwt = require('../use_cases/user/deleteByJwt')
const passwordRecovery = require('../use_cases/user/passwordRecovery')
const passwordReset = require('../use_cases/user/passwordReset')
const pfp = require('../use_cases/user/pfp')
const metrics = require('../use_cases/user/metrics')





let body = {
    email: "test@mail.com",
    password: "password123"
}


test('Register + validate a user', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

    const registerRes = await register(body)
    const logCall = logSpy.mock.calls.find(call => call[0].includes('Your validation code'))
    const code = logCall[0].match(/\d{6}/)[0]

    expect(registerRes).toEqual(expect.objectContaining({
        user: expect.objectContaining({
            email: "test@mail.com",
            status: "unvalidated",
            role: "user",
        }),
        token: expect.any(String),
    }))

    const validateReq = { 
        get: (header) => {
            if (header.toLowerCase() === 'authorization') {
                return `Bearer ${registerRes.token}`
            }
            return undefined
        },
        body: { code },
        headers: { authorization: `Bearer ${registerRes.token}` }
    } 

    await expect(validate(validateReq)).resolves.not.toThrow()
})


let token = null


test('Login the registered + validated user', async () => {
    const loginRes = await login({ body })
    token = loginRes.token

    expect(loginRes).toEqual(expect.objectContaining({
        token: expect.any(String),
        user: expect.anything(), // just check user exists here
    }))

    expect(loginRes.user).toMatchObject({
        id: expect.any(Number),
        email: "test@mail.com",
        name: null,
        surname: null,
        nif: null,
        companyId: null,
        role: "user",
        status: "validated",
        deleted: null,
        pfpUrl: null,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
    })
})


test('Get user by JWT', async () => {
    const getByJwtReq = { 
        get: (header) => {
            if (header.toLowerCase() === 'authorization') {
                return `Bearer ${token}`
            }
            return undefined
        },
        headers: { authorization: `Bearer ${token}` },
        body
    } 

    await expect(getByJwt(getByJwtReq)).resolves.not.toThrow()
})

