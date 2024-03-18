"use client"
import React, { useState, useEffect } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState("等级医院");
  const [answer, setAnswer] = useState("");
  // 格式化的答案
  const [formatAnswer, setFormatAnswer] = useState([]);
  useEffect(() => {
    // 根据分类设置提示词
    setPrompt(`1.下面"明显不属于"${category}的有哪些, 并给出相应的理由
2. 按照 名称:xxx 理由:xxx 的格式给出, 只返回不属于的`)
  }, [category])

  function submit(e) {
    e.preventDefault();
    // 提交表单
    fetch("/api", {
      method: "POST",
      body: JSON.stringify({ category, prompt }),
    })
      .then((res) => res.json())
      .then((res) => {
        setAnswer(res.answer);
        setFormatAnswer(res.formatAnswer);
        console.log(res);
      });
  }
  return (
    <main >
      {/* 注意点 */}
      <h4>注意点</h4>
      <p>1. 请在下面的输入框中输入提示词，然后点击提交按钮。我们的目标是找到可堪一用的提示词, 还是需要人工再过一遍的</p>
      <p>2. 用的是免费接口, 有速率限制 120次/min, 每次请求调用两次, 一次回答, 一次格式化, 所以一分钟可以提交60次</p>
      <p>3. 进行复杂任务效果不佳, 比如既要挑选出错误的分类,又要归类正确的分类, 下面是测试提示词
        
      </p>
      <div className="text-gray-500 mb-4">
        <div>1. 下面"明显不属于"等级医院的有哪些, 并给出相应的理由和正确分类</div>
        <div>2. 按照 名称:xxx 理由:xxx 分类:xxx 的格式返回</div>
        <div>分类说明:</div>
        <div>"等级医院": 提供全方位医疗服务的医疗机构，按照医疗水平和服务范围划分等级。</div>
        <div>"基层医疗": 提供基本医疗保健服务的单位，如社区卫生服务中心、卫生室等。</div>
        <div>"单体药店": 独立运营的零售药店，提供药品销售服务而非附属于医疗机构。</div>
        <div>"商业渠道": 销售商品或服务的各种方式，包括传统零售店、电子商务平台等，在医药领域可指药店、医疗器械公司等。</div>
        <div>"其他": 不属于上述分类的项目或实体，可能包括各种非医疗相关的内容。</div>
      </div>
      {/* 表单 */}
      <h4>表单</h4>
      <form method="post">
        {/* temperature */}
        
        <label htmlFor="temperature">temperature</label>
        
        <input type="number" id="temperature" name="temperature" step={0.1} defaultValue="0" />
        <div className="text-gray-500 text-sm">使用什么采样温度，介于 0 和 2 之间。较高的值（如 0.8）将使输出更加随机，而较低的值（如 0.2）将使其更加集中和确定性。</div>
        <br />
        {/* 分类选项 */}
        <label htmlFor="category">分类</label>
        <select className="" id="category" name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)} 
        >
          <option value="等级医院">等级医院</option>
          <option value="基层医疗">基层医疗</option>
          <option value="单体药店">单体药店</option>
          <option value="商业渠道">商业渠道</option>
        </select>
        <br />
        {/* 提示词 */}
        <label htmlFor="prompt">提示词</label>
        <textarea id="prompt" name="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)} 
          className="w-[1000px] h-[500px] "
         />
        {/* 提交按钮 */}
        <br />
        <button
          onClick={submit} 
         >提交</button>
      </form>

      {/* 回答 */}
      <h4>回答</h4>
      {/* 自动换行 */}
      <p className="whitespace-pre-wrap">{answer}</p>
      <h4>格式化的答案, 使用openai function call 提取参数</h4>
      <ul>
        {formatAnswer.map((item, index) => {
          return (
            <li key={index}>
              <p>名称: {item.name}</p>
              <p>原因: {item.reason}</p>
              <p>分类: {item.category}</p>
            </li>
          )
        })}
      </ul>
    </main>
  );
}
