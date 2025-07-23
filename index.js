const express = require('express')
const bodyParser = require('body-parser')
var app = express();
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://bhavanapolimetla9133:ToDoLists@cluster0.wpzzq7r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
mongoose.connection.on('connected', () => {
  console.log(' Connected to MongoDB Atlas');
});
const taskSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
  }
});

const Task = mongoose.model('Task', taskSchema);

app.get('/',async(req,res)=>{
  try{
    let tasks;
   const selectedpriority = req.query.priority ||"all";
   if(selectedpriority === "all")
   {
     tasks = await Task.find({});
   }
   else{
      tasks = await Task.find({ priority: selectedpriority });
   }
   res.render("list",{
    items:tasks,
    selectedPriority: selectedpriority
   })
  }catch(error)
  {
    console.error(error);
    res.status(500).send("Error fetching tasks");
  }
})
app.post('/',async(req,res)=>{
    const {Todo,priority} = req.body;
    if(Todo.trim()!=="")
    {
      const newTask = new Task({item:Todo.trim(),priority})
      await newTask.save();
    }
    res.redirect("/");
})
app.post('/delete/:id',async(req,res)=>{
   const id = req.params.id;
   await Task.findByIdAndDelete(id);
   res.redirect('/')
})
app.post('/update/:id',async(req,res)=>{
  const id = req.params.id;
  const updatedTask = req.body.updatedTask;
  if (updatedTask.trim() !== "") {
    await Task.findByIdAndUpdate(id, { item: updatedTask.trim() });
  }
  res.redirect('/');
})
app.listen(3000,(err)=>{
  if(err)
  {
    console.log(err)
  }
  else{
    console.log("server started");
  }
})