import React,{useState, useEffect} from 'react'
import MainForm from "./components/MainForm";
//require('dotenv').config()
function App() {
  const [dataQuestions,setDataQuestions] = useState()
    const [questions, setQuestions] = useState({
      question1: '',
      question2: '',
      question3: ''
    })
    const [emailData, setEmailData] = useState({
        userName: ''
    })
    const [dataUser, setDataUser] = useState({
        userName: '',
        postcode: '',
        emailUser: '',
        subject:'',//'The Subject Line is Pre-Filled and can be Edited',
        text:'',//'Users will see a pre-filled email and can edit it before sending. If the system administrator prefers, subject line and/or body text can made uneditable.'
        state:''
    })
    const [mp, setMp] = useState([])
    const [senator, setSenator] = useState([])
    const [states, setStates] = useState([])
    const [clientId] = useState('63eeadb6349fdc3da0069046')
   // const adanCID ='636dadcf2626f92aade6664a'
    const fetchData = async () => {
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        }
        const data = await fetch(`https://payload-demo-tpm.herokuapp.com/questions/?clientId=${clientId}`, requestOptions);
        const datos = await data.json()
        const totalDocs = datos.data.totalDocs
        const payload = datos.data.docs[0];
        const filtered = [];
        for (const key in payload) {
          if (key.startsWith("question")) {
            filtered.push(payload[key])
          }
        }
    if (totalDocs > 0) {
      setDataQuestions(filtered)
    }
    }
    useEffect(() => {
        fetchData()
        .catch((error)=>console.error(error))
//console.log(dataUser)
    },[])


    return(
        <MainForm
            dataQuestions={dataQuestions}
            setDataQuestions={setDataQuestions}
            setQuestions={setQuestions}
            questions={questions}
            setEmailData={setEmailData}
            emailData={emailData}
            dataUser={dataUser}
            setDataUser={setDataUser}
            mp={mp}
            setMp={setMp}
            senator={senator}
            setSenator={setSenator}
            clientId={clientId}
            states={states}
        />
    )

}

export default App;
