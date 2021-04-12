const Express = require('express');
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");

const { LogModel } = require('../models');

router.get("/practice", validateJWT, (req, res) => {
    res.send('Hey!! This is a practice route!')
});

/*
===============================
        Log Create
===============================
*/
router.post('/', validateJWT, async (req, res) => {
    const {description, definition, result} = req.body.log;
    const {id} = req.user;
    const logEntry = {
        description,
        definition,
        result,
        owner: id
    }
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({error: err});
    }
    LogModel.create(logEntry)
    
});

/*
===============================
      Get All Logs
===============================
*/
router.get("/", async(req, res) => {
    try{
        const entries= await LogModel.findAll();
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

/*
===============================
     Get Logs by User
===============================
*/
router.get("/:id", validateJWT, async(req, res) => {
    let {id} = req.user;
    try{
        const userLogs = await LogModel.findAll({
            where: {
                owner: id
            }
        });
        res.status(200).json(userLogs);
    } catch (err) {
        res.status(500).json({error: err});
    }
});

/*
===============================
        Update a Log
===============================
*/
router.put("/:entryId", validateJWT, async(req, res) => {
    const {title, date, entry} = req.body.log;
    const logId = req.params.entryId;
    const userId = req.user.id;

    const query = {
            where: { 
                id: logId,
                owner: userId
             }
        };
        
        const updatedLog = {
            description: description,
            definition: definition,
            result: result,
        };

        try {
            const update = await LogModel.update(updatedLog, query);
            res.status(200).json(update);
        } catch (err) {
        res.status(500).json({error: err});
    }
});

/*
===============================
       Delete a Log
===============================
*/
router.delete(":id", validateJWT, async(req, res) => {
    const ownerId = req.user.id;
    const logId = req.params.id;

    try{
    const query = {
            where: { 
                id: logId,
                owner: ownerId
             }
        };
        
        await LogModel.destroy(query);
            res.status(200).json({message: "Log Entry Removed"});
        } catch (err) {
        res.status(500).json({error: err});
    }
});

module.exports = router;