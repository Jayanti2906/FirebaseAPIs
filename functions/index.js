const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();

const express = require('express');
const app = express();
var cors = require('cors')
app.use(cors({credentials: true, origin: true}))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//To fetch default survey question for generic mnc or healthcare
app.get('/defaultSurveyQuests/',(req, res)=>{
  admin
    .firestore()
    .collection('DefaultSurveys')
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

//To fetch client specific questions 
app.get('/ClientQuestionnaire/:client',(req, res)=>{
  admin
    .firestore()
    .collection('Clients')
    .doc(req.params.client)
    .collection('SurveySettings')
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

//To add custom questions for a client
app.post('/addcustomQuest/:compName/:id',(req, res)=>{
  const customQuest = {
    id: req.params.id,
    quest: req.body.quest,
  };
  console.log()
  admin
    .firestore()
    .collection('Clients')
    .doc(req.params.compName)
    .collection('CustomQuests')
    .doc(customQuest.id)
    .set(customQuest)
    .then(doc => {
      res.json({message: `custom quest added successfully: ${doc.quest}`});
    })
    .catch(err => {
      res.status(500).json({ error: 'Something went wrong'});
      console.error(err);
    })
})

//to add a new client with basic info
app.put('/createClient/',(req, res)=>{
  const newComp = {
    companyName: req.body.companyName,
    brief: req.body.brief,
    headquarters: req.body.headQuarters,
    empsize: req.body.empSize,
    revenue: req.body.revenue,
    industryType: req.body.industryType
  };
  
  console.log("gjgjggkhkh")
  admin
    .firestore()
    .collection('Clients')
    .doc(newComp.companyName)
    .set(newComp)
    .then(doc => {
      res.json({message: `New added successfully: ${newComp.companyName}`});
    })
    .catch(err => {
      res.status(500).json({ error: 'Something went wrong'});
      console.error(err);
    })
})

//To add stakeholder for a specific client 
app.post('/addStakeholder/:cn',(req, res)=>{
  const Stakeholder = {
    name: req.body.name,
    email: req.body.email,
    title: req.body.title
  };
  console.log()
  admin
    .firestore()
    .collection('Clients')
    .doc(req.params.cn)
    .collection('Stakeholders')
    .doc(Stakeholder.email)
    .set(Stakeholder)
    .then(doc => {
      res.json({message: `custom quest added successfully: ${doc.name}`});
    })
    .catch(err => {
      res.status(500).json({ error: 'Something went wrong'});
      console.error(err);
    })
})



//To add questionnaire for a specific client 
app.post('/addQuestionnaire/:compName',(req, res)=>{
  const Quests = {
    
    industryType : req.body.industryType,
    baselineDate : req.body.baselineDate,
    pulseFreq : req.body.pulseFreq,
    
    trustLeader : req.body.trustLeader,
    trustTeam : req.body.trustTeam,
    trustSelf : req.body.trustSelf,

    inclusionLeader : req.body.inclusionLeader,
    inclusionTeam : req.body.inclusionTeam,
    inclusionSelf : req.body.inclusionSelf,

    empathyLeader : req.body.empathyLeader,
    empathyTeam : req.body.empathyTeam,
    empathySelf : req.body.empathySelf,

    empLeader : req.body.empLeader,
    empTeam : req.body.empTeam,
    empSelf : req.body.empSelf,

    forgiveLeader : req.body.forgiveLeader,
    forgiveTeam : req.body.forgiveTeam,
    forgiveSelf : req.body.forgiveSelf,

    vulLeader : req.body.vulLeader,
    vulTeam : req.body.vulTeam,
    vulSelf : req.body.vulSelf,

    mindsetLeader : req.body.mindsetLeader,
    mindsetTeam : req.body.mindsetTeam,
    mindsetSelf : req.body.mindsetSelf,

    behLeader : req.body.behLeader,
    behTeam : req.body.behTeam,
    behSelf : req.body.behSelf,

    commLeader : req.body.commLeader,
    commTeam : req.body.commTeam,
    commSelf : req.body.commSelf,

    hptLeader : req.body.hptLeader,
    hptTeam : req.body.hptTeam,
    hptSelf : req.body.hptSelf,
            
  };

  admin
    .firestore()
    .collection('Clients')
    .doc(req.params.compName)
    .collection('SurveySettings')
    .doc('SwaySS')
    .set(Quests)
    .then(doc => {
      res.json({message: `Survey questions added successfully: ${doc.quest}`});
    })
    .catch(err => {
      res.status(500).json({ error: 'Something went wrong'});
      console.error(err);
    })
})


exports.api = functions.https.onRequest(app);