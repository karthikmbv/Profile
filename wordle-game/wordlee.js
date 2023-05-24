'use strict'


const box = document.querySelector('.container__box')
const keyboard = document.querySelector('.wordlee__keyboard')
const panel = document.querySelector('.wordlee__panel')
const info = document.querySelector('.wordlee__info')


// HTML
let panelFragment = document.createDocumentFragment()

for (let n=0 ; n<5 ; n++){
    let row = document.createElement('ul')
    row.classList.add('panel__row')
    panelFragment.appendChild(row)
    for ( let x=0 ; x<5 ; x++){
        let tile = document.createElement('li')
        tile.classList.add('row__tile')
        row.appendChild(tile);
        (n===0 && x===0) && tile.classList.add('selected')
    }
}

panel.appendChild(panelFragment)

const tiles = document.querySelectorAll('.row__tile')
const rows = document.querySelectorAll('.panel__row')

let keyboardFragment = document.createDocumentFragment()

let keyboardLetters = [
    'Q','W','E','R','T','Y','U','I','O','P',
    'A','S','D','F','G','H','J','K','L','Ñ', 
    'ENTER','Z','X','C','V','B','N','M', '<'
]

for ( let x=0; x<keyboardLetters.length ; x++){
    let key = document.createElement('button')
    key.classList.add('keyboard__key')
    key.innerHTML = keyboardLetters[x]
    keyboardFragment.appendChild(key)
}

keyboard.appendChild(keyboardFragment)

const keys = document.querySelectorAll('.keyboard__key')

keys[20].classList.add('key__enter')
keys[28].classList.add('key__back')

const enterKey = document.querySelector('.key__enter')

// Variables
let solutionString 
let solution 
let solutionLength = 5

let solutionsMatrix = [ 'piano', 'amigo', 'huevo', 'libro', 'ruido', 'llave', 'salir', 'claro', 'verde', 'pluma']
let randomNumber = Math.floor(Math.random()*solutionsMatrix.length)

let wordAttemts = [
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
]

let currentAttempt = 0
let currentPosition = 0
let newLetter, keyText
let letters = 'abcdefghijklmnñopqrstuvwxyz'
let alphabet = letters.split('')
let finish


// Functions
let assignDefaultValues = () => {
    wordAttemts = [
        ['','','','',''],   
        ['','','','',''],   
        ['','','','',''],   
        ['','','','',''],   
        ['','','','',''],   
    ]
    currentPosition = 0
    currentAttempt = 0
    newLetter = ''
    finish = false
    keyText = ''
    activeTiles()
}

let activeTiles = () => {
    tiles.forEach ( ( eachTile, i ) => {
        eachTile.classList.add('inactive')
        if ( i > ((currentAttempt * 5) - 1) && i < ((currentAttempt * 5) + solutionLength ) ){
            eachTile.classList.remove('inactive')
        }
    })
}

let selectTileManually = () => {
    tiles.forEach ( (eachTile, i) => {
        eachTile.addEventListener('click', () => {
            currentAttempt = Math.floor(i/5)
            currentPosition = i%5
            tiles.forEach ( ( eachTile, i) => {
                eachTile.classList.remove('selected')
            })
            eachTile.classList.add('selected')
        })
    })
}

let markUsedKeys = (i) => {
    keys.forEach ( (eachKey, k) => {
        if( eachKey.innerHTML.toLowerCase() === wordAttemts[currentAttempt][i] ){
            eachKey.classList.add('used')
        }
    })
}

let markUsedTiles = (i) => {
    tiles.forEach ( (eachTile, t) => {
        if ( t >= currentAttempt * 5 && t < (currentAttempt * 5) + solutionLength ){
            eachTile.classList.add('used')
        }
    })
}


let almostCorrectLetters = (i) => {
    if (wordAttemts[currentAttempt].includes(solution[i])){
        for ( let j=0 ; j<solutionLength ; j++ ){
            if( wordAttemts[currentAttempt][j] === solution[i] ){
                tiles[j + currentAttempt * solutionLength].classList.add('almost')

                keyboardLetters.forEach( (eachKey, k) => {
                    ( eachKey.toLowerCase() === solution[i] && keys[k].classList.add('almost'))    
                })
            } 
        }
    }  
}

let correctLetters = (i) => {
    if ( wordAttemts[currentAttempt][i] === solution[i] ) {
        tiles[i + currentAttempt * solutionLength].classList.add('correct') 
        
        keyboardLetters.forEach( (eachKey, k) => {
            ( eachKey.toLowerCase() === solution[i] && keys[k].classList.add('correct'))    
        })
    } 
}


