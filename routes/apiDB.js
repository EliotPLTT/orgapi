import express from 'express';
import {reviewCitizen, reviewOrg, reviewAllCitizens, reviewAllOrgs, followOrg} from '../controllers/update.js'; // chemin relatif et syntaxe ES6
import {showFollowedOrgs, showAffiliations, historyOfCitizen, soldeBetweenOrgs, orgHistory, statDB} from '../controllers/admin.js'; // chemin relatif et syntaxe ES6

const router = express.Router();

// ===== UPDATE =====
router.use("/UPDATE/citizen/:handle", async (req,res) => {
    try{
    await reviewCitizen(req.params.handle);
    res.json({"status":"OK"});
    }
    catch (err) {
        res.status(500).json({ error: 'Impossible de récupérer la page', details: err.message });
    }
});

router.use("/UPDATE/org/:SID", async (req,res) => {
    try{
        let r = await reviewOrg(req.params.SID);
        res.json({"status":"OK",
            "nbUserMisAJour":r
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Impossible de récupérer la page', details: err.message });
    }
});

router.use("/UPDATE/citizens", async (req,res) => {
    try {
    let l = await reviewAllCitizens();
    res.json({"nbUserMisAJour":l});
    }
    catch (err) {
        res.status(500).json({ error: 'Impossible de récupérer la page', details: err.message });
    }
});

router.use("/UPDATE/orgs", async (req,res) => {
    try {
    let l = await reviewAllOrgs();
    res.json({"nbOrgs":l});
    }
    catch (err) {
        res.status(500).json({ error: 'Impossible de récupérer la page', details: err.message });
    }
});

// ======= STAT =======

router.use("/STAT/followedOrgs", async (req,res) => {
    try {
    let l = await showFollowedOrgs();
    res.json(l);
    }
    catch (err) {
        res.status(500).json({ error: 'Impossible de récupérer la page', details: err.message });
    }
});

router.use("/STAT/affiliations", async (req,res) => {
    try {
    let l = await showAffiliations();
    res.json(l);
    }
    catch (err) {
        res.status(500).json({ error: 'Impossible de récupérer la page', details: err.message });
    }
});

router.use("/STAT/historique/:handle", async (req,res) => {
    try {
    let l = await historyOfCitizen(req.params.handle);
    res.json(l);
    }
    catch (err) {
        res.status(500).json({ error: 'Impossible de récupérer la page', details: err.message });
    }
});

router.use("/STAT/solde/:SID1/:SID2", async (req,res) => {
    try {
    let l = await soldeBetweenOrgs(req.params.SID1, req.params.SID2);
    res.json(l);
    }
    catch (err) {
        res.status(500).json({ error: 'Impossible de récupérer la page', details: err.message });
    }
});

router.use("/STAT/orgHistory/:SID", async (req,res) => {
    try {
    let l = await orgHistory(req.params.SID);
    res.json(l);
    }
    catch (err) {
        res.status(500).json({ error: 'Impossible de récupérer la page', details: err.message });
    }
});

router.use("/STAT/statDB", async (req,res) => {
    try {
    let l = await statDB();
    res.json(l);
    }
    catch (err) {
        res.status(500).json({ error: 'Impossible de récupérer la page', details: err.message });
    }
});

// ======= STAT =======

router.use("/ADMIN/followOrg/:SID", async (req,res) => {
    try {
        let l = await followOrg(req.params.SID, 1);
    res.json(l);
    }
    catch (err) {
        res.status(500).json({ error: 'Impossible de récupérer la page', details: err.message });
    }
});

router.use("/ADMIN/unfollowOrg/:SID", async (req,res) => {
    try {
    let l = await followOrg(req.params.SID, 0);
    res.json(l);
    }
    catch (err) {
        res.status(500).json({ error: 'Impossible de récupérer la page', details: err.message });
    }
});


router.use("/", (req, res) => {
  res.send('db');
});

export default router;
