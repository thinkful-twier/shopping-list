var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.remove = function(id) {
    for(var i=0; i < this.items.length; i++){
        if(this.items[i].id == id){
            var removed = this.items[i];
            this.items.splice(i, 1);
            return removed;
        }
    }
    return null;
}

Storage.prototype.edit = function(id, newName) {
    for(var i=0; i < this.items.length; i++){
        if(this.items[i].id == id){
            this.items[i].name = newName;
            return this.items[i];
        }
    }
    return null;
}

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

app.delete('/items/:id', function(req, res) {
   if(req.params.id === undefined){
        return res.sendStatus(400);
   }
   
   var removedItem = storage.remove(req.params.id);
   
   if(removedItem){
       res.status(200).json(removedItem);
   }else{
       var msg = 'Item ' + req.params.id + ' does not exist';
       res.status(200).json({error:msg});
   }
});

app.put('/items/:id', jsonParser, function(req, res){
   if(!req.body){
        return res.sendStatus(400);
   }
   
   if(req.body.id === undefined || req.body.id === null){
        var item = storage.add(req.body.name);
        res.status(201).json(item);
   }else{
       var edited = storage.edit(req.body.id, req.body.name);
       
       if(edited){
           res.status(200).json(edited);
       }else{
           var msg = 'Item ' + req.body.id + ' does not exist';
           res.status(400).json({error:msg});
       }       
   }
});

app.listen(process.env.PORT || 8080);