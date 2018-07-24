const { BIG5 } = require('../assets/BIG5CodeToChar.js')
const { specialCode, availableColor, availableBackground, availableBright, availableInit, availableColorCode, defaultColorInfo } = require('../assets/specialCode.js')

const isBreakLine = (buffer, index) => {
    for(let i = 0, l = specialCode.breakLine.length; i < l; i++){
        if(buffer[index + i] != specialCode.breakLine[i]){
            return false
        }
    }
    return true
}

const isControllCode = (buffer, index) => {
    for(let i = 0, l = specialCode.startPatternOfControll.length; i < l; i++){
        if(buffer[index + i] != specialCode.startPatternOfControll[i]){
            return false
        }
    }
    return true
}

const parseControllCode = (buffer) => {
    let codeList = buffer.toString().split(specialCode.splitControllChar)
    if(!codeList || !codeList.length){
        return [availableInit[0]]
    }
    let result = []
    for(let i = 0, l = codeList.length; i < l; i++){
        if(codeList[i]){
            codeList[i] = result.push(parseInt(codeList[i]))
        }else{
            result.push(availableInit[0])
        }
    }
    if(!result.every( e => availableColorCode.includes(e))){
        throw new Error('Invalid Controll Code')
    }
    return result
}

const isAscii = (code) => {
    return code >= 32 && code <= 126
}

exports.ansiFileToJson = (binary) => {
    /*
        json = [][]
        entry in json = 
        {
            word: only one char
            color: color hex
            background: backgroun color hex
            right: align right or not
            bright: bright or not
        }
    */
    const buffer = new Uint8Array(binary)
    let rowCount = 0
    const size = buffer.length
    let result = [[]]
    let currentColor = defaultColorInfo.color
    let currentBackground = defaultColorInfo.background
    let bright = defaultColorInfo.bright

    const addElement = (word, right) => {
        result[rowCount].push({
            word: word,
            color: currentColor,
            background: currentBackground,
            bright: bright,
            right: right
        })
    }

    const setColor = (colorInfo) => {
        if(!colorInfo.length){
            currentColor = defaultColorInfo.color
            currentBackground = defaultColorInfo.background
            return;
        }
        colorInfo.forEach(e => {
            if(availableInit.includes(e)){
                currentColor = defaultColorInfo.color
                currentBackground = defaultColorInfo.background
                bright = defaultColorInfo.bright
            }else if(availableBright.includes(e)){
                bright = true
            }else if(availableColor.includes(e)){
                currentColor = e
            }else if(availableBackground.includes(e)){
                currentBackground = e
            }
        });
    }

    const big5BinaryCodeToChar = (i, j) => {
        return BIG5[(buffer[i].toString(16) + buffer[j].toString(16)).toUpperCase()]
    }

    const secondBytePositionOfCurrentPosition = (i) => {
        let temp = i + 1
        while(buffer[temp] != 109 && temp < size){
            temp++
        }
        return temp + 1
    }

    const controllCodeBuffer = (i) => {
        let j = i + 2
        let controllBuffer = []
        while(j < size && buffer[j] != specialCode.endOfControll){
            controllBuffer.push(buffer[j])
            j++
        }
        return controllBuffer
    }
    
    for(let i = 0; i < size; i++){
        if(isBreakLine(buffer, i)){ //break line
            rowCount++
            colCount = 0
            i++
            result.push([])
            continue
        }else if(isControllCode(buffer, i)){ //controll code
            setColor(parseControllCode(new Buffer(controllCodeBuffer(i))))
            while(i < size){
                if(buffer[i] === specialCode.endOfControll){
                    break
                }
                i++
            }
        }else if(isAscii(buffer[i])){ //ascii char
            addElement(String.fromCharCode(buffer[i]), false)
        }else{ // all other case is big5 char
            let big5Char
            if(isControllCode(buffer, i + 1)){ //two color case
                let nextPosition = secondBytePositionOfCurrentPosition(i)
                big5Char = big5BinaryCodeToChar(i, nextPosition)
                addElement(big5Char, false)
                setColor(parseControllCode(new Buffer(controllCodeBuffer(i + 1))))
                addElement(big5Char, true)
                i = nextPosition
            }else{ //single color case
                big5Char = big5BinaryCodeToChar(i, i+ 1)
                addElement(big5Char, false)
                addElement(big5Char, true)
                i++
            }
        }
    }
    return result
}