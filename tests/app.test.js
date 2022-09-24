const request = require('supertest');

const app = require('../app.js');



describe("POST /login", () => {
    describe('given a email and password', () => {
        test("should response a 200 status code", async () => {
            const response = await request(app).post('/login').send({
                email: 'abc@gmail.com',
                password: 'abc12345'
            })
            expect(response.statusCode).toBe(200)
        })

    })

    describe('When email or password is missing', () => {
        test('Should return status 400 if password or email missing', async () => {
            const response = await request(app).post('/login').send({
                // email: 'abc@gmail.com',
                password: 'abc12345'
            })
            expect(response.statusCode).toBe(400)
        })
    })
})

let accessToken = ''
beforeAll(async () => {
    const response = await request(app).post('/login').send({
        email: 'abc@gmail.com',
        password: 'abc12345'
    })
    accessToken = response.body.accessToken;
});

describe("POST /trade", () => {

    describe('Given all data', () => {
        let payload = {
            "type": "buy",
            "user_id": 23,
            "symbol": "ABX",
            "shares": 30,
            "price": 134,
            "timestamp": 1531522701000
        }
        test('Should return a json object with statuscode 201 ', async () => {
            const response = await request(app).post('/trade').send(payload)
                .set('authorization', `Bearer ${accessToken}`);

            expect(response.statusCode).toBe(201)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
            expect(payload)
            expect(response.body.id).toBeDefined()
        })

    })

    describe('Faulty data', () => {
        test('user_id missing Should return  statuscode 400 ', async () => {
            const response = await request(app).post('/trade').send(
                {
                    "type": "buy",
                    "symbol": "ABX",
                    "shares": 30,
                    "price": 134,
                    "timestamp": 1531522701000
                }
            )
                .set('authorization', `Bearer ${accessToken}`);
            expect(response.statusCode).toBe(400)
        })
        test(' shares value exeeds 100 should return  statuscode 400 ', async () => {
            const response = await request(app).post('/trade').send(
                {
                    "user_id": 23,
                    "type": "buy",
                    "symbol": "ABX",
                    "shares": 500,
                    "price": 134,
                    "timestamp": 1531522701000
                }
            )
                .set('authorization', `Bearer ${accessToken}`);
            expect(response.statusCode).toBe(400)
        })

        test(' type  value mismatch should return  statuscode 400 ', async () => {
            const response = await request(app).post('/trade').send(
                {
                    "user_id": 23,
                    "type": "abc",
                    "symbol": "ABX",
                    "shares": 10,
                    "price": 134,
                    "timestamp": 1531522701000
                }
            )
                .set('authorization', `Bearer ${accessToken}`);
            expect(response.statusCode).toBe(400)
        })
    })

})

describe("GET /trade", () => {
    let payload = {
        "type": "buy",
        "user_id": 23,
        "symbol": "ABX",
        "shares": 30,
        "price": 134,
        "timestamp": 1531522701000
    }
    describe('when no parameter', () => {
        test('Should return statusCode 200 ', async () => {
            const response = await request(app).get('/trade')
                .set('authorization', `Bearer ${accessToken}`);
            expect(response.statusCode).toBe(200)
            // expect(response.body).toEqual(expect.arrayContaining(payload))
        })
    })
    describe('when parameters type and user_id', () => {
        test('Should return statusCode 200 ', async () => {
            const response = await request(app)
                .get('/trade')
                .send({ type: 'buy', user_id: 23 })
                .set('authorization', `Bearer ${accessToken}`);
            expect(response.statusCode).toBe(200)

        })
    })
    describe('when id passed', () => {

        test('Should return a json object with statuscode 200 ', async () => {
            const response = await request(app).get('/trade/1')
                .set('authorization', `Bearer ${accessToken}`);

            expect(response.statusCode).toBe(200)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
            expect(payload)
        })
    })

})


describe('PUT/DELETE/PATCH trade/:id', () => {
    describe('on PUT', () => {
        test('Should return statusCode 405 ', async () => {
            const response = await request(app)
                .put('/trade/3')
                .set('authorization', `Bearer ${accessToken}`);
            expect(response.statusCode).toBe(405)

        })
    })
    describe('on DELETE', () => {
        test('Should return statusCode 405 ', async () => {
            const response = await request(app)
                .delete('/trade/3')
                .set('authorization', `Bearer ${accessToken}`);
            expect(response.statusCode).toBe(405)

        })
    })
    describe('on PATCH', () => {
        test('Should return statusCode 405 ', async () => {
            const response = await request(app)
                .patch('/trade/3')
                .set('authorization', `Bearer ${accessToken}`);
            expect(response.statusCode).toBe(405)

        })
    })
})

