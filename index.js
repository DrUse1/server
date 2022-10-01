require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_KEY_LIVE);
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
            from: {
                name: 'Support QCMED',
                address: process.env.MAIL_USER
            },
            to: email + ", " + process.env.MAIL_USER,
            subject: 'Demande transmise - QCMED',
            text: msg,
            html: `<html>
            <style>
                .wrapper{
                    display: flex;
                    flex-direction: column;
                    max-width: 400px;
                }
        
                h3 {
                    text-align: center;
                }
        
                .mailContent {
                    background-color: #f2f2f2;
                    border: 2px solid gray;
                    border-radius: 5px;
                }
        
                p {
                    margin: 4px;
                } 
            </style>
            <body>
                <div class="wrapper">
                    <h3>Nous avons bien transmis votre demande.</h3>
                    <div class="desc">
                        Voici les détails : <br><br>
        
                        Objet : ${object} <br>
                        Contenu du message :
                    </div>
                    <div class="mailContent">
                        <p>${msg}</p>
                    </div>
                </div>
            </body>
        </html>`
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
                    res.send('1')
                } else {
                    res.send('0')
                }
            })
        } else {
            if (result[0]?.confirm === 'confirmed') {
                res.send('2')
            } else {
                res.send('0')
            }
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

app.get('/api/verify', (req, res) => {
    const email = req.query.email
    const password = req.query.password

    const sqlSelect = 'SELECT * FROM user_info WHERE email = (?)'
    db.query(sqlSelect, [email], (err, result) => {
        if (err) { throw err }
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
            history: data.history === null ? [] : JSON.parse(data.history),
            token: token
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
            transporter.sendMail(
                {
                    from: {
                        name: 'Support QCMED',
                        address: process.env.MAIL_USER
                    },
                    to: "mohamed.mataam1@gmail.com, " + process.env.MAIL_USER,
                    subject: 'Nouvel enregistrement ! ' + email,
                    text: 'email: ' + email,
                },
                (err, info) => {
                    if (info !== null) {
                        res.send(true)
                    } else {
                        res.send(false)
                    }
                }
            );
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
                cusId: '',
                plan: 'basic'
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
                let plan;
                if (new Date() < new Date(preEndDate)) {
                    plan = 'premium'
                } else {
                    plan = 'basic'
                }
                _data.plan = plan
                const sqlUpdate = 'UPDATE user_info SET endDate = (?), plan = (?) WHERE token = (?)'
                db.query(sqlUpdate, [preEndDate, plan, token], (err, result) => {
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

app.post('/create-checkout-session', async (req, res) => {
    const token = req.body.token
    const url = req.body.url

    const data = await checkToken(token)
    if (data !== false) {
        if (data.confirm === 'confirmed') {
            const session = await stripe.checkout.sessions.create({
                billing_address_collection: 'auto',
                customer_email: data.email,
                line_items: [
                    {
                        price: 'price_1Lks0yGQzL6BRbH2JhcwCYBT',
                        quantity: 1,
                    },
                ],
                allow_promotion_codes: true,
                mode: 'subscription',
                success_url: `${url}/success?success=true`,
                cancel_url: `${url}/success?success=false`,
            });
            res.send(session.url)
        } else {
            const confirm = getRandomToken()
            sendConfirmationMail(data.email, confirm, req.body.url)
            const sqlUpdate = 'UPDATE user_info SET confirm = (?) where token = (?)'
            db.query(sqlUpdate, [confirm, token], (err, result) => {
                res.send('confirm')
            })
        }
    }
})

app.use(express.static(path.join(__dirname, 'client/dist')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

app.listen(8080, () => {
    console.log('Running on port 8080')
})

//const sqlClear = 'DELETE FROM user_info WHERE id >= 0'
//const sqlReset = 'ALTER TABLE user_info AUTO_INCREMENT = 1'
