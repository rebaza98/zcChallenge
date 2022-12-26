public with sharing class compactContactAccountController {
    // public compactContactAccountController() {

    // }
    @AuraEnabled(cacheable=true)    
    Public static List<Account> getAccountList(){
        return [SELECT Id, Name, Type, Industry from Account LIMIT 5];

    }

    @AuraEnabled(cacheable=true)    
    Public static List<Contact> getContactListFiltered(String filterId ){
        return [SELECT Id, Name, Title, AccountId, Email, Phone from Contact where AccountId =:filterId LIMIT 10];

    }
}
