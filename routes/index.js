var express = require('express');
var router = express.Router();
var fs = require('fs');
var marked = require('meta-marked');
var app = express();


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

//create variable for path to posts directory
var postsDir = __dirname + "/../posts/";

//read contents of posts directory
fs.readdir(postsDir, function(error, directoryContents) {
    if (error) {
        throw new Error(error);
    }

    //create 'posts' object containing parsed markdown contents for each post
    var posts = directoryContents.map(function(filename) {
        var postName = filename.replace('.md', '');
        //var contents = fs.readFileSync(postsDir + filename, {encoding: 'utf-8'});
        var postStuff = marked(
            fs.readFileSync(postsDir + filename, {encoding: 'utf-8'})
        );
        console.log(postStuff.meta.Author);

        return {
            postName: postName, 
            contents: postStuff.html,
            postTitle: postStuff.meta.Title,
            postAuthor: postStuff.meta.Author,
            postDate: postStuff.meta.postDate
        };
    });

    //create route for index page
    router.get('/', function(request, response) {
        response.render('index', {posts: posts, title: "I am a goddamn wizard"})
    });

    //loop through posts object and create route to each post page
    posts.forEach(function(post) {
        router.get('/' + post.postName, function(request, response) {

            response.render('post', {postContents: post.contents, postTitle: post.postTitle, postAuthor: post.postAuthor, postDate: post.postDate})
        })
    })
})

module.exports = router;
