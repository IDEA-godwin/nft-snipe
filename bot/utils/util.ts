

export const validatePasswordStrenght = (password: string): any => {
    return password.match('^[a-zA-Z0-9]{7,}$')
}