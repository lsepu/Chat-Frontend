const HEADERS = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
}

export const getUserByEmail = async(email) => {
    const response = await fetch(`https://localhost:8080/getbyemail/${email}`)
    const data = await response.json()
    return data
}