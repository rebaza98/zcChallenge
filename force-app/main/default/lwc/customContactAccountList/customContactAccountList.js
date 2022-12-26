import { LightningElement, wire, api, track } from 'lwc';
import getContactListFiltered from '@salesforce/apex/compactContactAccountController.getContactListFiltered';
import {refreshApex} from '@salesforce/apex';

export default class CustomContactAccountList extends LightningElement {
    @api recordId
    @api objectApiName
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
   successHandler(){
    refreshApex(this.wiredContactResult)
    this.showAccountContactForm = false;
    
   }
   cancelHandler(){
    this.showAccountContactForm = false;
   }



}