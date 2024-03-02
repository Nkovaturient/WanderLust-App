const express= require ("express");

//creating our router object
const router = express.Router();

//INDEX ROUTE
router.get("/", (req, res)=>{
    res.send(`GET FOR USER : I am Groot!`);
});

//SHOW ROUTE
router.get("/:id", (req, res)=>{
    res.send(`GET FOR SHOW USERS ID`);
});

//POST ROUTE
router.post("/", (req, res)=>{
    res.send(`POST FOR USERS`);
});

//POST ROUTE
router.delete("/:id", (req, res)=>{
    res.send(`DELETE FOR USERS`);
});

module.exports = router;