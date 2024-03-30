require('dotenv').config();

const OpenAI= require('openai');
const cors = require("cors")

const openai = new OpenAI({apiKey: process.env.OPENAPI_API_KEY});

const express = require('express');
const app = express();
const corsOptions ={
    origin:'*',
    methodds:["GET","POST","PUT","DELETE"]
}
app.use(cors(corsOptions));


app.use(express.json());

app.post('/api/endpoint', async (req, res) => {
  const {Name, age, agreement, diet, familyHistory, gender, height, lifestyle, occupation, proteinInTake, waterIntake, weight} = req.body;
    console.log(Name, age, agreement, diet, familyHistory, gender, height, lifestyle, occupation, proteinInTake, waterIntake, weight);
  // Process the user input and generate a response
  const response = {
    message: `You entered: My name is ${Name} and I am ${age} years old ${gender}, and I intake a ${diet} diet also I have a family history of ${familyHistory}. My height is ${height}m, My protien intake is ${proteinInTake}grams per day and my water intake is ${waterIntake} per day. I exercise ${lifestyle}. My occupation is ${occupation}. My weight is ${weight}kgs. Tell me the lifestyle improvisations in a table, food chart that can lead to a better life, possible disease which I might face, everything in terms of scale like high, medium and low. Also give me a separate list score for each of the information provided accordingly for each item out of 10 in a table. Also provide a life expectancy range and suggest some supplementary for the same in price low to high order. All in JSON format.
    
    I need response to be in this format:

    {
        "lifestyle_improvisations": {
            "Sedentary Lifestyle": "High",
            "Low Protein Intake": "High",
            "Low Water Intake": "Medium",
            "Infrequent Exercise": "High"
        },
        "food_chart": {
            "Increase Protein Intake": "High",
            "Include More Fruits and Vegetables": "High",
            "Reduce Saturated Fats and Cholesterol": "High",
            "Limit Processed Foods and Sugars": "High"
        },
        "possible_diseases": {
            "High Cholesterol": "High",
            "Obesity": "Medium",
            "HeartDisease": "Medium",
            "Type 2 Diabetes": "Medium"
        },
        "scores": {
            "ProteinIntake": ,
            "WaterIntake": ,
            "ExerciseFrequency": ,
            "Occupation": ,
            "Weight": ,
            "Age":,
            "Diet":,
            "Height":,
            "Lifestyle":,
            "FamilyHistory":
        },
        "life_expectancy_range": {
            "age":age,
            "min":,
            "max":
        },
        "supplements": [
            {
              "supplement_name": "",
              "price": ""
            },
            {
              "supplement_name": "",
              "price": ""
            },
            {
              "supplement_name": "",
              "price": ""
            }
          ]
    }
    `
  };
  try {
    const promptResponse = await main(response);

    if (promptResponse) {
      res.json(promptResponse);
    } else {
      res.json({'message':'No Response'});
    }
  } catch (error) {
    console.log('Error:', error.message);
    res.json({'message':'Error generating response'});
  }
    
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


const main = async (response) => {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: JSON.stringify(response)}],
      model: "gpt-3.5-turbo",
    });
  
    let content = completion.choices[0].message.content.replace(/[\n\r\t\f]/g, ''); // Remove newline characters
    content = content.replace(/\s{2,}/g, ' '); // Remove extra spaces
    content = content.replace(/\"\s+/g, '"'); // Remove spaces after double quotes
    return JSON.parse(content);
}
