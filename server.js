var express = require('express');
var app = express();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

app.set('view engine', 'ejs');  // 使用模版引擎, 第二个参数是引擎类型, 如还有pug

var bodyParser = require('body-parser');
var fs = require('fs');

var multer  = require('multer')
// var upload =multer({dest: 'uploads/'}); // 指定上传目录


app.use('/', indexRouter);
app.use('/users', usersRouter);


// 更改文件名--------------------------- start -------------------------------------------
// 定义创建上传文件夹的方法
var createFolder = function(folder){
    try{
        fs.accessSync(folder); 
    }catch(e){
        fs.mkdirSync(folder);
    }  
};

var uploadFolder = './upload/'; // 指定文件夹路径

createFolder(uploadFolder);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadFolder)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  });

  var upload = multer({storage:storage});

// -------------------------------------- end -----------------------------------------------



// 上传后, 创建一个目录, 然后再将上传文件放到目录中 
// req.file 直接渠道上传的文件信息对象
app.post('/upload', upload.single('logo'), function(req, res){   // 上传表单input的name值, 用于识别是哪个标签上次
    console.log(req.files)  
    res.send({'ret_code': 0 })
});


/* post请求数据提交处理
    // create application/json parser
    var jsonParser = bodyParser.json()
    // create application/x-www-form-urlencoded parser
    var urlencodedParser = bodyParser.urlencoded({ extended: false })
    app.post('/',urlencodedParser, function(req, res){
        console.dir(req.body)
        res.send(req.body.name)
    });
    app.post('/upload',jsonParser, function(req, res){
        console.dir(req.body)
        res.send(req.body.name)
    });
*/

/* 改写成模版
app.get('/form', function(req, res){
    res.sendFile(__dirname + '/form.html');  // express提供的sendFile发送文件
});
*/
app.get('/form/:name', function(req, res){
    // var person = req.params.name; 
    var data ={age: 18, job: 'programmer', hobbies: ['eating', 'fighting', 'fishing']};   
    res.render('form', {data: data});
});
app.get('/about', function(req, res){
    // var data ={age: 18, job: 'programmer', hobbies: ['eating', 'fighting', 'fishing']};   
    res.render('about');
});


// node里还得用url库解析,然后再取出来, 这里express直接取得
// app.get('/',function(req, res){
//     console.log(req.query)
//     res.send('The home Page: '+ req.query)
//  });
 
 // 路由参数(收集路由中:后动态生成的参数对象)
 app.get('/profile/:id', function(req, res){
     console.dir(req.params)
     res.send(`You requested to see a profile with a id ${req.params.id}`)
 });
 
 // 正则匹配路由 /abcd 和 /acd
 app.get('/ab?cd',function(req, res){
      res.send('/ab?cd')
 });

app.listen(8080);
console.log('the side : http://127.0.0.1:8080')