let character = 'abcdefghijklmnopqrstuvwxyz'
character += character.toUpperCase() + '1234567890'

function randomOne(){
  const index = Math.floor(Math.random() * character.length)
  return character.charAt(index)
}

function shortCode(){
  let randomCode = ''
  for(let i = 0; i < 5; i++){
    randomCode += randomOne()
  }
  return randomCode
}


module.exports = shortCode