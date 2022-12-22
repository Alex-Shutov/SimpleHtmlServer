const express = require('express')
const fs = require("fs");
const app = express()
const port = 4000
let objCurrentFiles
function getFilesFromDirectory (dir, files) {

    files = files || [];
    const allFiles = fs.readdirSync(dir);
    for (let i = 0; i < allFiles.length; i++) {
        const name = dir + '/' + allFiles[i];
        if (fs.statSync(name).isDirectory()) {
            getFilesFromDirectory(name, files);
        } else{
            if (!objCurrentFiles){
                objCurrentFiles = new Map()
            }
            const getFileName = name.split('/');
            objCurrentFiles?.set(getFileName[getFileName.length-1],name.toString().slice(1))
            files.push(name);
        }
    }
    return files
}



app.get('/*',(req,res) => {
    getFilesFromDirectory('./src')
    const path = req.path.toString().split('/')
    if(!objCurrentFiles.get(path[path.length-1])){
        res.error()
    }
    res.sendFile(__dirname+`${objCurrentFiles.get(path[path.length-1])}`);
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Такого html файла нет в папке src');
});

app.listen(port,function (){
    console.log(`node is starting on http://localhost:${port}`)
});


