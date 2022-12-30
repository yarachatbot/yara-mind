const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const fs = require('fs');
require('dotenv').config()
const getName=require('./scripts/dbFunctons/getName')
const lastConvo=require('./scripts/cacheConvoFunctions/lastConvo')
const app = express();
app.use(express.json());
const port=process.env.PORT || 3000


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function generatePrompt(name,convo) {
    var p=process.env.PROMPT;
    p = p.replace(/USER_NAME/g, name);
    p = p.replace(/CONVO/g, convo);
    return p;
  }

async function sendToOpenAI(name,convo) {
    p=generatePrompt(name,convo)
    
    const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: p,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 1.3,
    presence_penalty: 1.3,
    stop: ["Abhinav:"]
  });
    const data = completion.data.choices[0].text;
    const tokens_used=completion.data.usage.total_tokens;
    console.log(p,data,tokens_used)
    return data
  }

app.post('/nextMessage', async (req, res) => {
    const user_id=req.body.user_id;
    var {name,last_convo}=await lastConvo(user_id)
    var convo=last_convo.join('\n')
    convo=convo+`${name}: ${req.body.user_message}\nYara:`
    const data=await sendToOpenAI(name,convo)
    fs.appendFile(''+user_id+'.txt', `${name}: ${req.body.user_message}\nYara:${data}\n`, (err) => {
      if (err) throw err;
      // console.log('The file has been saved!');
    });
    
    res.status(200).json({ result: data })
  });

  app.post('/startConvo', async (req, res) => {
    // console.log(req.body)
    const user_id=req.body.user_id;
    const name=await getName(user_id)
    const convo="Yara:"

    if (fs.existsSync(''+user_id+'.txt')) {
    fs.unlink(''+user_id+'.txt', (err) => {
      if (err) throw err;
      // console.log('The file has been deleted!');
    });
    }
    const data=await sendToOpenAI(name,convo)
    fs.writeFile(''+user_id+'.txt', `${name}\nYara:${data}\n`, (err) => {
      if (err) throw err;
      // console.log('The file has been saved!');
    });
    res.status(200).json({ result: data })
  });
  

app.listen(port, () => {
  console.log('Server is listening on port',port);
});
