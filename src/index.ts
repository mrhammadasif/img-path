import axios from "axios"
import { createWriteStream, existsSync, mkdirSync, writeFile } from "fs"
import { GoogleSpreadsheet } from "google-spreadsheet"
import { resolve, extname } from "path"
import { v4 as uuid } from "uuid"
require("dotenv").config()

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

  for (let cellNo = 2; cellNo <= 10; cellNo ++) {

    const cell = sheet.getCellByA1(`K${cellNo}`)
    console.log(cell.value)
    const imageUrl = cell.value.toString().split("/")
    axios.request({
      method: "get",
      url: cell.value.toString(),
      responseType: "stream"
    }).then(((response) => {

      ((response, cellNo, imageUrl) => {
        const imagePthToWrite = uuid().toString()
        const imageExt = extname(imageUrl.reverse()[0])
        // `-${imagesDir}/${imageUrl[imageUrl.length - 1]}`
        const writer = createWriteStream(`${imagesDir}/${imagePthToWrite}${imageExt}`)
        response.data.pipe(writer)
        writer.on("close", async () => {
          await sheet.loadCells("L2:L" + sheet.rowCount)
          const cCell = sheet.getCellByA1("L" + cellNo)
          cCell.value = "https://tools.nitroxis.com/images/images/" + imagePthToWrite + imageExt
          await cCell.save()
        })
      })(response, cellNo, imageUrl)
    }))
  }
}())
