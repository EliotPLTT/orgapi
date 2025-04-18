import {query, existRow, getCitizen, getOrg, getAffiliation} from '../middleware/db.js';
import {getCitizenData} from '../controllers/citizendata.js'; // chemin relatif et syntaxe ES6
import {getOrgData, getOrgDataWithMembers} from '../controllers/orgdata.js'; // chemin relatif et syntaxe ES6
import {sleep, appartient} from '../controllers/utils.js';

export const reviewCitizen = async (handle) => {
    //Maj élémentaires
    const LIVEcitizen = await getCitizenData(handle);

    await updAffiliation(LIVEcitizen,LIVEcitizen.mainOrg, LIVEcitizen.mainOrgRank, true);
    let LIVEaffiliation = LIVEcitizen.affiliations;

    for (let i = 0; i < LIVEaffiliation.length; i++){
        await updAffiliation(LIVEcitizen, LIVEaffiliation[i].org, LIVEaffiliation[i].rank, false);
    }    
    
    // Desactiver les affiliations
    let DBaffiliations = await query("SELECT orgSID FROM affiliation WHERE citizenHandle = ? and actif = 1", [LIVEcitizen.Handle]);
    DBaffiliations = DBaffiliations.map((el) => {return el.orgSID});
    LIVEaffiliation = (LIVEaffiliation.map((el) => {return el.org})).concat([LIVEcitizen.mainOrg]);
    for (let i = 0; i < DBaffiliations.length; i++){
        if (appartient(DBaffiliations[i],LIVEaffiliation) == false){
            let affiliationToKill = await getAffiliation(LIVEcitizen.Handle, DBaffiliations[i]);
            await query("UPDATE affiliation SET actif = 0 WHERE id = ?",[affiliationToKill.id]);
        }
    }
  };

export const reviewOrg = async (SID) => {
    //Maj élémentaires
    const LIVEorg = await getOrgDataWithMembers(SID);
    await updOrg(SID);
    const members = LIVEorg.members;
    for (let i = 0; i < members.length; i++){
        console.log("[~] ("+(i+1)+"/"+(members.length)+")"+members[i]);
        await updAffiliation(await getCitizen(members[i]), SID, "unknow", false);
        //await reviewCitizen(members[i]);
    }
    return members.length
};

export const reviewAllCitizens = async () => {
    //Maj élémentaires
    const citizenList = await query("SELECT * FROM citizen",[]);
    for (let i = 0; i < citizenList.length; i++){
        console.log("[~] ("+(i+1)+"/"+(citizenList.length)+")"+citizenList[i].Handle);
        await reviewCitizen(citizenList[i].Handle);
        sleep(100);
    }
    return citizenList.length;
};

export const reviewAllOrgs = async () => {
    //Maj élémentaires
    const orgList = await query("SELECT * FROM organization WHERE followed = ?",[true]);
    for (let i = 0; i < orgList.length; i++){
        console.log("[~] ("+(i+1)+"/"+(orgList.length)+")"+orgList[i].SID);
        await reviewOrg(orgList[i].SID);
        sleep(100);
    }
    return orgList.length;
};

export const followOrg = async (SID, status) => {
    await query("UPDATE organization SET followed = ? WHERE SID = ?",[status,SID]);
    return {"Status":"OK"};
};

const updOrg = async (SID) => {
    const LIVEmainOrg = await getOrgData(SID);
    const DBmainOrg = await getOrg(SID);
    if (DBmainOrg == false){
        await query("INSERT INTO organization (SID, orgName, memberNB) VALUES (?,?,?)",[SID, LIVEmainOrg.orgName, LIVEmainOrg.nbMembers]);
    }
    else{
        await query("UPDATE organization SET orgName = ?, memberNB = ? WHERE SID = ?",[LIVEmainOrg.orgName, LIVEmainOrg.nbMembers, SID]);
    }
};

const updCitizen = async (LIVEcitizen) => {
    const DBcitizen = await getCitizen(LIVEcitizen.Handle);
    if (DBcitizen == false){
        await query("INSERT INTO citizen (Handle, UCR, Enlisted, Bio) VALUES (?,?,?,?)",[LIVEcitizen.Handle, LIVEcitizen.UCR, LIVEcitizen.Enlisted, LIVEcitizen.Bio]);
    }
    else{
        await query("UPDATE citizen SET UCR = ?, Enlisted = ?, Bio = ? WHERE Handle = ?",[LIVEcitizen.UCR, LIVEcitizen.Enlisted, LIVEcitizen.Bio, LIVEcitizen.Handle]);
    }
};

const updAffiliation = async (LIVEcitizen, SID, rank, main) => {
    await updCitizen(LIVEcitizen);
    await updOrg(SID);
    const DBaffiliation = await getAffiliation(LIVEcitizen.Handle, SID);
    if (DBaffiliation == false){
        await query("INSERT INTO affiliation (citizenHandle, orgSID, rank, main) VALUES (?,?,?,?)",[LIVEcitizen.Handle, SID, rank, main]);
    }
    else{
        await query("UPDATE affiliation SET rank = ?, main = ?, lastSight = ? WHERE id = ?",[rank, main, new Date(), DBaffiliation.id]);
    }
};