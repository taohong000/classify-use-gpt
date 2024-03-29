
import OpenAI from "openai";
const openai = new OpenAI({
    baseURL: process.env.OPENAI_API_BASE_URL, // This is the default and can be omitted
    apiKey: process.env.OPENAI_API_KEY,
});



async function askGPT3(prompt,temperature=0) {
    console.log('1.3',prompt)
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        messages: [{ role: 'user', content: prompt }],
        temperature,
    });
    console.log('1.4',response.choices[0].message.content)
    return response.choices[0].message.content;
}
// 序列化返回的数据
async function serializeResponse(answer,temperature=0) {
    const messages = [
        { role: "user", content: answer },
    ];
    const tools = [
        {
            type: "function",
            function: {
                // 序列化函数
                name: "serialize",
                description: "序列化返回的数据",
                parameters: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description: "返回数据的名称",
                        },
                        //  原因
                        reason: {
                            type: "string",
                            description: "返回数据的原因",
                        },
                        // 正确的分类
                        category: {
                            type: "string",
                            description: `分类`,
                        },
                    }
                },
            },
        },
    ];


    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125",
        messages: messages,
        tools: tools,
        temperature,
        tool_choice() { return "serialize" }, // auto is default, but we'll be explicit
    });
    const responseMessage = response.choices[0].message;
    const toolCalls = responseMessage.tool_calls;
    let formatAnswer = [];
    if (responseMessage.tool_calls) {
        formatAnswer = toolCalls.map((toolCall) => {
            return JSON.parse(toolCall.function.arguments);
        })
    }
    return formatAnswer;
}


export async function POST(request) {
    try {
        console.log('1','请求开始')
        const { prompt,temperature } = await request.json()
        console.log('1.1',prompt)
        console.log('1.2',process.env.OPENAI_API_BASE_URL)
        const answer = await askGPT3(prompt,temperature)
        console.log('2',answer)
        const formatAnswer = await serializeResponse(answer,temperature)
        console.log('3',formatAnswer)
        return Response.json({ answer, formatAnswer }) 
    } catch (error) {
        console.error('报错',error)
        return Response.json({ error: error.message }, { status: 500 }) 
    }

}