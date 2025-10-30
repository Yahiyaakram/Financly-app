import React, { useState, useEffect } from "react";
import Header from "../components/Header/Index";
import Cards from "../components/Cards";
import { Modal } from "antd";
import AddExpenseModal from "../components/Modals/addExpense";
import AddIncomeModal from "../components/Modals/addIncome";
import { toast } from "react-toastify";
import { db, auth } from "../firebase.js";
import { collection, addDoc, getDocs, query } from "firebase/firestore";
import moment from "moment";
import { useAuthState } from "react-firebase-hooks/auth";
import TransactionTable from "../components/TransactionTable/Index";
import ChartComponent from "../components/Charts";
import NoTransactions from "../components/NoTransaction.js";


const Dashboard = () => {
  // const transaction = [
  //   {
  //     type: "income",
  //     amount: 1200,
  //     tag: "salary",
  //     name: "Income 1",
  //     date: "2025",
  //   },

  //   {
  //     type: "expenses",
  //     amount: 600,
  //     tag: "food",
  //     name: "Income 1",
  //     date: "2025",
  //   },
  // ];

  const [transaction, setTransaction] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income , setIncome] = useState(0);
  const[expense , setExpense] = useState(0)
  const[totalExpense , setTotalExpense] = useState(0);
   const [currentBalance, setCurrentBalance] = useState(0);


  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };
  const onFinish = (values, type) => {
    console.log("On Finish: ", values, type);
    const newTransaction = {
      type: type,
      date: moment(values.date).format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if (!many) {
        toast.success("Transaction Added!");
      }
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) {
        toast.error("Couldn't add transaction");
      }
    }
  }
// ✅ Fetch Transactions
  async function fetchTransaction() {
    try {
      setLoading(true);
      if (user) {
        const q = query(collection(db, `users/${user.uid}/transactions`));
        const querySnapshot = await getDocs(q);
        let transactionArray = [];
        querySnapshot.forEach((doc) => {
          transactionArray.push(doc.data());
        });
        setTransaction(transactionArray);
        console.log("Transaction Array:", transactionArray);
        toast.success("Transactions fetched successfully");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Error fetching transactions");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Fetch when user is available
  useEffect(() => {
    if (user) {
      fetchTransaction();
     }
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transaction])


  const calculateBalance = ()=>{
    let incomeTotal = 0;
    let expenseTotal = 0;
    transaction.forEach((transaction) => {
      if(transaction.type === "income"){
        incomeTotal += transaction.amount;
      }else{
        expenseTotal += transaction.amount;
      }
    })

    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setCurrentBalance(incomeTotal - expenseTotal); 

  }


  let sortedTransaction = transaction.sort((a,b) => { 
        return new Date(a.date) - new Date(b.date);
  
  })
  




  return (
    <div>
      <Header />

      {loading ? (
        <p>Loading....</p>
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            currentBalance = {currentBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
          />

          {transaction.length !=0 ? <ChartComponent sortedTransaction={sortedTransaction}/> : <><NoTransactions/></>}

          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionTable transaction={transaction} addTransaction={addTransaction} fetchTransaction={fetchTransaction} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
