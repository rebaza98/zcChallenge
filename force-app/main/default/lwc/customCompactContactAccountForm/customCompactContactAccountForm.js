import { LightningElement, api } from 'lwc';
import CONTACT_OBJECT from '@salesforce/schema/Contact'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
//CONTACT FIELDS AccountId
import FIRST_NAME_FIELD from '@salesforce/schema/Contact.FirstName'
import LAST_NAME_FIELD from '@salesforce/schema/Contact.LastName'
import TITLE_FIELD from '@salesforce/schema/Contact.Title'
import PHONE_FIELD from '@salesforce/schema/Contact.Phone'
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import ACCOUNT_FIELD from '@salesforce/schema/Contact.AccountId';


export default class CustomCompactContactAccountForm extends LightningElement {
    @api idwork
    @api showAccountContactForm
    contactId;
    firstName = '';
    lastName = '';
    title = '';
    phone = '';
    email = '';
    objectName = CONTACT_OBJECT
    validationFlag = true
    showSpinner = false
    handleFirstNameChange(event) {
        this.firstName = event.target.value;
    }
    handleLastNameChange(event) {
        this.lastName = event.target.value;
    }

    handleTitleChange(event) {
        this.title = event.target.value;
    }

    handlePhoneChange(event) {
        this.phone = event.target.value;
    }

    handleEmailChange(event) {
//        this.accountId = undefined;
        this.email = event.target.value;
    }

    createContactAccount(){
        this.validationFlag = true
        

        this.contactId = undefined;
        const fields = {};
        fields[FIRST_NAME_FIELD.fieldApiName] = this.firstName
        fields[LAST_NAME_FIELD.fieldApiName] = this.lastName
        fields[TITLE_FIELD.fieldApiName] = this.title
        fields[PHONE_FIELD.fieldApiName] = this.phone
        fields[EMAIL_FIELD.fieldApiName] = this.email
        fields[ACCOUNT_FIELD.fieldApiName] = this.idwork
        const recordInput = { apiName: CONTACT_OBJECT.objectApiName, fields}
        //VALIDATIONS

        const inputName = this.template.querySelector("[data-field=firstName]")
        const valueName = inputName.value
        if(valueName == ""){
            inputName.setCustomValidity("The Name can not be empty")
            inputName.reportValidity()
            this.validationFlag = false
            
        }

        const inputLastName = this.template.querySelector("[data-field=lastName]")
        const valueLastName = inputLastName.value
        if(valueLastName == ""){
            inputLastName.setCustomValidity("The Last Name can not be empty")
            inputLastName.reportValidity()
            this.validationFlag = false
            
        }
        
        if (this.validationFlag){
            this.showSpinner = true
            createRecord(recordInput)
            .then(contact =>{
                this.contactId = contact.id;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: "Contact Created Id:" + this.contactId,
                        variant: 'success',
                    }),
                );
                this.dispatchEvent(new CustomEvent('success'))
            })
            .catch(error => {
                console.log("ERROR = ", error)
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
        }
        
    }

    

  

    handleCancel(){
        this.dispatchEvent(new CustomEvent('cancel'))
        console.log("SHOULD CANCEL FROM CHILD")
        //this.showAccountContactForm = false
    }
}


