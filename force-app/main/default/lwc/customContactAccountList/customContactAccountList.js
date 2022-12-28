import { LightningElement, wire, api, track } from 'lwc';
import getContactListFiltered from '@salesforce/apex/compactContactAccountController.getContactListFiltered';
import {refreshApex} from '@salesforce/apex';
//OBJECT
import CONTACT_OBJECT from '@salesforce/schema/Contact'
//FIELDS
import FIRST_NAME_FIELD from '@salesforce/schema/Contact.FirstName'
import LAST_NAME_FIELD from '@salesforce/schema/Contact.LastName'
import TITLE_FIELD from '@salesforce/schema/Contact.Title'
import PHONE_FIELD from '@salesforce/schema/Contact.Phone'
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import ACCOUNT_FIELD from '@salesforce/schema/Contact.AccountId';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CustomContactAccountList extends LightningElement {
    @api recordId
    @api objectApiName
    contactObject = CONTACT_OBJECT
    showAccountContactForm = false
    contactList 
    wiredContactResult
    @wire(getContactListFiltered,{filterId:"$recordId"} )
    contactHandler(result){
        this.wiredContactResult = result
        if(result.data){
            this.contactList = result.data
        }
        if(result.error){
            console.error(result.error)
        }
        console.log("DATA ", result.data)
        console.log("ERROR ", result.error)
   }

   //NEW CONTACT
   newContactHandler(){
    this.showAccountContactForm = true
   }
   successHandler(event){
    refreshApex(this.wiredContactResult)
    this.showAccountContactForm = false;
    this.dispatchEvent(
        new ShowToastEvent({
            title: 'Success',
            message:`Contact ${event.detail.fields.FirstName.value} ${event.detail.fields.LastName.value} Created`,
            variant: 'success',
        }),
    );
    console.log("CVENET SUCCESS = ", event)
    
    
   }
   cancelHandler(){
    this.showAccountContactForm = false;
   }

   accountContactColumns = [
    //{ label:'Contact Id', fieldName:'Id', hideLabel:true},
    { label:'Name', fieldName:'Name', hideDefaultActions:true},
    { label:'Title', fieldName:'Title', hideDefaultActions:true},
    { label:'Email', fieldName:'Email', type:'email', hideDefaultActions:true},
    { label:'Phone', fieldName:'Phone', type:'phone', hideDefaultActions:true},
    
    ]

    //MODAL POP UP
    objectName = CONTACT_OBJECT
    
    
    fieldList = [FIRST_NAME_FIELD, LAST_NAME_FIELD, TITLE_FIELD, PHONE_FIELD, EMAIL_FIELD]

    submitHandler(event) {
        event.preventDefault(); 
        let fields = event.detail.fields;
        fields[ACCOUNT_FIELD.fieldApiName] = this.recordId //Force to link the current AccountID
        try {
            this.template.querySelector('lightning-record-form').submit(fields);
        }catch(error){
            new ShowToastEvent({
                title: 'Error',
                message:'Something happened please try again',
                variant: 'error',
            })
        }
        
    }
 


}