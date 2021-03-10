import axios from "axios"
import { createWriteStream, existsSync, mkdirSync, writeFile } from "fs"
import { GoogleSpreadsheet } from "google-spreadsheet"
import { resolve, extname } from "path"
import { v4 as uuid } from "uuid"
require("dotenv").config()
import progress from "progress"

const doc = new GoogleSpreadsheet(process.env.SHEET_KEY)
const imagesDir = resolve(__dirname, "../images")
if (!existsSync(imagesDir)) {
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
  console.log(doc.title)
  // await doc.updateProperties({
  //   title: "renamed doc"
  // })

  const sheet = doc.sheetsByIndex[0] // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  console.log(sheet.title)
  console.log(sheet.rowCount)
  await sheet.loadCells("K2:K" + sheet.rowCount)
  console.log("Loaded K:K Cells...")
  await sheet.loadCells("L2:L" + sheet.rowCount)
  console.log("Loaded L:L Cells...")

  const nos = sheet.rowCount
  const bar = new progress("processed :current out of :total images [:bar] total :percent elapsed::elapsed", {
    total: nos,
    curr: 1
  })
  for (let cellNo = 2; cellNo <= nos; cellNo ++) {

    const cell = sheet.getCellByA1(`K${cellNo}`)
    const imageUrl = cell.value.toString().split("/")
    const response = await axios.request({
      method: "get",
      url: cell.value.toString(),
      responseType: "stream"
    });

    ((response, cellNo, imageUrl) => {
      const imagePthToWrite = uuid().toString()
      const imageExt = extname(imageUrl.reverse()[0])
      // `-${imagesDir}/${imageUrl[imageUrl.length - 1]}`
      const writer = createWriteStream(`${imagesDir}/${imagePthToWrite}${imageExt}`)
      response.data.pipe(writer)
      writer.on("close", () => {
        const cCell = sheet.getCellByA1("L" + cellNo)
        cCell.value = "https://tools.nitroxis.com/images/images/" + imagePthToWrite + imageExt
        bar.tick(1)
      })
    })(response, cellNo, imageUrl)
  }

  process.on("beforeExit", async () => {
    await sheet.saveUpdatedCells()
  })

}())

