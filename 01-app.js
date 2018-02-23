var express = require('express');
var app = express();
app.use(express.static('public'));
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require("body-parser");
const peupler = require("./mes_modules/peupler");
app.use(bodyParser.urlencoded({extended: true}));
/* on associe le moteur de vue au module «ejs» */

app.set('view engine', 'ejs'); // générateur de template
 var util = require("util");

////////////////////////////////////// route accueil
app.get('/', function (req, res) {

 res.render('accueil.ejs')
})
app.get('/accueil', function (req, res) {

 res.render('accueil.ejs')
})


app.get('/adresses', function (req, res) {

var cursor = db.collection('adresse').find().toArray(function(err, resultat){
 if (err) return console.log(err)
 	 console.log('util = ' + util.inspect(resultat));
 // transfert du contenu vers la vue index.ejs (renders)
 // affiche le contenu de la BD
 res.render('adresses.ejs', {adresses: resultat, ordre:"asc"})
 }) 
})
//-----------------------------------------Trier------------
app.get('/trier/:cle/:ordre', function (req, res) {
let cle = req.params.cle
 let ordre = (req.params.ordre == 'asc' ? 1 : -1)
// let ordre = (req.params.ordre == 'desc' ? -1 : 1)
 let cursor = db.collection('adresse').find().sort(cle,ordre).toArray(function(err, resultat){
 	ordre = (req.params.ordre == 'desc' ? "asc"  : "desc")
 	// ordre = !ordre
	 res.render('adresses.ejs', {adresses: resultat, ordre:ordre})
	 //res.redirect('/trier/'+req.params.cle+"/"+req.params.ordre)
 }) 
})
app.post('/modifier', function (req, res) {
  
req.body._id = ObjectID(req.body._id)

	db.collection('adresse').save(req.body, (err, result) => {
 		if (err) return console.log(err)
 		console.log('sauvegarder dans la BD')
 		res.redirect('/adresses')
 	})
  
})

//-----------------------------------------------------
app.post('/ajouter', (req, res) => {
 db.collection('adresse').save(req.body, (err, result) => {
 if (err) return console.log(err)
 console.log('sauvegarder dans la BD')
 res.redirect('/adresses')
 })
})
//++++++++++++++++++++DETRUIRE+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  Route Détruire
app.get('/detruire/:id', (req, res) => {
 var id = req.params.id
 console.log(id)
 db.collection('adresse')
 .findOneAndDelete({"_id": ObjectID(req.params.id)}, (err, resultat) => {

if (err) return console.log(err)
 res.redirect('/adresses')  // redirige vers la route qui affiche la collection
 })
})

app.get('/peupler',function(req,res){

console.log(util.inspect("aaaa"+peupler()));

db.collection('adresse').insertMany(peupler(), (err, result) => {

 if (err) return console.log(err)
 console.log('sauvegarder dans la BD')
 res.redirect('/adresses')
 })
})

app.get('/vider', (req, res) => {

 	db.collection('adresse').remove({}, (err, resultat) => {

 		if (err) return console.log(err)
 		res.redirect('/adresses')
 	})
 })

app.post('/rechercher', (req, res) => {

	console.log("test" + req.body);
	var cursor = db.collection('adresse').find({$or : [{nom:req.body.recherche},{prenom:req.body.recherche}]}).toArray(function(err, resultat){
		if (err) return console.log(err)
	 	console.log('util = ' + util.inspect(resultat));


		res.render('adresses.ejs', {adresses: resultat, ordre:"asc"})
	})
 })

let db // variable qui contiendra le lien sur la BD

MongoClient.connect('mongodb://127.0.0.1:27017', (err, database) => {
 if (err) return console.log(err)
 db = database.db('carnet_adresse')
// lancement du serveur Express sur le port 8081
 app.listen(8081, () => {
 console.log('connexion à la BD et on écoute sur le port 8081')
 })
})