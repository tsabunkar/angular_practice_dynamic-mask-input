import { Component, DoCheck } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {


  signUpForm: FormGroup;

  ngOnInit() {
    this.signUpForm = new FormGroup({
      displayformat: new FormControl(),
      startingnumber: new FormControl(),
      quantity: new FormControl(),
      incrementby: new FormControl(),
      vouchernumber: new FormControl(),

    });

  }

  _displayFomratkeyPress(event: Event) {

    const pattern = /[0-9A-Za-z#-]/;
    let inputChar = String.fromCharCode(event['charCode']);

    if (!pattern.test(inputChar)) { // invalid character, prevent input
      event.preventDefault();
    }

  }




  checkAllSameHashCharacter = (element: string) => {

    let c1 = element.charAt(0);
    if (c1 !== '#') { //first character must be '#'
      return false;
    }
    for (let i = 1; i < element.length; i++) {
      let temp = element.charAt(i);
      if (c1 !== temp) {
        //if chars does NOT match, just return false from here itself, there is no need to verify other chars
        return false;
      }
    }
    //As it did NOT return from above if (inside for) it means, all chars matched, so return true
    return true;

  }



  validateStartingNumberWithDisplayFormat = (startingNumberControl, hashes: string) => {

    if (startingNumberControl.toString().length === hashes.length) { //length of startingNumberControl is same as lastElem masked # from displayformat so no need of appending zeores
      console.log('Valid starting number and display format');
      hashes = startingNumberControl;
      return hashes;

    }
    else if (startingNumberControl.toString().length < hashes.length) {//toString() -> To get the length of number entered in startingNumberControl field
      console.log('need to append zeros at front');
      let startingNumberControlString = startingNumberControl.toString();
      let appendedZeroesStartingNumber = startingNumberControlString.padStart(hashes.length, '0');
      hashes = appendedZeroesStartingNumber;
      return hashes;

    } else {
      //need to change the starting number length as it is greater than lastElem masked # from displayformat
      console.log('wrong starting number field');
      //Invalid starting number (either change the display format or starting number length)
      return null
    }

  }


  removeMulipleHashesToSingleHashInString = (displayFormatControl): string => {
    let displayFormatSubStringArray: string[] = displayFormatControl.split("-");

    for (let index = 0; index < displayFormatSubStringArray.length; index++) { //to remove substring which contains multiple hashes with single hash
      if (displayFormatSubStringArray[index].charAt(0) === '#') {
        displayFormatSubStringArray[index] = '#';
      }
    }

    return displayFormatSubStringArray.join('-');
  }


  generateVouchersArray =
    (displayFormateSubStringElem, startingNumberControl, validSingleStartingNumber, displayFormatStringWithSingleHash): string[] => {

      /* let quantityVal: number = 10;
      let incrementVal: number = 1; */

      let quantityVal = +this.signUpForm.get('quantity').value;
      let incrementVal = +this.signUpForm.get('incrementby').value;
      // console.log(quantityVal, incrementVal);

      let numberOfZeroesToBeAppendToVouchers: number = displayFormateSubStringElem.length - startingNumberControl.toString().length;
      let vouchersArray: string[] = new Array<string>();


      for (let index = 0; index < quantityVal; index++) {

        if (numberOfZeroesToBeAppendToVouchers === 0) {

          let eachVoucherNumber: string = validSingleStartingNumber + incrementVal * index;//validSingleStartingNumber-> string  ('12'+2*3)-> "126"
          if (eachVoucherNumber.toString().length == displayFormateSubStringElem.length) {// if display format is ### and starting number 999 then increment by 1-> 1000 which means starting number is exceeding the length of display format
            // console.log('====', displayFormatStringWithSingleHash.replace('#', eachVoucherNumber.toString()));
            vouchersArray.push(displayFormatStringWithSingleHash.replace('#', eachVoucherNumber.toString()))
          }
          else {
            // console.log('%%%%', 'while generating vouchers the length of voucher number exceeded the display format');
            break;
          }

        }
        else if (numberOfZeroesToBeAppendToVouchers > 0) {
          let eachVoucherNumber: number = +validSingleStartingNumber + incrementVal * index; //validSingleStartingNumber -> number
          let eachVoucherNumberString: string = eachVoucherNumber.toString();
          let vouchersNumberWithAppendedZeroes = eachVoucherNumberString.padStart(displayFormateSubStringElem.length, '0');
          // console.log('****', displayFormatStringWithSingleHash.replace('#', vouchersNumberWithAppendedZeroes));
          vouchersArray.push(displayFormatStringWithSingleHash.replace('#', vouchersNumberWithAppendedZeroes));
        }

      }//end of for loop

      return vouchersArray;

    }


  onClickOfSequentialGenerateVouchers() {
    let displayFormatControl = this.signUpForm.get('displayformat').value;
    let startingNumberControl = +this.signUpForm.get('startingnumber').value;
    let resultantArray_ElementSplitedWithHiphen_DisplayFormat: string[] = displayFormatControl.split("-");
    let doesDisplayFormatHasValidHashes: boolean = false;

    resultantArray_ElementSplitedWithHiphen_DisplayFormat.forEach((displayFormatSubStringElem: string) => {

      if (displayFormatSubStringElem.charAt(0) === '#') {//first character must be '#', if so then only goto allSameCharacter() func
        doesDisplayFormatHasValidHashes = this.checkAllSameHashCharacter(displayFormatSubStringElem);
      }
    })

    if (doesDisplayFormatHasValidHashes) {//true (display format has valid substring of hashes ex- ab-###-cd)
      resultantArray_ElementSplitedWithHiphen_DisplayFormat.forEach((displayFormatSubStringElem: string) => {

        if (displayFormatSubStringElem.charAt(0) === '#') {//this element must be replcaed with Starting number  but starting number length shld match with display format hashes
          let validSingleStartingNumber = this.validateStartingNumberWithDisplayFormat(startingNumberControl, displayFormatSubStringElem);

          if (validSingleStartingNumber != null) {

            let displayFormatStringWithSingleHash = this.removeMulipleHashesToSingleHashInString(displayFormatControl);
            let vouchersArray: string[] = this.generateVouchersArray(displayFormatSubStringElem, startingNumberControl, validSingleStartingNumber, displayFormatStringWithSingleHash)
            console.log(vouchersArray);
          }//end of if()
        }
      })
    } else { //(display format has valid substring of hashes ex- ab-###2-cd)

      console.log('Invalid display format');
    }
  }


  _voucherNumberPress(event: Event) {

    const pattern = /[0-9,]/;
    let inputChar = String.fromCharCode(event['charCode']);

    if (!pattern.test(inputChar)) { // invalid character, prevent input
      event.preventDefault();
    }

  }


  removeEmptyElementsFromArray = (vouchersArray: string[]) => {
    let temp = [];

    for (let i of vouchersArray)
      i && temp.push(i); // copy each non-empty value to the 'temp' array

    vouchersArray = temp;
  }

  onClickOfNonSequentialGenerateVouchers() {
    let vouchernumberControl = this.signUpForm.get('vouchernumber').value;

    console.log(vouchernumberControl);

    let vouchersArray: string[] = vouchernumberControl.split(',');
    this.removeEmptyElementsFromArray(vouchersArray);

    console.log(vouchersArray);

  }


}