import * as cheerio from 'cheerio';
import {fetchPage, getDate} from './utils.js';

export const getCitizenData = async (handle) => {
    try {
        let url = "https://robertsspaceindustries.com/en/citizens/"+handle;
        let code = await fetchPage(url);

        let $citizen = cheerio.load(code);
        const enlistDate = getDate($citizen('span.label:contains("Enlisted")').next().text());
        let mainOrg = "REDACTED";
        try{
            mainOrg = $citizen('a[href*="/orgs/"]').attr("href").replace("/orgs/", "");
        }
        catch (err2){}
        const bio = $citizen('span.label:contains("Bio")').next().text().trim();
        const UCR = $citizen('span.label:contains("UEE Citizen Record")').next().text().trim();
        const mainRank = $citizen('span.label:contains("Organization rank")').next().text().trim();

        let url2 = "https://robertsspaceindustries.com/en/citizens/"+handle+"/organizations";
        let code2 = await fetchPage(url2);
        
        let $org = cheerio.load(code2);
        
        let affiliations = [];
        $org('a[href*="/orgs/"]').each((index, element) => {
            let href = $org(element).attr('href').replace("/orgs/","");
            affiliations.push(href);
        });
        affiliations = affiliations.filter((element, index) => index % 2 === 0);
        affiliations.splice(0,1);

        let affiliationsRanks = [];
        $org('span:contains("Organization rank")').each((index, element) => {
            let href = $org(element).next().text();
            affiliationsRanks.push(href);
        });
        //affiliations = affiliations.filter((element, index) => index % 2 === 0);
        affiliationsRanks.splice(0,1);

        const affiliationJson = []
        for (let i = 0; i<affiliations.length; i++){
            let j = {"org":affiliations[i],"rank":affiliationsRanks[i]};
            affiliationJson.push(j);
        };
        
        return {"Handle":handle,
            "UCR":UCR,
            "Enlisted":enlistDate,
            "Bio":bio,
            "mainOrg":mainOrg,
            "mainOrgRank":mainRank,
            "affiliations":affiliationJson}
        }
    catch (err) {
        console.log(err);
      }
  };