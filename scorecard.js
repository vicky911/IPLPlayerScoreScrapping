// const url =
//   "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
// Venue date opponent result runs balls fours sixes sr
const request = require("request");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");
// home page
function processScorecard(url) {
  request(url, cb);
}
function cb(err, response, html) {
  if (err) {
    console.log(err);
  } else {
    // console.log(html);
    extractMatchDetails(html);
  }
}
function extractMatchDetails(html) {
  // Venue date opponent result runs balls fours sixes sr
  // ipl
  // team
  // player
  // runs balls fours sixes sr opponent venue date  result
  // venue date
  // .event .description
  // result ->  .event.status - text
  let $ = cheerio.load(html);
  let result = $(
    ".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo-title"
  );
  let descElem = $(".ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid");
  let stringArr = descElem.text().split(",");
  let venue = stringArr[1].trim();
  let date = stringArr[2].trim();
  // console.log(date);
  //console.log(venue);
  result = result.text();
  //console.log(result);
  let innings = $(".ds-rounded-lg.ds-mt-2");
  //console.log(innings.length);
  // let htmlString = "";
  for (let i = 0; i < innings.length; i++) {
    //htmlString += $(innings[i]).html();
    // team opponent
    let teamName = $(innings[i])
      .find(".ds-text-title-xs.ds-font-bold.ds-capitalize")
      .text();
    //teamName = teamName.split("INNINGS")[0].trim();
    let opponentIndex = i == 0 ? 1 : 0;
    let opponentName = $(innings[opponentIndex])
      .find(".ds-text-title-xs.ds-font-bold.ds-capitalize")
      .text();
    // opponentName = opponentName.split("INNINGS")[0].trim();
    // console.log(teamName);
    // console.log(opponentName);
    let cInning = $(innings[i]);
    // console.log(`${venue}| ${date} |${teamName}| ${opponentName} |${result}`);
    let allRows = cInning.find(".ci-scorecard-table tbody tr");

    for (let j = 0; j < allRows.length; j++) {
      let allCols = $(allRows[j]).find("td");
      //console.log(allCols.length);
      let isWorthy = $(allCols[0]).hasClass("ds-w-0");
      if (isWorthy == true) {
        // console.log(allCols.text());
        //       Player  runs balls fours sixes sr

        let playerName = $(allCols[0]).text().trim();

        if (playerName.endsWith("†") || playerName.endsWith("(c)")) {
          if (playerName.endsWith("(c)†"))
            playerName = playerName.substring(0, playerName.length - 5);
          else if (playerName.endsWith("†"))
            playerName = playerName.substring(0, playerName.length - 2);
          else playerName = playerName.substring(0, playerName.length - 4);
        }
        let runs = $(allCols[2]).text().trim();
        let balls = $(allCols[3]).text().trim();
        let fours = $(allCols[5]).text().trim();
        let sixes = $(allCols[6]).text().trim();
        let sr = $(allCols[7]).text().trim();
        //  console.log(playerName);
        // console.log(`${playerName} ${runs} ${balls} ${fours} ${sixes} ${sr}`);
        processPlayer(
          teamName,
          playerName,
          runs,
          balls,
          fours,
          sixes,
          sr,
          opponentName,
          venue,
          date,
          result
        );
      }
    }
  }
  // console.log(htmlString);
}

function processPlayer(
  teamName,
  playerName,
  runs,
  balls,
  fours,
  sixes,
  sr,
  opponentName,
  venue,
  date,
  result
) {
  let teamPath = path.join(__dirname, "ipl2022", teamName);
  dirCreater(teamPath);
  let filePath = path.join(teamPath, playerName + ".xlsx");
  let content = excelReader(filePath, playerName);
  let playerObj = {
    teamName,
    playerName,
    runs,
    balls,
    fours,
    sixes,
    sr,
    opponentName,
    venue,
    date,
    result,
  };
  content.push(playerObj);
  excelWriter(filePath, content, playerName);
}

function dirCreater(filePath) {
  if (fs.existsSync(filePath) == false) {
    fs.mkdirSync(filePath);
  }
}
function excelWriter(filePath, json, sheetName) {
  let newWB = xlsx.utils.book_new();
  let newWS = xlsx.utils.json_to_sheet(json);
  xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
  xlsx.writeFile(newWB, filePath);
}
// // json data -> excel format convert
// // -> newwb , ws , sheet name
// // filePath
// read
//  workbook get
function excelReader(filePath, sheetName) {
  if (fs.existsSync(filePath) == false) {
    return [];
  }
  let wb = xlsx.readFile(filePath);
  let excelData = wb.Sheets[sheetName];
  let ans = xlsx.utils.sheet_to_json(excelData);
  return ans;
}

//processScorecard(url);
module.exports = {
  ps: processScorecard,
};
