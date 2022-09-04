require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_KEY);
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql')
const crypto = require('crypto')
const path = require('path')
const app = express()
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    pool: true,
    host: process.env.MAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

function hashPassword(pwd) {
    return (
        crypto.createHash('sha256')
            .update(pwd)
            .digest('hex')
    )
}

function checkPassword(hash, pwd) {
    return (crypto.createHash('sha256')
        .update(pwd)
        .digest('hex') === hash)
}

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    /*host: 'localhost',
    user: 'root',
    password: 'password',*/
    database: process.env.DB_NAME
})

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

function getRandomInt(n) {
    return Math.floor(Math.random() * n)
}

function getRandomToken() {
    const table = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'
    let token = ''
    for (let i = 0; i < 32; i++) {
        token += table[getRandomInt(table.length)]
    }
    return token
}

function checkToken(token) {
    const sqlSelect = 'SELECT * FROM user_info WHERE token = (?)'
    return new Promise(resolve => {
        db.query(sqlSelect, [token], (err, result) => {
            result = (result === undefined ? [] : result)
            if (result.length > 0) {
                if (result[0].token === token) {
                    resolve(result[0])
                } else {
                    resolve(false)
                }
            } else {
                resolve(false)
            }
        })
    });
}

function sendConfirmationMail(email, confirmToken, url) {
    transporter.sendMail(
        {
            from: "support@qcmed.fr",
            to: email,
            subject: 'Confirmation de mail, QCMed',
            text: `
            Vous venez de créer un compte chez nous !
            Confirmer le en cliquant ${url}/confirm?email=${email}&confirm=${confirmToken}
            `,
            html: `
            Vous venez de créer un compte chez nous !
            Confirmer le en cliquant 
            <a href="${url}/confirm?email=${email}&confirm=${confirmToken}">ICI</a>
            `
        },
        (err, info) => {
            if (info !== null) {
                console.log('sent confirmation mail')
            } else {
                console.log('error sending confirmation mail')
            }
        }
    );
}

function sendForgotMail(email, forgotToken, url) {
    transporter.sendMail(
        {
            from: "support@qcmed.fr",
            to: email,
            subject: 'Mot de passe oublié',
            text: `
            Tu as oublié ton mot de passe malheureusement :(
                Réinitialise le en allant
                ${url}/forgot?email=${email}&forgot=${forgotToken}
            `,
            html: `
            Tu as oublié ton mot de passe malheureusement :(
            Réinitialise le en allant
            <a href="${url}/forgot?email=${email}&forgot=${forgotToken}">ICI</a>
            `
        },
        (err, info) => {
            if (info !== null) {
                console.log('sent forgot mail')
            } else {
                console.log('error sending forgot mail')
            }
        }
    );
}

app.post('/api/contact', async (req, res) => {
    const email = req.body.email
    const object = req.body.object
    const msg = req.body.msg

    transporter.sendMail(
        {
            from: process.env.MAIL_USER,
            to: email + ", " + process.env.MAIL_USER,
            subject: object,
            text: msg,
            html: `${msg}`
        },
        (err, info) => {
            if (info !== null) {
                res.send(true)
            } else {
                res.send(false)
            }
        }
    );
})

app.post('/api/confirm', async (req, res) => {
    const email = req.body.email
    const confirm = req.body.confirm

    const sqlSelect = 'SELECT confirm FROM user_info WHERE email = (?)'
    db.query(sqlSelect, [email], (err, result) => {
        if (result[0]?.confirm === confirm) {
            const sqlUpdate = 'UPDATE user_info SET confirm = (?) WHERE email = (?)'
            db.query(sqlUpdate, ['confirmed', email], (err, result) => {
                if (result !== undefined) {
                    res.send(true)
                } else {
                    res.send(false)
                }
            })
        } else {
            res.send(false)
        }
    })
})

app.post('/api/forgot', async (req, res) => {
    const email = req.body.email
    const url = req.body.url
    const forgot = req.body.forgot
    const password = req.body.password

    const sqlSelect = 'SELECT * FROM user_info WHERE email = (?)'
    db.query(sqlSelect, [email], (err, result) => {
        if (result.length > 0) {
            if (forgot === undefined) {
                const forgotToken = getRandomToken()
                const sqlUpdate = 'UPDATE user_info SET forgot = (?) WHERE email = (?)'
                db.query(sqlUpdate, [forgotToken, email], (err, result) => {
                    sendForgotMail(email, forgotToken, url)
                    res.send(true)
                })
            } else {
                if (result[0].forgot === forgot && result[0].forgot != null) {
                    const sqlUpdate = 'UPDATE user_info SET forgot = (?), password = (?) WHERE email = (?)'
                    db.query(sqlUpdate, [null, hashPassword(password), email], (err, result) => {
                        res.send(true)
                    })
                } else {
                    res.send(false)
                }
            }
        } else {
            res.send(false)
        }
    })
})

app.get('/api/get', (req, res) => {
    const sqlSelect = 'SELECT * FROM user_info'
    db.query(sqlSelect, (err, result) => {
        res.send(result)
    })
})

