
/* To enable this snippet, type 'express' */ 

const express = require('express');
const bodyParser = require('body-parser')
const ejs = require('ejs');
const mongoose = require('mongoose');
const { setupMaster } = require('cluster');
const { isMainThread } = require('worker_threads');
const { isString } = require('util');

/* To use bodyParser, you can use the */
/* req.body.<name_attribute_from_html>, */
/* to retrieve data from a html form. */


/* To use any CSS file, you would have to */
/* 'link the stylesheet to the HTML document, */
/* and create a public directoy, containing a css directory. */
/* After creating, this directories, and adding the link to the HTML, */
/* you have to explicitly tell express to use the public files */
/* with adding line above these comments. */

const app = express();
app.set('view engine', 'ejs')
app.use(express.static('public'))


/* In order to get 'ejs' working, */
/* view documentation on https://ejs.co/ */
/* to use ejs tags and to use render methods as well. */

app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true})

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

// Finnd ALL the Articles

app.route("/articles")
    .get(function(req, res) {
        Article.find(function(err, foundArticles){
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        })
    })
    .post(function(req, res){
        const newArticle = new Article ({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function(err){
            if (!err) {
                res.send("Successfully added a new article!")
            } else {
                res.send(err);
            }
        });
    })
    .delete(function(req, res){
        Article.deleteMany(function(err){
            if (!err) {
                res.send("Successfully deleted all articles.")
            } else {
                res.send(err)
            }
        })
    });

    // Find a Specifc Article

app.route("/articles/:articleTitle")
    .get(function(req, res){
        Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
            if (foundArticle) {
                res.send(foundArticle)
            } else {
                res.send("No articles with the title found")
            }
        })
    })
    // Put will replace the entire document
    .put(function(req, res){
        const newArticle = new Article ({
            title: req.body.title,
            content: req.body.content
        })
        Article.update({title: req.params.articleTitle}, {newArticle}, {overwrite: true}, function(err){
            if (!err) {
                res.send("Successfully Updated!")
            }
        })
    })
    .patch(function(req, res){
        Article.update({title: req.params.articleTitle}, {$set: req.body}, function(err){
            if (!err) {
                res.send("Successfully Updated Article")
            } else {
                res.send(err)
            }
        })
    })
    .delete(function(req, res){
        Article.deleteOne({title: req.params.articleTitle}, function(err){
            if (!err) {
                res.send("Successfully Deleted!")
            } else {
                res.send(err)
            }
        })
    });

    // Patch will just update the field of the document




app.get('/', function(req,res) {
res.send('hello');
});




app.listen(3000, function(){
console.log('You are listening to Port:3000');
});

// Quick Note: All these routes may be the same so you can use app.route() and chain methods with it 
// Check the app.route section on expressjs.com/en/guide/routing.html video 369 on Angela Yu Bootcamp WEBDEV