import axios from "axios"
import { createWriteStream, existsSync, mkdirSync, writeFile } from "fs"
import { GoogleSpreadsheet } from "google-spreadsheet"
import { resolve, extname } from "path"
import { v4 as uuid } from "uuid"
require("dotenv").config()
import progress from "progress"
import slugify from "slugify"
import rmrf from "rmrf"

const doc = new GoogleSpreadsheet(process.env.SHEET_KEY)
const imagesDir = resolve(__dirname, "../dobuy-images")
if (!existsSync(imagesDir)) {
  mkdirSync(imagesDir)
}
else {
  rmrf(imagesDir)
  mkdirSync(imagesDir)
}
(async function () {
  await doc.useServiceAccountAuth({
    // eslint-disable-next-line camelcase
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    // eslint-disable-next-line camelcase
    private_key: process.env.GOOGLE_PRIVATE_KEY
  })

  await doc.loadInfo()
  const sheet = doc.sheetsByIndex[0] // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  console.log(sheet.title)
  console.log(sheet.rowCount)

  const nos = sheet.rowCount

  await sheet.loadCells("B2:B" + nos)
  console.log("Loaded B:B Cells...")
  await sheet.loadCells("K2:K" + nos)
  console.log("Loaded K:K Cells...")
  await sheet.loadCells("L2:L" + nos)
  console.log("Loaded L:L Cells...")

  const bar = new progress("processed :current out of :total images [:bar] total :percent elapsed::elapsed", {
    total: nos,
    curr: 1
  })

  for (let cellNo = 2; cellNo <= nos; cellNo ++) {

    const cell = sheet.getCellByA1(`K${cellNo}`)
    const productName = sheet.getCellByA1(`B${cellNo}`)

    if (!cell.value) {
      bar.tick(1)
      continue
    }
    const imageUrl = cell.value.toString().split("/")
    const response = await axios.request({
      method: "get",
      url: cell.value.toString(),
      responseType: "stream"
    });

    ((response, cellNo, imageUrl) => {
      // const imagePthToWrite = uuid().toString()
      const imagePthToWrite = "dobuy-" + slugify(productName.value.toString(), {
        strict: true,
        lower: true
      }) + "-nitroxis-" + new Date().getTime()
      const imageExt = extname(imageUrl.reverse()[0])
      // `-${imagesDir}/${imageUrl[imageUrl.length - 1]}`
      const writer = createWriteStream(`${imagesDir}/${imagePthToWrite}${imageExt}`)
      response.data.pipe(writer)
      writer.on("close", () => {
        const cCell = sheet.getCellByA1("L" + cellNo)
        cCell.value = "https://tools.nitroxis.com/images/dobuy-images/" + imagePthToWrite + imageExt
        // cCell.value = imagePthToWrite + imageExt
        bar.tick(1)
      })
    })(response, cellNo, imageUrl)
  }

  process.on("beforeExit", async () => {
    await sheet.saveUpdatedCells()
  })

}())

