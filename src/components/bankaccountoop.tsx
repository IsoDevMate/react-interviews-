//  //create an abstract base class
// abstract class bankAccount {
//   constructor(
//     public user: User,
//     public Account: Account,
//   ) {
//     this.user._id = Math.random().toString(36).substring(2, 9);
//     this.user.age = 18;
//     this.user.gender = 'male';
//     this.user.account_Details.account_type = 'normal';
//     this.user.account_Details.status = 'inactive';
//     this.user.account_Details.id = bankAccount.generateTypedAccountNumber('ACC');
//   }

//   static generateTypedAccountNumber = (prefix: string = 'ACC'): string => {

//     const digits = Math.floor(Math.random() * 90000000) + 10000000;
//     return `${prefix}-${digits}`;
//   };

//     get userId(): string{
//         return
//     }


// }
// //interfaces
// interface User {
//     _id:string
//     age: number
//     gender: "male" | "female"
//     account_Details: Account
// }

// interface Account{
//     account_type: "savings" | "normal"
//     balance: number
//     id: string
//     status: "active" | "inactive" | "banned"
//     readonly created_At:Date

// //inheritance Types


// }



//Assisted solution
// @FileName: bank-account-system.ts

//  abstract base class
abstract class BankAccount {
  // Properties and methods will go here
}

// We'll have two concrete implementations
class CheckingAccount extends BankAccount {
  // Checking account specific functionality
}

class SavingsAccount extends BankAccount {
  // Savings account specific functionality
}
