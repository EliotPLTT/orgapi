import {query, existRow, getCitizen, getOrg, getAffiliation} from '../middleware/db.js';
import {getDate} from './utils.js';

export const showFollowedOrgs = async (handle) => {
    //Maj élémentaires
    const orgList = await query("SELECT SID, orgName, memberNB FROM organization WHERE followed = ?",[true]);
    return orgList
  };

export const showAffiliations = async () => {
    const rows = await query(`
      SELECT 
        c.Handle,
        GROUP_CONCAT(CONCAT(a.orgSID, ' (', a.rank, ')') ORDER BY a.main DESC SEPARATOR ', ') AS affiliations
      FROM 
        citizen c
      LEFT JOIN 
        affiliation a ON c.Handle = a.citizenHandle
      GROUP BY 
        c.Handle
      ORDER BY 
        c.Handle;
    `, []);
    
    return rows;
  };
  
  export const historyOfCitizen = async (handle) => {
    //Maj élémentaires
    const citizen = await getCitizen(handle);
    console.log(citizen);
    const currentAffiliations = await query("SELECT orgSID, rank, firstSight, main FROM affiliation WHERE citizenHandle = ? AND actif = 1 ORDER BY firstSight ASC",[handle]);
    const oldAffiliations = await query("SELECT orgSID, rank, firstSight, LastSight, main FROM affiliation WHERE citizenHandle = ? AND actif = 0 ORDER BY firstSight ASC",[handle]);

    const response = {
      "Handle": citizen.Handle,
      "UCR": citizen.UCR,
      "Enlisted" :citizen.Enlisted,
      "Bio" : citizen.Bio,
      "currentAffiliations" : currentAffiliations,
      "oldAffiliations" : oldAffiliations,
    };

    return response
  };

export const soldeBetweenOrgs = async (SID1, SID2) => {
  const rows = await query(`
    SELECT 
      t1.orgSID AS org_from,
      t2.orgSID AS org_to,
      COUNT(*) AS migrations,
      GROUP_CONCAT(t1.citizenHandle) AS citizens
    FROM affiliation t1
    JOIN affiliation t2 
      ON t1.citizenHandle = t2.citizenHandle
      AND t1.firstSight < t2.firstSight
    WHERE 
      (t1.orgSID = ? AND t2.orgSID = ?) 
      OR 
      (t1.orgSID = ? AND t2.orgSID = ?)
    GROUP BY t1.orgSID, t2.orgSID;
  `, [SID1, SID2, SID2, SID1]);

  const fromAtoB = rows.find(r => r.org_from === SID1 && r.org_to === SID2)?.migrations || 0;
  const fromBtoA = rows.find(r => r.org_from === SID2 && r.org_to === SID1)?.migrations || 0;
  const solde = fromAtoB - fromBtoA;
  console.log(fromAtoB, fromBtoA);
  console.log(solde);

  return { fromAtoB, fromBtoA, solde, rows };
};

export const orgHistory = async (SID) => {
  const lastEntries = await query("SELECT citizenHandle, firstSight FROM affiliation WHERE orgSID = ? AND actif = 1 ORDER BY firstSight DESC LIMIT 7",[SID]);
  const lastDepartures = await query("SELECT citizenHandle, lastSight FROM affiliation WHERE orgSID = ? AND actif = 0 ORDER BY lastSight DESC LIMIT 7",[SID]);
  const response = {
    "SID" : SID,
    "lastEntries" : lastEntries,
    "lastDepartures" : lastDepartures
  };
  return response;
};

export const statDB = async () => {
  const nbCitizen = await query("SELECT count(*) FROM citizen");
  const nbOrg = await query("SELECT count(*) FROM organization");
  const nbAffiliation = await query("SELECT count(*) FROM affiliation");
  const firstAff = await query("SELECT firstSight FROM affiliation ORDER BY firstSight ASC LIMIT 1");
  const lastAff = await query("SELECT firstSight FROM affiliation ORDER BY firstSight DESC LIMIT 1");

  const response = {
    "nbCitizen" : nbCitizen[0]["count(*)"],
    "nbOrg" : nbOrg[0]["count(*)"],
    "nbAffiliation" : nbAffiliation[0]["count(*)"],
    "firstAff" : getDate(firstAff[0]["firstSight"]),
    "lastAff" : getDate(lastAff[0]["firstSight"])
  };
  console.log(response);
  return response;
}