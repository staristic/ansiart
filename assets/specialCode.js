exports.specialCode = {
    startPatternOfControll: [27, 91],
    ESC: 27,
    endOfControll: 109,
    splitControll: 59,
    splitControllChar: ';',
    breakLine: [13, 10]
}
exports.availableColor = color = [30, 31, 32, 33, 34, 35, 36, 37]
exports.availableBackground = background = [40, 41, 42, 43, 44, 45, 46, 47]
exports.availableBright = bright = [1]
exports.availableInit = init = [0]
exports.availableColorCode = [].concat(color, background, bright, init)
exports.defaultColorInfo = {
    bright: false,
    color: 37,
    background: 40
}
exports.colorMapCode = {
    normal: {
        front: {
            30: '#000',
            31: '#800000',
            32: '#008000',
            33: '#808000',
            34: '#000080',
            35: '#800080',
            36: '#008080',
            37: '#C0C0C0'
        },
        brightFront: {
            30: '#808080',
            31: '#F00',
            32: '#0F0',
            33: '#FF0',
            34: '#00F',
            35: '#F0F',
            36: '#0FF',
            37: '#FFF'
        },
        background: {
            40: '#000',
            41: '#800000',
            42: '#008000',
            43: '#808000',
            44: '#000080',
            45: '#800080',
            46: '#008080',
            47: '#C0C0C0'
        }
    },
    anti: {
        front: {
            30: '#FFF',
            31: '#7FFFFF',
            32: '#FF7FFF',
            33: '#7F7FFF',
            34: '#FFFF7F',
            35: '#7FFF7F',
            36: '#FF7F7F',
            37: '#3F3F3F'
        },
        brightFront: {
            30: '#7F7F7F',
            31: '#0FF',
            32: '#F0F',
            33: '#00F',
            34: '#FF0',
            35: '#0F0',
            36: '#F00',
            37: '#000'
        },
        background: {
            40: '#FFF',
            41: '#7FFFFF',
            42: '#FF7FFF',
            43: '#7F7FFF',
            44: '#FFFF7F',
            45: '#7FFF7F',
            46: '#FF7F7F',
            47: '#3F3F3F'
        }
    }
}