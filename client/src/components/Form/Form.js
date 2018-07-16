import React, { Component } from 'react';
import Input from './Input';

class Form extends Component {

  state = {
    errorMessage: undefined,
    successMessage: undefined,
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  }

  validateOnlyAlphabetAndMinChars = (n, str) => {

    if (typeof n !== 'number') {
      throw Error("Minimum chars is required");
    }
    const reg = new RegExp('^[a-zA-Z]{' + n + ',}$');
    return reg.test(str);
  }
  validatePhone = (n, str) => {
    if (typeof n !== 'number') {
      throw Error("Minimum digits is required");
    }
    const reg = new RegExp('^[0-9]{' + n + '}$');
    return reg.test(str);
  }
  validateMail = (str) => {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str);
  }

  trimValues = (str)=>{
    return str.trim();
  }


  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ errorMessage: '' });
    let { firstName, lastName, email, phone } = this.state;
    firstName = this.trimValues(firstName);
    lastName = this.trimValues(lastName);
    email = this.trimValues(email);
    phone = this.trimValues(phone);

    if (firstName === '' || lastName === '' || email === '' || phone === '') {
      //Just to make sure that required attr doesn't removed by malicious hands
      this.setState({ errorMessage: "all fields are required" });
      return false;
    }
    if (!this.validateOnlyAlphabetAndMinChars(2, firstName) || !this.validateOnlyAlphabetAndMinChars(2, lastName)) {
      this.setState({ errorMessage: "firstName Or lastName must contains at least two alphabet chars" });
      return false;
    }
    if (!this.validatePhone(10, phone)) {
      this.setState({ errorMessage: "Phone must contains at least 10 numbers" });
      return false;
    }
    if (!this.validateMail(email)) {
      this.setState({ errorMessage: "Invalid email" });
      return false;
    }
    const subject = 'New Lead';
    fetch('/contact', {
      method: 'POST',
      body: JSON.stringify({ subject, firstName, lastName, email, phone }),
      headers: {
        'content-type': 'application/json'
      }
    }).then(res => res.json()).then(json => {
      let errorMessage, successMessage;
      if (json.error) {
        errorMessage = json.error.errors.email.message;
      } else {
        errorMessage = undefined;
        successMessage = 'your message successfully sended';
        
        setTimeout(() => {
          this.setState({ successMessage: undefined, firstName: '', lastName: '', email: '', phone: '' });
        }, 3000);
      }
      this.setState({ successMessage, errorMessage, firstName, lastName, email, phone });
    }).catch(err => console.log("error:", err));
  }

  handleChange = (e) => {
    const target = e.target.name;
    const value = e.target.value;
    this.setState({ [target]: value });
  }

  render() {
    const { successMessage, errorMessage, firstName, lastName, email, phone } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Jones Form</h3>
        <div>
          <Input label={'First Name'} val={firstName} required={true} onChange={this.handleChange} name="firstName" />
        </div>
        <div>
          <Input label={'Last Name'} val={lastName} required={true} onChange={this.handleChange} name="lastName" />
        </div>
        <div>
          <Input label={'Mail Address'} val={email} required={true} onChange={this.handleChange} name="email" />
        </div>
        <Input label={'Phone Number'} val={phone} required={true} onChange={this.handleChange} name="phone" />
        <div>
          <input type="submit" value="Submit" required={true} onChange={this.handleChange} />
        </div>
        {errorMessage && <div className="mt-2 alert alert-danger">{errorMessage}</div>}
        {successMessage && <div className="mt-2 alert alert-success">{successMessage}</div>}
      </form>
    );
  }
}

export default Form;