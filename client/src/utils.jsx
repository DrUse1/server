export function getRandomInt(n) {
    return Math.floor(Math.random() * n)
}

export function getRandomToken() {
    const table = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'
    let token = ''
    for (let i = 0; i < 32; i++) {
        token += table[getRandomInt(table.length)]
    }
    return token
}