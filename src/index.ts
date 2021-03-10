import { GoogleSpreadsheet } from "google-spreadsheet"

require("dotenv").config()

const doc = new GoogleSpreadsheet(process.env.SHEET_KEY);

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
  await sheet.loadCells("K:K")
  const cell = sheet.getCellByA1("K2")
  console.log(cell.value)

  // // adding / removing sheets
  // const newSheet = await doc.addSheet({
  //   title: "hot new sheet!"
  // })
  // await newSheet.delete()
}())
