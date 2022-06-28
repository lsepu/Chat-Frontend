const HEADERS = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
}

export type userType = {
    //Usuario
    id?: string,
    userName: string,
    email: string,
    contacts: string[],
    isLogged: boolean,
    ipAddress: string
}


export const getUserByEmail = async(email: string) => {
    const response = await fetch(`https://realtime-chat-app-sofkau.herokuapp.com/user/userEmail/${email}`, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        }})
    const data = await response.json();
    // if (data.status === 500){

    // }
    return data
}

export const postNewUser = async(newUser:userType) => {
    const response = await fetch(`https://realtime-chat-app-sofkau.herokuapp.com/user`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(newUser),
      })
      return (await response.json()) as userType
}