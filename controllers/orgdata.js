import * as cheerio from 'cheerio';
import {fetchPage, postReq, sleep} from './utils.js';

export const getOrgData = async (SID) => {
    SID = (SID).toUpperCase();
    try {
        let url = "https://robertsspaceindustries.com/en/orgs/"+SID+"/members";
        let code = await fetchPage(url);
        let $org = cheerio.load(code);
        let orgName = $org($org('h1')[0]).text().split("/")[0].trim();
        let nbMembers = 0
        if (orgName != "REDACTED"){nbMembers = $org('span.count').text().replace(" member","").replace("s","");}
        return {
            "SID":SID,
            "orgName":orgName,
            "nbMembers":nbMembers
            }
    }
    catch (err) {
        console.log(err);
      }
  };

  export const getOrgDataWithMembers = async (SID) => {
    SID = (SID).toUpperCase();
    try {
        let url = "https://robertsspaceindustries.com/en/orgs/"+SID+"/members";
        let code = await fetchPage(url);
        let $org = cheerio.load(code);
        let orgName = $org($org('h1')[0]).text().split("/")[0].trim();

        let nbMembers = 0
        let members = [];

        if (orgName != "REDACTED"){
            nbMembers = $org('span.count').text().replace(" member","").replace("s","");
            let page = 1;
            while ((members.length < nbMembers) && (page < Math.floor(nbMembers/20))){
                let curMembers = await getMemberPage(SID,page);
                members = members.concat(curMembers);
                page++;
            }
        }

        return {
            "SID":SID,
            "orgName":orgName,
            "nbMembers":nbMembers,
            "nbHidden":(nbMembers - members.length),
            "members":members,   
                }   
    }
    catch (err) {
        console.log(err);
      }
  };

const getMemberPage = async (SID,page) => {
    try{
    let r = (await postReq("https://robertsspaceindustries.com/api/orgs/getOrgMembers", {"symbol":SID,"page":page})).data.html;
    r = r.replaceAll("\n","").replaceAll("\t","");
    let $members = cheerio.load(r);
    let members = [];
    $members('a[href*="/citizens/"]').each((index, element) => {
        let href = $members(element).attr('href').replace("/citizens/","");
        members.push(href);
    });
    return members
    }
    catch (err) {
        return []
    }
  };

  export const retrieveOrgData = async (req, res) => {
    let j = await getOrgData(req.params.SID);
    res.json(j);
  };

  export const retrieveOrgDataWithMembers = async (req, res) => {
    let j = await getOrgDataWithMembers(req.params.SID);
    res.json(j);
  };