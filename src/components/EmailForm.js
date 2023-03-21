import React, { useState,useEffect } from "react";
import Button from "react-bootstrap/cjs/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Col from "react-bootstrap/cjs/Col";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import Loader from "react-loader-spinner";

const EmailForm = ({
  setShowThankYou,
  setShowFindForm,
  dataUser,
  setDataUser,
  showEmailForm,
  setShowEmailForm,
  emailData,
  setEmailData,
  clientId,
  user,
  setUser,
  questions,
  setQuestions,
  dataQuestions,
  setDataQuestions
}) => {
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(false);
  const [showLoadSpin, setShowLoadSpin] = useState(false);
 
  const handleQuestions = (e) => {
    setQuestions({
      ...questions,
      [e.target.name]: e.target.value
      .replace(/\n\r?/g, "<br/>")
      .replace(/#/g, " ")
    });
    //console.log(e.target.value);
    //console.log(questions);
  }
  const handleUser = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
    setDataUser({
      ...dataUser,
      [e.target.name]: e.target.value,
    })
    //console.log(e.target.value);
    //console.log(user);
  }
  const handleChange = (e) => {
    e.preventDefault();
    setDataUser({
      ...dataUser,
      [e.target.name]: e.target.value
        .replace(/\n\r?/g, "<br/>")
        .replace(/#/g, " "),
    });
    setEmailData({
      ...dataUser,
      ...emailData,
      [e.target.name]: e.target.value
        .replace(/\n\r?/g, "<br/>")
        .replace(/#/g, " "),
    });
  };
  const { firstName, lastName, email, subject } = user;
  const correoEnviado = (respuestaDeExito, user, emailData) => {
    axios.post(
      `https://payload-demo-tpm.herokuapp.com/leads?&firstName=${
        user.firstName ? user.firstName : ""
      }&postalcode=${
        emailData.postcode ? emailData.postcode : ""
      }&emailData=${emailData.emailUser}&representative=${
        emailData.name
      }&city=${emailData.state}&party=${
        emailData.party
      }&clientId=${clientId}&sended=${respuestaDeExito}`
    );
  };
  function validateObject(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (!value || value === '') {
          return false;
        }
      }
    }
    return true;
  }
  const send = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
 //console.log(validateObject(questions))
 const ask = validateObject(questions)
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);
    if (
      email.trim() === '' || lastName.trim() === '' || 
      firstName.trim() === ""  || ask === false  || subject.trim() === ''
    ) {
      setError(true);
      return;
    }
    setError(false);
    //const name = dataUser.userName.split(' ')
    //console.log(dataUser.text.replace(/\n\r?/g, "<br/>"))
    const payload = await axios
    .post(
      `https://payload-demo-tpm.herokuapp.com/email-builder?questions=${JSON.stringify(
        questions
      )}&user=${JSON.stringify(user)}`
    )
    await setShowLoadSpin(false);
    if (payload.status === 200) {
      correoEnviado("Si", user, emailData );
      setShowEmailForm(true);
      setShowThankYou(false);
      dataUser.id = "";
    }
    if (payload.status !== 200) {
      correoEnviado("No",  user, emailData );
      return (
        <Alert>
          The mail has not been sent successfully, please try again late
          <Button
            className={"button-email-form"}
            variant={"dark"}
            onClick={back}
          >
            Back
          </Button>
        </Alert>
      );
    }
  };
  const back = (e) => {
    e.preventDefault();
    setShowFindForm(false);
    setShowEmailForm(true);
  };
  //console.log("emailData", emailData);
  //console.log(dataUser, "data user");
  return (
    <div className={"emailContainer"} hidden={showEmailForm}>
      {error ? (
        <Alert variant={"danger"}>
          All fields are required!
        </Alert>
      ) : null}
      <Form onSubmit={send} noValidate validated={validated}>
        <div className={"formEmail"}>
          <Col>
            <Form.Group controlId="name">
              <Form.Label>*Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                name="firstName"
                onChange={handleUser}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="lastName">
              <Form.Label>*Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Last Name"
                name="lastName"
                onChange={handleUser}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="email">
              <Form.Label>*Email</Form.Label>
              <Form.Control
                type="email"
                placeholder={emailData.emailUser}
                onChange={handleUser}
                name="emailUser"
                readOnly
              />
            </Form.Group>
          </Col>
        </div>
        <Col>
          <Form.Label>To: MP's Information</Form.Label>
        </Col>
        <div className={"formEmail"}>
          <Col>
            <Form.Group>
              <Form.Control
                as={"input"}
                readOnly
                type="text"
                placeholder={emailData.name}
                name="nameTo"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Control
                as={"input"}
                readOnly
                type="text"
                placeholder={`${emailData.state}`}
                name="state-city"
              />
            </Form.Group>
          </Col>
        </div>
        <div className="input-subject">
          <Col>
            <Form.Group>
              <Form.Label>Subject Line:</Form.Label>
              <Form.Control
                onChange={handleUser}
                as="input"
                type="text"
                name="subject"
                defaultValue={questions.subject}
              />
            </Form.Group>
          </Col>
          </div>
      <div>
      {
        dataQuestions ? dataQuestions.map((key,value) => ( 
          <Col className="questions">
          <Form.Group>
            <Form.Label> {key} </Form.Label>
            <Form.Control
              onChange={handleQuestions}
              as="textarea"
              type="text-area"
              name={`question${value + 1}`}
              required
            />
          </Form.Group>
        </Col>
          
          )) :  null
      }
        </div>
        <Loader
          visible={showLoadSpin}
          type="Puff"
          color="#000000"
          height={100}
          width={100}
          timeout={5000} //5 secs
        />
      </Form>
      
      <div className={"container buttons-container-email-form"}>
        <Button
          type={"submit"}
          className={"button-email-form"}
          variant={"dark"}
          onClick={send}
        >
          Send
        </Button>
        <Button className={"button-email-form"} variant={"dark"} onClick={back}>
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default EmailForm;
