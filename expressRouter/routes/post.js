const express= require ("express");
const router= express.Router(); //fetching ROUTER object of express
// -- no app hence replacing app with router



//Posts
//INDEX ROUTE
router.get("/", (req, res)=>{
    res.send(`GET FOR post : I am Groot!`);
});

//SHOW ROUTE
router.get("/:id", (req, res)=>{
    res.send(`GET FOR SHOW posts ID`);
});

//POST ROUTE
router.post("/", (req, res)=>{
    res.send(`POST FOR posts`);
});

//POST ROUTE
router.delete("/:id", (req, res)=>{
    res.send(`DELETE FOR posts`);
});

module.exports = router;