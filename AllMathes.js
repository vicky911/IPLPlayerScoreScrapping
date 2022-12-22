const request = require("request");
const cheerio = require("cheerio");
const scoreCardObj = require("./scorecard");

function getAllMatchesLink(url) {
  request(url, function (err, response, html) {
    if (err) {
      console.log(err);
    } else {
      extractAllLinks(html);
    }
  });
}
function extractAllLinks(html) {
  let $ = cheerio.load(html);
  let scorecardElems = $(".ds-grow.ds-px-4 > a");
  // console.log(scorecardElems.length);
  for (let i = 0; i < scorecardElems.length; i++) {
    let link = $(scorecardElems[i]).attr("href");
    let fullLink = "https://www.espncricinfo.com" + link;
    //console.log(fullLink);
    scoreCardObj.ps(fullLink);
  }
}
module.exports = {
  getAllmatches: getAllMatchesLink,
};