app.get('/api/verify', (req, res) => {
    const email = req.query.email
    const password = req.query.password

    const sqlSelect = 'SELECT * FROM user_info WHERE email = (?)'
    db.query(sqlSelect, [email], (err, result) => {
        let isMail = result.length > 0
        let isPasswordValid = false
        let token;
        if (isMail) {
            isPasswordValid = checkPassword(result[0].password, password)
        }
        if (isPasswordValid) {
            token = result[0].token
        }
        res.send([isMail, isPasswordValid, token])
    })
})

app.get('/api/check', async (req, res) => {
    const token = req.query.token

    const data = await checkToken(token)
    if (data !== false) {
        const info = {
            email: data.email,
            nom: data.nom,
            prenom: data.prenom,
            phone: data.phone,
            numPlays: data.numPlays,
            plan: data.plan,
            history: data.history === null ? [] : JSON.parse(data.history)
        }
        res.send(info)
    } else {
        res.send(false)
    }
})

app.post('/api/insert', (req, res) => {

    const email = req.body.email
    const password = req.body.password
    const nom = req.body.nom
    const prenom = req.body.prenom
    const phone = req.body.phone
    const token = req.body.token
    const lastPlay = new Date().toISOString("fr-FR", { timeZone: "Europe/Paris" }).slice(0, 10)
    const numPlays = 0
    const plan = 'basic'
    const confirm = getRandomToken()

    const sqlInsert = 'INSERT INTO user_info (email, password, nom, prenom, phone, token, lastPlay, numPlays, plan, confirm) VALUES (?,?,?,?,?,?,?,?,?,?)'
    db.query(sqlInsert, [email, hashPassword(password), nom, prenom, phone, token, lastPlay, numPlays, plan, confirm], (err, result) => {
        if (result !== undefined) {
            console.log('new register')
            sendConfirmationMail(email, confirm, req.body.url)
            res.send(true)
        } else {
            res.send(false)
            console.log(err)
        }
    })
})

app.post('/api/update', (req, res) => {

    const prev_token = req.body.prev_token
    const token = req.body.token

    const sqlInsert = 'UPDATE user_info SET token = (?) WHERE token = (?)'
    db.query(sqlInsert, [token, prev_token], (err, result) => {
        if (result !== undefined) {
            res.send(true)
        } else {
            res.send(false)
        }
    })
})

app.post('/api/history', async (req, res) => {

    const token = req.body.token
    const toAdd = req.body.toAdd

    const data = await checkToken(token)
    if (data !== false) {
        const sqlSelect = 'SELECT history FROM user_info WHERE token = (?)'
        db.query(sqlSelect, [token], (err, result) => {
            if (result !== undefined) {
                history = result[0].history === null ? [] : JSON.parse(result[0].history)
                if (toAdd === '') {
                    res.send(history)
                } else {
                    history = JSON.stringify([toAdd, ...history])
                    const sqlUpdate = 'UPDATE user_info SET history = (?) WHERE token = (?)'
                    db.query(sqlUpdate, [history, token], (err2, result2) => {
                        if (result2 !== undefined) {
                            res.send(history)
                        } else {
                            console.log(err2)
                            res.send(false)
                        }
                    })

                }
            } else {
                console.log(err)
                res.send(false)
            }
        })
    } else {
        res.send(false)
    }
})

app.post('/api/updateData', async (req, res) => {

    const token = req.body.token
    const prenom = req.body.prenom
    const nom = req.body.nom
    const phone = req.body.phone

    const data = await checkToken(token)
    if (data !== false) {
        const sqlUpdate = 'UPDATE user_info SET prenom = (?), nom = (?), phone = (?) WHERE token = (?)'
        db.query(sqlUpdate, [prenom, nom, phone, token], (err2, result2) => {
            if (result2 !== undefined) {
                res.send(true)
            } else {
                console.log(err2)
                res.send(false)
            }
        })
    } else {
        res.send(false)
    }
})

app.post('/api/updatePassword', async (req, res) => {

    const token = req.body.token
    const oldPass = req.body.old
    const newPass = req.body.new

    const data = await checkToken(token)
    if (data !== false) {
        if (checkPassword(data.password, oldPass)) {
            const sqlUpdate = 'UPDATE user_info SET password = (?) WHERE token = (?)'
            db.query(sqlUpdate, [hashPassword(newPass), token], (err2, result2) => {
                if (result2 !== undefined) {
                    console.log('password changed')
                    res.send([true])
                } else {
                    console.log(err2)
                    res.send([false])
                }
            })
        } else {
            res.send([false, 'password'])
        }
    } else {
        res.send([false, 'token'])
    }
})

app.post('/api/updateplays', async (req, res) => {

    const token = req.body.token
    const setup = req.body.setup

    const data = await checkToken(token)
    if (data !== false) {
        const todayDate = new Date().toISOString("fr-FR", { timeZone: "Europe/Paris" }).slice(0, 10)
        let numPlays = data.numPlays
        if (data.lastPlay != todayDate) {
            numPlays = 1
            if (setup) {
                numPlays = 0
            }
        } else {
            if (!setup) {
                numPlays++
            }
        }
        const sqlUpdate = 'UPDATE user_info SET lastPlay = (?), numPlays = (?) WHERE token = (?)'
        db.query(sqlUpdate, [todayDate, numPlays, token], (err2, result2) => {
            if (result2 !== undefined) {
                res.send(numPlays.toString())
            } else {
                console.log(err2)
                res.send(false)
            }
        })
    } else {
        res.send(false)
    }
})

