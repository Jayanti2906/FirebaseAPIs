const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();

const express = require('express');
const app = express();

app.get('/defaultSurveyQuests/',(req, res)=>{
  admin
    .firestore()
    .collection('Clients')
    .get()
    .then(data => {
      let defaultQuestions = [];
      data.forEach(doc => {
        defaultQuestions.push(doc.data());
      });
      return res.json(defaultQuestions);
    })
    .catch(err => console.error(err));

})

app.post('/addcustomQuest',(req, res)=>{
  const customQuest = {
    id: req.body.id,
    quest: req.body.quest,
  };
  console.log()
  admin
    .firestore()
    .collection('Clients')
    .doc('SWAY')
    .collection('CustomQuests')
    .add(customQuest)
    .then(doc => {
      res.json({message: `custom quest added successfully: ${doc.quest}`});
    })
    .catch(err => {
      res.status(500).json({ error: 'Something went wrong'});
      console.error(err);
    })
})

app.put('/createClient/',(req, res)=>{
  const newComp = {
    companyName: req.body.companyName,
    brief: req.body.brief,
    headquarters: req.body.headquarters,
    empsize: req.body.empsize,
    revenue: req.body.revenue,
    industryType: req.body.industryType
  };
  console.log()
  admin
    .firestore()
    .collection('Clients')
    .doc(newComp.companyName)
    .add(newComp)
    .then(doc => {
      res.json({message: `New added successfully: ${newComp.companyName}`});
    })
    .catch(err => {
      res.status(500).json({ error: 'Something went wrong'});
      console.error(err);
    })
})

app.post('/addStakeholder',(req, res)=>{
  const Stakeholder = {
    name: req.body.name,
    email: req.body.email,
    title: req.body.title
  };
  console.log()
  admin
    .firestore()
    .collection('Clients')
    .doc('Softway')
    .collection('Stakeholders')
    .doc(Stakeholder.email)
    .set(Stakeholder)
    .then(doc => {
      res.json({message: `custom quest added successfully: ${doc.quest}`});
    })
    .catch(err => {
      res.status(500).json({ error: 'Something went wrong'});
      console.error(err);
    })
})

exports.api = functions.https.onRequest(app);