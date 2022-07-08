import {Component} from "react";
import {contactStore, getContactStorage, getCurrentDate, getDataById, findMaxId} from "../util/";
import {confirm} from "react-confirm-box";

class ContactList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            name: '',
            phone: '',
            email: '',
            action: 'Save',
            errors: {
                name: '',
                phone: '',
                email: ''
            },
        }
    }

    tableTrDataRender = getContactStorage().map((data, index) => {
            return (
                <tr key={index}>
                    <td>{++index}</td>
                    <td>{data.name}</td>
                    <td>{data.phone}</td>
                    <td>{data.email}</td>
                    <td>{data.date}</td>
                    <td>
                        <button className="btn-success" onClick={() => this.editInfo(data.id)}>Edit</button>
                        <button className="btn-danger" onClick={() => this.deleteInfo(data.id)} >Delete</button>
                    </td>
                </tr>
            )
        }
    )

    tableColumns = ['#', 'Name', 'Phone', 'Email', 'Date', '']
    tableColumnsRender = this.tableColumns.map(tableColum => {
            return (<th key={tableColum}>{tableColum}</th>)
        }
    )

    eventHandler = (event) => this.setState({ [event.target.id]: event.target.value });

    editInfo = (id) => {
        let contact = getDataById(id)
        this.setState({
            id: contact.id,
            name: contact.name,
            phone: contact.phone,
            email: contact.email,
            action: 'Update',
            errors: {
                name: '',
                phone: '',
                email: ''
            },
        })
    }

    saveInfo = (event) => {
        event.preventDefault();
        let errors = { ...this.state.errors };
        errors.name = '';
        errors.phone = '';
        errors.email = '';

        this.validationRequiredFields(['name', 'phone', 'email'], errors);
        this.validationValidFields(['phone', 'email'], errors)
        this.validationExistValues(['phone', 'email'], errors);

        if (errors.name.length === 0
            && errors.phone.length === 0
            && errors.email.length === 0) {
            if (this.state.action === 'Update') {
                this.updateContact();
            } else {
                this.createContact();
            }
            window.location.reload();
        }

        this.setState({
            errors
        })
    }

    validationRequiredFields = (fields, errors) => {
        fields.map(field => {
            let inputValue = document.getElementById(field).value.trim();
            if (inputValue.length === 0) {
                errors[field] = `Field ${field} is required!`;
            }
        })
    }

    validationValidFields = (fields, errors) => {
        const regExp = RegExp(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/);
        const rePhone = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
        fields.map(field => {
            let inputValue = document.getElementById(field).value.trim();
            if (inputValue.length > 0) {
                if (field === 'email' && !regExp.test(inputValue)) {
                    errors[field] = `Field ${field} is invalid!`;
                }
                if (field === 'phone' && !rePhone.test(inputValue)) {
                    errors[field] = `Field ${field} is invalid!`;
                }
            }
        })
    }

    validationExistValues = (fields, errors) => {
        const id = this.state.id;
        fields.map(field => {
            let inputValue = document.getElementById(field).value.trim();
            if (inputValue.length > 0) {
                let contacts = getContactStorage();
                if (field === 'email'
                    && contacts.filter(el => el.email === inputValue && el.id !== id).length > 0) {
                    errors[field] = `${inputValue} is already exist!`;
                }
                if (field === 'phone'
                    && contacts.filter(el => el.phone === inputValue && el.id !== id).length > 0) {
                    errors[field] = `${inputValue} is already exist!`;
                }
            }
        })
    }

    createContact = () => {
        let contacts = getContactStorage();
        const data = {
            id: findMaxId() + 1,
            name: this.state.name,
            phone: this.state.phone,
            email: this.state.email,
            date: getCurrentDate()
        };
        contacts.push(data)
        localStorage.setItem(contactStore, JSON.stringify(contacts));
    }

    updateContact = () => {
        let contacts = getContactStorage();
        contacts.map((contact, index) => {
            if (contact.id === this.state.id){
                contacts[index] = {
                    id: this.state.id,
                    name: this.state.name,
                    phone: this.state.phone,
                    email: this.state.email,
                    date: getCurrentDate()
                };
            }

            return contact
        })

        localStorage.setItem(contactStore, JSON.stringify(contacts));
    }

    deleteInfo = async (id) => {
        let email = getDataById(id).email;
        const result = await confirm(`Are you sure to delete email: ${email}?`)
        if (result) {
            let filtered = getContactStorage().filter(function(el) { return el.id != id; });
            localStorage.setItem(contactStore, JSON.stringify(filtered));
        }
        window.location.reload();
    }

    render() {
        const { errors, id, name, phone, email, action } = this.state;
        return (
            <>
                <div className="wrapper">
                    <form action="" id="form" className="form">
                        <div className={errors.name.length > 0 ? "form-control error" : "form-control"}>
                            <input type="text" id="name"
                                   name="name"
                                   value={name}
                                   placeholder="Name"
                                   onChange={this.eventHandler} />
                            {errors.name.length > 0 && (
                                <small>{errors.name}</small>
                            )}
                        </div>
                        <div  className={errors.phone.length > 0 ? "form-control error" : "form-control"}>
                            <input type="phone" id="phone"
                                   placeholder="(123) 456-7890"
                                   value={phone}
                                   onChange={this.eventHandler} />
                            {errors.phone.length > 0 && (
                                <small>{errors.phone}</small>
                            )}
                        </div>
                        <div  className={errors.email.length > 0 ? "form-control error" : "form-control"}>
                            <input type="text" id="email"
                                   placeholder="jonh@example.com"
                                   value={email}
                                   onChange={this.eventHandler} />
                            {errors.email.length > 0 && (
                                <small>{errors.email}</small>
                            )}
                        </div>
                        {action === 'Update' && (
                            <a href="/" className="btn-info">Cancel</a>
                        )}
                        <button type="submit" className="btn-success" onClick={this.saveInfo} value="Save" id="submit">{action}</button>
                        <input type="hidden" name="index" id="index" value={id}/>
                    </form>
                </div>
                <table className="list-info">
                    <thead>
                    <tr>
                        {this.tableColumnsRender}
                    </tr>
                    </thead>
                    <tbody>
                    {this.tableTrDataRender.length === 0 && (
                        <tr><td colSpan="6" className="no-record">No record in local storage</td></tr>
                    )}
                    {this.tableTrDataRender}
                    </tbody>
                </table>
            </>
        );
    }
}

export default ContactList;