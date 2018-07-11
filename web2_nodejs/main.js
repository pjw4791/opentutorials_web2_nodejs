var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var template = {
    HTML:function (title, list, body, control){
        return `
        <!doctype html>
        <html>
        <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            ${control}
            ${body}
        </body>
        </html>
        `;
    },
    list:function (filelist){
        var list = '<ul>';
        var i = 0;
        while(i<filelist.length){
            list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i = i + 1;
        }
        list = list + '</ul>';
        //console.log(list)
        return list;
    }
}//객체를 이용해서 하기 53/61강 원래 templateHTML, templateList로 따로 있는 함수들을 하나로 모음. 접두사 같은 얘들.
//refactoring(리팩토링): 내부의 구조는 똑같지만 약간 수정해서 더 효율적인 코드로 만드는 것.

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    console.log(pathname);
    
    if(pathname === '/'){
        if(queryData.id === undefined){ //이거는 홈일 때
            fs.readdir('./data', function(error, filelist){
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                
                /*
                var list = templateList(filelist);
                var template = templateHTML(title, list, 
                    `<h2>${title}</h2>${description}`, 
                    `<a href="/create">create</a>`
                ); //홈에서는 create 버튼만
                response.writeHead(200);
                response.end(template);
                */

                var list = template.list(filelist);
                var html = template.HTML(title, list, //이제 앞에서 template이라는 변수를 써버렸기 때문에 template을 다 html로 바꿔주자.
                    `<h2>${title}</h2>${description}`, 
                    `<a href="/create">create</a>`
                ); //홈에서는 create 버튼만
                response.writeHead(200);
                response.end(html);
            })
        }else{ //이거는 홈이 아닐 때
            fs.readdir('./data', function(error, filelist){
                fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
                    var title = queryData.id;
                    var list = template.list(filelist);
                    var html = template.HTML(title, list, 
                        `<h2>${title}</h2>${description}`,
                        `<a href="/create">create</a> 
                         <a href="/update?id=${title}">update</a>
                         <form action="delete_process" method="post">
                            <input type="hidden" name="id" value=${title}> 
                            <input type="submit" value="delete">
                         </form>` 
                    ); //홈이 아니게 되었을 때는 create뿐만 아니라, update 버튼도 나타나게.
                    response.writeHead(200);
                    response.end(html);
                });
            })
        }
        
    } else if(pathname === '/create'){
        fs.readdir('./data', function(error, filelist){
            var title = 'Welcome - Create';

            var list = template.list(filelist);
            // <form action="http://localhost:3000/create_process" method="post"> 이렇게 해도 됌.
            var html = template.HTML(title, list, `
            <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
            </form>
            `, '');
            response.writeHead(200);
            response.end(html);
        })
    } else if(pathname === '/create_process'){
        var body='';
        request.on('data', function(data){
            body += data;
            //입력 정보가 너무 많으면 destroy
            if(body.length >1e6)
                request.connection.destroy();
        });
        request.on('end', function(){
            //post에는 { title: '', description: '' } 정보가 들어가는 것
            //qs 모듈의 parse 함수 이용해서
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                //response.writeHead(200);
                //리다이렉션으로 다른 곳으로 가보자.
                response.writeHead(302, {Location: `/?id=${title}`})
                //200은 성공
                //301은 영원히 거기로 바꼈습니다.
                //302는 잠시..?
                response.end();
            })
            //pm2 log에서 보인다
            console.log(post);
        });
        
    } else if(pathname === '/update'){
        fs.readdir('./data', function(error, filelist){
            fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
                var title = queryData.id;
                var list = template.list(filelist);
                var html = template.HTML(title, list, 
                    `
                    <form action="/update_process" method="post">
                        <input type="hidden" name="id" value=${title}>
                        <p><input type="text" name="title" placeholder="title" value=${title}></p>
                        <p>
                            <textarea name="description" placeholder="description" value=${description}></textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                    `,
                    `<a href="/create">create</a> <a href="/update?id=${title}">update</a>` 
                ); //홈이 아니게 되었을 때는 create뿐만 아니라, update 버튼도 나타나게.
                response.writeHead(200);
                response.end(html);
            });
        })
    } else if(pathname === '/update_process'){
        var body='';
        request.on('data', function(data){
            body += data;
            //입력 정보가 너무 많으면 destroy
            if(body.length >1e6)
                request.connection.destroy();
        });
        request.on('end', function(){
            //post에는 { title: '', description: '' } 정보가 들어가는 것
            //qs 모듈의 parse 함수 이용해서
            var post = qs.parse(body);
            var id = post.id; //CSS
            var title = post.title; //CSS3
            var description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, function(error){ //CSS를 CSS3으로 이름을 변경 
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                response.writeHead(302, {Location: `/?id=${title}`})
                response.end();
            })
            })
            console.log(post);
        });
    } else if(pathname === '/delete_process'){
        var body='';
        request.on('data', function(data){
            body += data;
            //입력 정보가 너무 많으면 destroy
            if(body.length >1e6)
                request.connection.destroy();
        });
        request.on('end', function(){
            //post에는 { title: '', description: '' } 정보가 들어가는 것
            //qs 모듈의 parse 함수 이용해서
            var post = qs.parse(body);
            var id = post.id; //id만 전송이 되니깐, title과 description 변수는 필요가 없다. 
            
            fs.unlink(`data/${id}`, function(error){
                response.writeHead(302, {Location: `/`}) //삭제하면 id값이 없는 기본 화면으로 가게 한다.  
                response.end();
            })
            console.log(post);
        });
    } else{
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(3000);