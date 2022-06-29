const getAllChannels = async ()=>{
    const response = await fetch(`https://realtime-chat-app-sofkau.herokuapp.com/channel`)
    const data = await response.json()
    return data
}
  
const postChannel = async (
    nameChannel: string,
    descriptionChannel: string) => {

  const response = await fetch(`https://realtime-chat-app-sofkau.herokuapp.com/channel`,
  {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
        nameChannel,
        descriptionChannel,
    })
  })
  const data = await response.json();
  return data
}

const removeChannel = async (idChannel: string) => {
    const response = await fetch(`https://realtime-chat-app-sofkau.herokuapp.com/channel/${idChannel}`,
    {
        method:'DELETE'
    })
    return response.ok
}

export {getAllChannels, postChannel, removeChannel}