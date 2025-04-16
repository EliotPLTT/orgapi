import {query, existRow, getCitizen, getOrg, getAffiliation} from '../middleware/db.js';

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