let checkLettersIndiv = () => {
    if (!finish){
        for ( let i=0 ; i<solutionLength ; i++ ){
            markUsedTiles()
            markUsedKeys(i)
            almostCorrectLetters(i)
            correctLetters(i)
        }
    } 
}

let checkCorrect = () => {
    if ( solutionString === wordAttemts[currentAttempt].join('') ){
        finish = true
        info.innerHTML = 'Enhorabuena! Has averiguado la palabra'
        console.log('Enhorabuena! Has averiguado la palabra')
        keys.forEach (( eachKey, i) => {
            eachKey.classList.add('inactive')
        })
    }
}

let checkWord = () => {
    console.log('Enter')
    console.log(wordAttemts[currentAttempt])
    checkLettersIndiv()
    checkCorrect()
}

let jumpLine = () => {
    if (finish === false ){
        currentAttempt++
        currentPosition = 0
    }
    tiles.forEach ( eachTile => eachTile.classList.remove('selected'))
    tiles[currentAttempt * solutionLength].classList.add('selected')
}

let lastAttempt = () => {
    tiles.forEach ( eachTile => eachTile.classList.remove('selected'))
    finish = true
    keys.forEach (( eachKey, i) => {
        eachKey.classList.add('inactive')
    })
    console.log('End of attempts')
    if ( solutionString !== wordAttemts[currentAttempt].join('') ){
        info.innerHTML = `Lo sentimos. La palabbra era ${solutionString}`
        tiles.forEach ( (eachTile, i) => {
            eachTile.classList.add('inactive')
        })
    }
}

let moveSelectorInRow = () => {
    if ( currentPosition < solutionLength - 1 && finish === false){
        tiles.forEach ( eachTile => eachTile.classList.remove('selected'))
        tiles[(currentPosition + 5*(currentAttempt))+1].classList.add('selected')
    } else if ( currentPosition === solutionLength - 1 && finish === false){
        tiles.forEach ( eachTile => eachTile.classList.remove('selected'))
    }
}

let assignLetterToMatrix = (key) => {
    if ( currentPosition < solutionLength && finish === false ){
        console.log(key)
        newLetter=key
        wordAttemts[currentAttempt][currentPosition]=newLetter
        currentPosition++
    } 
}

let assignLetterToPanel = () => {
    if (currentPosition <= solutionLength && finish === false){
        tiles[(currentPosition + 5*(currentAttempt))-1].innerHTML = newLetter.toUpperCase()
    }   
}

let goBack = () => {
    if (currentPosition > 0 && finish === false ){
        wordAttemts[currentAttempt][currentPosition-1] = ''
        tiles[(currentPosition + 5*(currentAttempt))-1].innerHTML = ''
        currentPosition = currentPosition - 1
        tiles.forEach ( eachTile => eachTile.classList.remove('selected'))
        tiles[(currentPosition + 5*(currentAttempt))].classList.add('selected')
    }
    
}

let assignValues = (key) => {

    let attemptLength = wordAttemts[currentAttempt].join('').length

    if ( key === 'Enter' && attemptLength === solutionLength && finish === false){
        if (currentAttempt < ( wordAttemts.length -1 ) ) {
            checkWord()
            jumpLine()
            activeTiles()
        } else if ( currentAttempt === ( wordAttemts.length - 1 ) ){
            checkWord()
            lastAttempt()
        }
    } else if ( key === 'Backspace') {
        goBack()
    } else {
        for (let i in alphabet){
            if ( key === alphabet[i] && finish === false){
                moveSelectorInRow()
                assignLetterToMatrix(key)
                assignLetterToPanel() 
            }
        }
    }
}



let clickOnKey = () => {
    keys.forEach ( (eachKey, i) => {
        eachKey.addEventListener ('click', () => {
            if (eachKey.innerHTML === 'ENTER'){
                keyText = 'Enter'
            } else if ( eachKey.innerHTML === '&lt;') {
                keyText = 'Backspace'
            } else {
                keyText = eachKey.innerHTML.toLowerCase()
            }   
            assignValues(keyText)
        })
    })
}

let pressKey = () => {
    document.addEventListener ('keyup', ({key}) => {
        assignValues(key)
    }) 
}

let typing = () => {
    if (finish === false && currentAttempt<solutionLength ){
        pressKey()
        clickOnKey()
    } 
}

let startGame = () => {
    assignDefaultValues()
    typing()
}

let generateNewGame = () => {
    solutionString = solutionsMatrix[randomNumber]
    solution = solutionString.split('')
    solutionLength = solution.length
    startGame()
}

generateNewGame()
activeTiles()
selectTileManually()





































