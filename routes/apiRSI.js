import express from 'express';
import {getCitizenData} from '../controllers/citizendata.js'; // chemin relatif et syntaxe ES6
import {getOrgData, getOrgDataWithMembers} from '../controllers/orgdata.js'; // chemin relatif et syntaxe ES6

const router = express.Router();

router.use("/citizen/:handle", async (req,res) => {
  res.json(await getCitizenData(req.params.handle))
});

router.use("/org/:SID/members", async (req,res) => {
  res.json(await getOrgDataWithMembers(req.params.SID))
});

router.use("/org/:SID", async (req,res) => {
  res.json(await getOrgData(req.params.SID))
});

router.use("/", (req, res) => {
  res.send('RSI');
});

export default router;
