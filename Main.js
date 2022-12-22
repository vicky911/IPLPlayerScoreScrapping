//const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const url =
  "https://www.espncricinfo.com/series/indian-premier-league-2022-1298423";
// Venue date opponent result runs balls fours sixes sr
const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const AllMatchgObj = require("./AllMathes");

const iplPath = path.join(__dirname, "ipl2022");
dirCreater(iplPath);

// home page
request(url, cb);
function cb(err, response, html) {
  if (err) {
    console.log(err);
  } else {
    // console.log(html);
    extractLink(html);
  }
}
function extractLink(html) {
  // console.log(html);
  let $ = cheerio.load(html);
  let anchorElem = $(".ds-border-t.ds-border-line.ds-text-center.ds-py-2 > a");
  //let  = h.attr("href");;
  let link = anchorElem.attr("href");
  //console.log("" + h1);
  let fullLink = "https://www.espncricinfo.com" + link;
  console.log(fullLink);
  AllMatchgObj.getAllmatches(fullLink);
  //llMatchgObj.gAlmatches(fullLink);
}

function dirCreater(filePath) {
  if (fs.existsSync(filePath) == false) {
    fs.mkdirSync(filePath);
  }
}
