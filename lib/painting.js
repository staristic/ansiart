const { colorMapCode } = require('../assets/specialCode.js')
const { defaultConfig } = require('../config/ansi.config.js')

const isAscii = (word) => {
    let code = word.charCodeAt()
    return code >= 0 && code < 128
}

export function drawAnsi(canvas, ansiInfo, option = defaultConfig){
    if(!ansiInfo.length){
        return
    }
    
    const unitWidth = option.unit
    const unitHeight = unitWidth * 2
    
    const calcPictureWidth = (ansiInfo) =>{
        let l = 0
        for(let row of ansiInfo){
            let rowLen = row.length
            if(!rowLen){
                continue
            }
            l = l > rowLen ? l : rowLen
        }
        return l
    }
    
    const fillBackground = (painting, color = 40, row, col) => {
        painting.fillStyle = colorMapCode[option.mode].background[color]
        painting.fillRect(col * unitWidth, row * unitHeight, unitWidth, unitHeight)
    }
    
    const fillWord = (painting, blockInfo, row, col) => {
        if(!blockInfo || !blockInfo.word){
            return
        }
        let wordWidth = isAscii(blockInfo.word) ? unitWidth : 2 * unitWidth
        let temp = document.createElement('canvas')
        temp.width = wordWidth
        temp.height = unitHeight
        let gt = temp.getContext("2d")
        let colorScope = blockInfo.bright ? 'brightFront': 'front'
        gt.fillStyle = colorMapCode[option.mode][colorScope][blockInfo.color]
        gt.textBaseline = "middle"
        gt.textAlign="left"
        gt.font = `${option.unit * 2}px ${option.fontFamily}`
        gt.fillText(blockInfo.word, 0, unitHeight / 2)
        let startPoint = blockInfo.right ? wordWidth / 2 : 0
        painting.drawImage(temp, startPoint, 0, unitWidth, unitHeight, col * unitWidth, row * unitHeight, unitWidth, unitHeight)
    }
    
    const drawOneBlock = (painting, blockInfo, row, col) => {
        fillBackground(painting, blockInfo && blockInfo.background, row, col)
        fillWord(painting, blockInfo, row, col)
    }
    
    const maxColCount = calcPictureWidth(ansiInfo)
    canvas.width =  maxColCount * unitWidth
    canvas.height = ansiInfo.length * unitHeight
    const g = canvas.getContext("2d")
    
    for(let i = 0, rowlen = ansiInfo.length; i < rowlen; i++){
        for(let j = 0, collen = ansiInfo[i].length, toltallen = Math.max(ansiInfo[i].length, maxColCount); j < toltallen; j++){
            drawOneBlock(g, ansiInfo[i][j], i, j)
        }
    }
    return
}