import React from 'react';
import { Line , Pie } from '@ant-design/charts';
import "./Styles.css";

const ChartComponent = ({sortedTransaction}) => {

   const data = sortedTransaction.map((item) => ({
    date: item.date,
    amount: item.amount,
  }));

    const spendingDataArray = sortedTransaction.filter((transaction)=>{
        if(transaction.type == "expense"){
            return {tag: transaction.tag , amount:transaction.amount}

        }
    })

    // return { balanceData, spendingDataArray };
  let finalSpendings =  spendingDataArray.reduce((acc , obj) => {
    let key = obj.tag;
    if(!acc[key]){
        acc[key] = {tag: obj.tag , amount:obj.amount}
    }else{
        acc[key].amount += obj.amount;
    }
    return acc;
  } ,{})

  let newSpendings = [
    {tag: "food" , amount: 0},
    {tag: "education" , amount: 0},
    {tag: "office" , amount: 0},

  ]

  spendingDataArray.forEach((item)=>{
    if(item.tag == "food"){
        newSpendings[0].amount += item.amount 
    } else if(item.tag == "education"){
        newSpendings[1].amount += item.amount 
    }else{
        newSpendings[2].amount += item.amount 
    }
  })


   const config = {
    data: data,
    width: 600,
    // height: 400,
    autoFit: true,
    xField: 'date',
    yField: 'amount',
    
    }

    const spendingConfig = {
    data: newSpendings,
    width:500,
    angleField: "amount",
    colorField: "tag",
  };
  

  
  let chart;
  let pieChart;
  
  return (

    <div className="charts-wrapper">
    <div> 
        <h1>Your Analytics</h1>
        <Line {...config} onReady={(chartInstance) => (chart = chartInstance)} /> 

    </div>

    <div>
        <h2>Your Spendings</h2>
        <Pie {...{ ...spendingConfig, data: spendingDataArray }} />
    </div>
    </div>
  )
}


export default ChartComponent
