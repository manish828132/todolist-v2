//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const _ = require('lodash'); 



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));










const mongoose = require('mongoose');

main().catch(err => console.log(err));                        // this entire code use to connect with database

async function main() {
  await mongoose.connect('mongodb+srv://manish828132:Manish896@cluster0.9rnyuaf.mongodb.net/todolistDB');



  //await mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
} 





const itemSchema = new mongoose.Schema({
  name:String
});


const Item=mongoose.model('item',itemSchema);  // **😓notes😥** <singular collection name>

const item1=new Item({name:'Welcome to todolist'});
const item2=new Item({name:'Hit + to add  NEW items'});
const item3=new Item({name:'<-----  check to delete'});

const defaultitems=[item1,item2,item3];

const listSchema={
  name:String,
  items:[itemSchema]
}

const list=mongoose.model("List",listSchema);


//Item.insertMany(defaultitems);

let foundItems;
 








//  const items = ["Buy Food", "Cook Food", "Eat Food"];
  //const workItems = [];



app.get("/", function(req, res) {

const day = date.getDate();
Item.find().then(function(documents){  
  if(documents.length===0)
  {
    Item.insertMany(defaultitems);
    
    res.redirect("/");

  } 

  else
  {

  }
  foundItems=documents;                                        // access data from database.... "Item" model name
  res.render("list", {listTitle: "today", newListItems: foundItems});
      


                                                                                //mongoose.connection.close();  //use to close the connection

 });

  

});










app.get("/:customListName",function(req,res){
 
  let customListName=_.capitalize(req.params.customListName);
  

  
  list.findOne({name:customListName} )
  .then((docs)=>{
   
      if((!docs))
      {

        
      let  list2=new list({
          name:customListName,
          items:defaultitems

        })

        list2.save();
        res.redirect("/"+customListName)
      }

      else{
        res.render("list",{listTitle: customListName, newListItems: docs.items})
      }
  })
  .catch((err)=>{
      console.log(err);
  });
    
    
   


  app.post("/", function(req, res){
   
  const itemName = req.body.newItem;
  let listName=req.body.list;
  let tempitem=new Item({
    name:itemName
    
  })

  if (req.body.list === "today") {
    tempitem.save();
    res.redirect("/");
    
  } 
  
  
  else {

    list.findOne({name:listName })
    .then((docs)=>{
        docs.items.push(tempitem);
        docs.save();
        res.redirect("/"+listName);
    })
    .catch((err)=>{
        console.log(err);
    });
    
    


  }
});



  

});










// app.post("/", function(req, res){

//   const item = req.body.newItem;

//   if (req.body.list === "Work") {
//     workItems.push(item);
//     res.redirect("/work");
//   } 
  
  
//   else {


    
//     let tempitem=new Item({name:item});
//     tempitem.save();
//     res.redirect("/");


//   }
// });








app.post("/delete",function(req,res){
  console.log(req.body.checkbox);

  const listName=req.body.listName;
  const itemid=req.body.checkbox;

  if(listName==="today")
  {

    Item.deleteOne({ _id:itemid  }).then(function(){                    //delete working
      console.log("deleted"); // Success
   }).catch(function(error){
      console.log(error); // Failure
   });
   res.redirect("/");

  }

  else
  
  {
    list.findOneAndUpdate({ name:listName }, { $pull: { items:{_id:itemid} } } ,{
      returnOriginal: false
    }).then(function(){
      console.log("de");
    }).catch(function(error){
      console.log(error);
    });
    res.redirect("/"+listName);

  }

   


})










// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});  
// });








app.get("/about", function(req, res){
  res.render("about");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
