const transfer = require("./lib/transfer.js")
const painting = require("./lib/painting.js")

module.exports.ansiFileToJson  = (fileBinary)=> { return transfer.ansiFileToJson(fileBinary) }
module.exports.drawAnsiJson  = (canvas, json, option)=> { painting.drawAnsi(canvas, json, option) }
module.exports.drawAnsiFile  = (canvas, fileBinary, option)=> { painting.drawAnsi(canvas, transfer.ansiFileToJson(fileBinary), option) }