app.post('/api/clear', (req, res) => {

    const sqlClear = 'DELETE FROM user_info WHERE id >= 0'
    const sqlReset = 'ALTER TABLE user_info AUTO_INCREMENT = 1'
    db.query(sqlClear, (err, result) => {
        if (result !== undefined) {
            db.query(sqlReset, (errReset, resultReset) => {
                if (resultReset !== undefined) {
                    res.send('good clear/reset')
                } else {
                    console.log('reset error ', errReset)
                }
            })
        } else {
            console.log('clear error ', err)
        }
    })
})

app.post('/api/stripe_data', async (req, res) => {
    function inverseDate(date) {
        return (date.slice(9 - 11) + date.slice(4, 8) + date.slice(0, 4))
    }

    const token = req.body.token

    const data = await checkToken(token)
    if (data !== false) {
        getCustomer()
        async function getCustomer() {
            const temp_customer = await stripe.customers.search({
                query: 'email:"' + data.email + '"'
            });

            let _data = {
                startDate: '',
                endDate: '',
                cancelWhenEnd: '',
                subId: '',
                cusId: ''
            }

            const customer = temp_customer.data[0]
            if (customer != undefined) {
                const customerId = customer?.id
                const search = await stripe.subscriptions.list({ customer: customerId });
                const subId = search.data[0]?.id
                const preEndDate = new Date(search.data[0]?.current_period_end * 1000).toISOString("fr-FR", { timeZone: "Europe/Paris" }).slice(0, 10)
                _data = {
                    startDate: inverseDate(new Date(search.data[0]?.current_period_start * 1000).toISOString("fr-FR", { timeZone: "Europe/Paris" }).slice(0, 10)),
                    endDate: inverseDate(preEndDate),
                    cancelWhenEnd: search.data[0]?.cancel_at_period_end,
                    subId: subId,
                    cusId: customerId
                }
                const sqlUpdate = 'UPDATE user_info SET endDate = (?) WHERE token = (?)'
                db.query(sqlUpdate, [preEndDate, token], (err, result) => {
                    if (result !== undefined) {
                        res.send(_data)
                        return
                    } else {
                        res.send(false)
                        return
                    }
                })
                return
            } else {
                res.send(_data)
            }
        }
    } else {
        res.send(false)
    }
})

app.post('/api/stripe_cancel', (req, res) => {
    const subId = req.body.subId
    const choice = req.body.choice

    getCustomer()
    async function getCustomer() {
        try {
            const sub = await stripe.subscriptions.update(
                subId,
                { cancel_at_period_end: choice });
            res.send(sub)
        } catch (error) {
            console.log('error', error.message)
            res.send(false)
        }
    }
})

app.post('/api/verify_plan', async (req, res) => {
    const token = req.body.token

    const data = await checkToken(token)
    if (data !== false) {
        getCustomer()
        async function getCustomer() {
            const customer = await stripe.customers.search({
                query: 'email:"' + data.email + '"'
            });
            if (customer.data.length != 0) {
                const sqlVerify = 'SELECT endDate FROM user_info WHERE token = (?)'
                db.query(sqlVerify, [token], (err, result) => {
                    if (result !== undefined) {
                        let plan;
                        if (new Date() < new Date(data.endDate)) {
                            plan = 'premium'
                        } else {
                            plan = 'basic'
                        }
                        const sqlUpdate = 'UPDATE user_info SET plan = (?) WHERE token = (?)';
                        db.query(sqlUpdate, [plan, token], (err, result2) => {
                            if (result2 !== undefined) {
                                res.send(plan)
                            } else {
                                res.send(false)
                            }
                        })
                    } else {
                        res.send(false)
                    }
                })
            } else {
                const sqlUpdate = 'UPDATE user_info SET plan = (?) WHERE token = (?)';
                db.query(sqlUpdate, ['basic', token], (err, result) => {
                    if (result !== undefined) {
                        res.send('basic')
                    } else {
                        res.send(false)
                    }
                })
            }
        }
    } else {
        res.send(false)
    }
})

app.post('/create-checkout-session', async (req, res) => {
    const email = req.body.email
    const url = req.body.url
    const prices = await stripe.prices.list({
        lookup_keys: [req.body.lookup_key],
        expand: ['data.product'],
    });
    const session = await stripe.checkout.sessions.create({
        billing_address_collection: 'auto',
        customer_email: email,
        line_items: [
            {
                price: prices.data[0].id,
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: `${url}/success?success=true`,
        cancel_url: `${url}/success?success=false`,
    });
    res.send(session.url)
});

app.use(express.static(path.join(__dirname, 'client/dist')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

app.listen(8080, () => {
    console.log('Running on port 8080')
})