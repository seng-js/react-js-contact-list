import {Component} from "react";
import {confirm} from "react-confirm-box";

class ContactList extends Component {
    contactStore = 'contact-info';
    getContactStorage = () => {
        if (localStorage.getItem(this.contactStore) != null) {
            return JSON.parse(localStorage.getItem(this.contactStore));
        }

        return [];
    }

    constructor(props) {
        super(props)

        let index = 1;
        const tableTrDataRender = this.getContactStorage().map(d => {
                return (
                    <tr>
                        <td>{index++}</td>
                        <td>{d.name}</td>
                        <td>{d.phone}</td>
                        <td>{d.email}</td>
                        <td>{d.date}</td>
                        <td>
                            <button className="btn-success" onClick={() => this.editInfo(d.id)}>Edit</button>
                            <button className="btn-danger" onClick={() => this.deleteInfo(d.id)} >Delete</button>
                        </td>
                    </tr>
                )
            }
        )

        const tableColumns = ['#', 'Name', 'Phone', 'Email', 'Date', '']
        const tableColumnsRender = tableColumns.map(tableColum => {
                return (<th>{tableColum}</th>)
            }
        )

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
            tableHeader: tableColumnsRender,
            tableTr: tableTrDataRender
        }

    }

    eventHandler = e => this.setState({ [e.target.id]: e.target.value });

    editInfo = (id) => {
        let contact = this.getDataById(id)
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

        if (errors.name.length == 0
            && errors.phone.length == 0
            && errors.email.length == 0) {
            if (this.state.action == 'Update') {
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
            if (inputValue.length == 0) {
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
                if (field == 'email' && !regExp.test(inputValue)) {
                    errors[field] = `Field ${field} is invalid!`;
                }
                if (field == 'phone' && !rePhone.test(inputValue)) {
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
                let contacts = this.getContactStorage();
                if (field == 'email'
                    && contacts.filter(el => el.email == inputValue && el.id !== id).length > 0) {
                    errors[field] = `${inputValue} is already exist!`;
                }
                if (field == 'phone'
                    && contacts.filter(el => el.phone == inputValue && el.id !== id).length > 0) {
                    errors[field] = `${inputValue} is already exist!`;
                }
            }
        })
    }

    createContact = () => {
        let contacts = this.getContactStorage();
        const data = {
            id: contacts.length + 1,
            name: this.state.name,
            phone: this.state.phone,
            email: this.state.email,
            date: this.getCurrentDate()
        };
        contacts.push(data)
        localStorage.setItem(this.contactStore, JSON.stringify(contacts));
    }

    updateContact = () => {
        let contacts = this.getContactStorage();
        contacts.map((contact, index) => {
            if (contact.id === this.state.id){
                contacts[index] = {
                    id: this.state.id,
                    name: this.state.name,
                    phone: this.state.phone,
                    email: this.state.email,
                    date: this.getCurrentDate()
                };
            }

            return contact
        })

        localStorage.setItem(this.contactStore, JSON.stringify(contacts));
    }

    deleteInfo = async (id) => {
        let email = this.getDataById(id).email;
        const result = await confirm(`Are you sure to delete email: ${email}?`)
        if (result) {
            let filtered = this.getContactStorage().filter(function(el) { return el.id != id; });
            localStorage.setItem(this.contactStore, JSON.stringify(filtered));
        }
        window.location.reload();
    }

    getDataById = (id) => {
        return this.getContactStorage().filter(el => el.id === id)[0];
    }

    getCurrentDate = () => {
        let date = new Date();
        return date.getFullYear() + '/' +
            ('00' + (date.getMonth() + 1)).slice(-2) + '/' +
            ('00' + date.getDate()).slice(-2) + ' ' +
            ('00' + date.getHours()).slice(-2) + ':' +
            ('00' + date.getMinutes()).slice(-2);
    }

    render() {
        const { errors } = this.state;
        return (
            <>
                <div className="wrapper">
                    <form action="" id="form" className="form">
                        <div className={errors.name.length > 0 ? "form-control error" : "form-control"}>
                            <input type="text" id="name"
                                   name="name"
                                   value={this.state.name}
                                   placeholder="Name"
                                   onChange={this.eventHandler} />
                            {errors.name.length > 0 && (
                                <small>{errors.name}</small>
                            )}
                        </div>
                        <div  className={errors.phone.length > 0 ? "form-control error" : "form-control"}>
                            <input type="phone" id="phone"
                                   placeholder="(123) 456-7890"
                                   value={this.state.phone}
                                   onChange={this.eventHandler} />
                            {errors.phone.length > 0 && (
                                <small>{errors.phone}</small>
                            )}
                        </div>
                        <div  className={errors.email.length > 0 ? "form-control error" : "form-control"}>
                            <input type="text" id="email"
                                   placeholder="jonh@example.com"
                                   value={this.state.email}
                                   onChange={this.eventHandler} />
                            {errors.email.length > 0 && (
                                <small>{errors.email}</small>
                            )}
                        </div>
                        {this.state.action == 'Update' && (
                            <a href="/" className="btn-info">Cancel</a>
                        )}
                        <button type="submit" className="btn-success" onClick={this.saveInfo} value="Save" id="submit">{this.state.action}</button>
                        <input type="hidden" name="index" id="index" value={this.state.id}/>
                    </form>
                </div>
                <table id="list-info" className="list-info">
                    <thead>
                    <tr>
                        {this.state.tableHeader}
                    </tr>
                    </thead>
                    <tbody>{this.state.tableTr}</tbody>
                </table>
            </>
        );
    }
}

export default ContactList;