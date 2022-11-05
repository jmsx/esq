import * as functions from "firebase-functions";
const {Translate} = require('@google-cloud/translate').v2;
import fetch from 'cross-fetch';

export const categorize = functions.https.onRequest(async (request, response) => {
    let data = request.body;
    let categories_input = data.categories;
    let categories: string[] = [];
    let text_input = data.text;
    let text = "";
    let relashionships: any = {};
    let result: any = {};
    let lenguage = data.lenguage || "es";

    if (lenguage != "en") {
        const translate = new Translate();
        text = await translate.translate(text_input, "en");
        while(Array.isArray(text)){
            text = text[0];
        }
        for (let category of categories_input) {
            let v: string = await translate.translate(category, "en");
            while(Array.isArray(v)){
                v = v[0];
            }
            categories.push(v);
            relashionships[v] = category;
        }
    }else{
        text = text_input;
        for (let category of categories_input) {
            categories.push(category);
            relashionships[category] = category;
        }
    }
    
    let data_req = {
        "inputs": text,
        "parameters": {
            "candidate_labels": categories,
        }
    }
    console.log(JSON.stringify(data_req));

    const query = await fetch(
		"https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
		{
			headers: { Authorization: "Bearer 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" },
			method: "POST",
			body: JSON.stringify(data_req),
		}
	);
	const result_query = await query.json();

    console.log(result_query);

    result["text"] = text_input;
    result["category"] = relashionships[result_query["labels"][0]];
    result["confidence"] = result_query["scores"][0];

    response.send(result);
});

