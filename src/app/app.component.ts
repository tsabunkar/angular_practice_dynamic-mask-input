import { Component, DoCheck } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  /*   public myModel = ''
    public myModel1 = ''
    public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    public mask1 = ['(', /[0-9#a-z]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
   */


  public mask2 = []

  signUpForm: FormGroup;

  ngOnInit() {
    this.signUpForm = new FormGroup({
      displayformat: new FormControl(),
      startingnumber: new FormControl(),
      /*  quantitynumber: new FormControl(),
       incrementnumber: new FormControl(), */
    });

  }

  temp: string;
  _keyPress(event: Event) {

    const pattern = /[0-9A-Za-z#-]/;
    let inputChar = String.fromCharCode(event['charCode']);

    if (!pattern.test(inputChar)) { // invalid character, prevent input
      event.preventDefault();
    }
    /*     else { //valid characters is in else block
          console.log(inputChar);
          this.temp = inputChar+''+inputChar
          console.log(this.temp);
        } */
  }





  generateVouchersWithMasking() {

    let displayFormatControl = this.signUpForm.get('displayformat').value;
    let startingNumberControl = +this.signUpForm.get('startingnumber').value;//assuming that starting number would be number(which might not be true)

    let resultantArray: any[] = displayFormatControl.split("-");
    // let lastElement: string = resultantArray[resultantArray.length - 1];
    resultantArray.splice(resultantArray.length - 1, 1);
    resultantArray.push(startingNumberControl)
    let newArrayElem = resultantArray.join('-')
    console.log(newArrayElem);
  }


  generateVouchersWithOutMasking() {

    let displayFormatControl = this.signUpForm.get('displayformat').value;
    let startingNumberControl = +this.signUpForm.get('startingnumber').value;

    let resultantArray: any[] = displayFormatControl.split("-");
    // let lastElement: string = resultantArray[resultantArray.length - 1];
    let lastElement: string = resultantArray[resultantArray.length - 1];
    console.log(lastElement.length);


    let logicToGenerateVoucher = () => {
      resultantArray.splice(resultantArray.length - 1, 1); //removed lastElement with ####
      resultantArray.push(startingNumberControl);//adding new element which is entered in starting number
      let newArrayElem = resultantArray.join('-');//joining the array to form a string
      console.log(newArrayElem);
    }


    if (startingNumberControl.toString().length === lastElement.length) { //length of startingNumberControl is same as lastElem masked # from displayformat
      //so no need of appending zeores
      console.log('no need to append zeros at front');
      //!task is to generate vouchers with prefix of character other than #
      logicToGenerateVoucher();

    }
    else if (startingNumberControl.toString().length < lastElement.length) {//toString() -> To get the length of number entered in startingNumberControl field
      console.log('need to append zeros at front');
      let numberOfZeroesToAppend = lastElement.length - startingNumberControl.toString().length;
      console.log(numberOfZeroesToAppend);

      var appendedZeroesStartingNumber = startingNumberControl + "";
      while (numberOfZeroesToAppend != 0) {
        appendedZeroesStartingNumber = "0" + appendedZeroesStartingNumber;
        numberOfZeroesToAppend--;
      }

      console.log('++');
      console.log(appendedZeroesStartingNumber);
      resultantArray.splice(resultantArray.length - 1, 1);

      resultantArray.push(appendedZeroesStartingNumber)
      let newArrayElem = resultantArray.join('-')
      console.log(newArrayElem);

    } else {
      //need to change the starting number length as it is greater than lastElem masked # from displayformat
      console.log('wrong starting number field');
      //Invalid starting number (either change the display format or starting number length)
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



  /*   generateVouchers = (displayFormatStringWithSingleHash,startingNumberControl ) => {
      let numberOfZeroesToBeAppendToVouchers: number = element.length - startingNumberControl.toString().length;
  
      for (let index = 0; index < quantityVal; index++) {
  
        if (numberOfZeroesToBeAppendToVouchers === 0) {
          let eachVoucherNumber: string = validSingleStartingNumber + incrementVal * index;//validSingleStartingNumber-> string  ('12'+2*3)-> "126"
  
          if (eachVoucherNumber.toString().length == element.length) {// if display format is ### and starting number 999 then increment by 1-> 1000 which means starting number is exceeding the length of display format
            console.log('====', displayFormatStringWithSingleHash.replace('#', eachVoucherNumber.toString()));
          }
          else {
            console.log('%%%%', 'while generating vouchers the length of voucher number exceeded the display format');
            break;
          }
  
        }
        else if (numberOfZeroesToBeAppendToVouchers > 0) {
          let eachVoucherNumber: number = +validSingleStartingNumber + incrementVal * index; //validSingleStartingNumber -> number
          let eachVoucherNumberString: string = eachVoucherNumber.toString();
          let vouchersNumberWithAppendedZeroes = eachVoucherNumberString.padStart(element.length, '0');
          console.log('****', displayFormatStringWithSingleHash.replace('#', vouchersNumberWithAppendedZeroes));
  
        }
  
      }
    } */


  generateVouchersWithOutMasking2() {

    let displayFormatControl = this.signUpForm.get('displayformat').value;
    let startingNumberControl = +this.signUpForm.get('startingnumber').value;

    let resultantArray_ElementSplitedWithHiphen_DisplayFormat: string[] = displayFormatControl.split("-");

    console.log('resultantArray_ElementSplitedWithHiphen', resultantArray_ElementSplitedWithHiphen_DisplayFormat);

    let doesDisplayFormatHasValidHashes: boolean = false;

    resultantArray_ElementSplitedWithHiphen_DisplayFormat.forEach((displayFormateSubStringElem: string) => {
      console.log(displayFormateSubStringElem);

      if (displayFormateSubStringElem.charAt(0) === '#') {//first character must be '#', if so then only goto allSameCharacter() func
        doesDisplayFormatHasValidHashes = this.checkAllSameHashCharacter(displayFormateSubStringElem);
      }

    })

    console.log('doesDisplayFormatHasValidHashes', doesDisplayFormatHasValidHashes);

    if (doesDisplayFormatHasValidHashes) {//true
      console.log(resultantArray_ElementSplitedWithHiphen_DisplayFormat);


      resultantArray_ElementSplitedWithHiphen_DisplayFormat.forEach((displayFormateSubStringElem: string) => {

        if (displayFormateSubStringElem.charAt(0) === '#') {//this element must be replcaed with Starting number  but starting number length shld match with display format hashes
          let validSingleStartingNumber = this.validateStartingNumberWithDisplayFormat(startingNumberControl, displayFormateSubStringElem);

          console.log('validSingleStartingNumber', validSingleStartingNumber);
          if (validSingleStartingNumber != null) {

            let quantityVal: number = 10;
            let incrementVal: number = 1;

            console.log('Before appending or prepending');

            let displayFormatStringWithSingleHash = this.removeMulipleHashesToSingleHashInString(displayFormatControl);

            let numberOfZeroesToBeAppendToVouchers: number = displayFormateSubStringElem.length - startingNumberControl.toString().length;

            for (let index = 0; index < quantityVal; index++) {

              if (numberOfZeroesToBeAppendToVouchers === 0) {
                let eachVoucherNumber: string = validSingleStartingNumber + incrementVal * index;//validSingleStartingNumber-> string  ('12'+2*3)-> "126"

                if (eachVoucherNumber.toString().length == displayFormateSubStringElem.length) {// if display format is ### and starting number 999 then increment by 1-> 1000 which means starting number is exceeding the length of display format
                  console.log('====', displayFormatStringWithSingleHash.replace('#', eachVoucherNumber.toString()));
                }
                else {
                  console.log('%%%%', 'while generating vouchers the length of voucher number exceeded the display format');
                  break;
                }

              }
              else if (numberOfZeroesToBeAppendToVouchers > 0) {
                let eachVoucherNumber: number = +validSingleStartingNumber + incrementVal * index; //validSingleStartingNumber -> number
                let eachVoucherNumberString: string = eachVoucherNumber.toString();
                let vouchersNumberWithAppendedZeroes = eachVoucherNumberString.padStart(displayFormateSubStringElem.length, '0');
                console.log('****', displayFormatStringWithSingleHash.replace('#', vouchersNumberWithAppendedZeroes));

              }

            }
            console.log('After appending or prepending');

          }//end of if()


        }

      })
    }

  }


  //------------------------------------------------------------------------------





  onGenerateMasking() {
    console.log(this.signUpForm.get('displayformat').value);
    const str = this.signUpForm.get('displayformat').value
    let resultArray = str.split("-");
    console.log(resultArray);

    // this.mask2 = [/[0-9a-z]/, /[0-9a-z]/, /[0-9a-z]/, '-', /\d/, /\d/, /\d/]

    //! dynamically generating the Masking

    let displayFormatControl = this.signUpForm.get('displayformat').value;
    let startingNumberControl = this.signUpForm.get('startingnumber').value;
    let resultantArray: any[] = displayFormatControl.split("-");
    console.log(resultantArray);

    let lastElement: string = resultantArray[resultantArray.length - 1];
    let charaArray: string[] = lastElement.split('');//conventring string to chara array

    console.log('---');
    console.log(charaArray);

    let maskedArray: RegExp[] = new Array<RegExp>(charaArray.length);

    for (let index = 0; index < charaArray.length; index++) {

      maskedArray[index] = /[\d]/
    }
    console.log(maskedArray);
    this.mask2 = maskedArray;
  }


  //*Nice Creating bro :)--------------------------------------------------------------------------------
  onGenerateMaskingGenericLogic() {
    //! dynamically generating the Masking
    let displayFormatControl: string = this.signUpForm.get('displayformat').value;

    let resultantCharaArray: any[] = displayFormatControl.split("");//conventring string to chara array
    console.log(resultantCharaArray);

    //replace # -> /[d]/
    let maskedArray: RegExp[] = new Array<RegExp>(resultantCharaArray.length);

    for (let index = 0; index < resultantCharaArray.length; index++) {

      if (resultantCharaArray[index] == '#') {
        maskedArray[index] = /[\d]/
      }
      else {
        maskedArray[index] = resultantCharaArray[index]
      }
    }

    console.log(resultantCharaArray);
    console.log('---');
    console.log(maskedArray);

    this.mask2 = maskedArray


  }


  generateVouchersWithMaskingGenericLogic() {
    let startingNumberControl = this.signUpForm.get('startingnumber').value;
    console.log(startingNumberControl);
  }



  //?Grabage code can be helped to use in future

  /*   onGenerate23() {
  console.log(this.signUpForm.get('displayformat').value);
  console.log(this.signUpForm.get('startingnumber').value);
  let displayFormatControl = this.signUpForm.get('displayformat').value;
  let startingNumberControl = this.signUpForm.get('startingnumber').value;
   
  let resultantArray: any[] = displayFormatControl.split("-");
  console.log(resultantArray);
   
  let lastElement: string = resultantArray[resultantArray.length - 1];
  let charaArray: string[] = lastElement.split('');//conventring string to chara array
   
  console.log('---');
  console.log(charaArray);
   
  if (startingNumberControl.length === charaArray.length) { //length of startingNumberControl is same as lastElem masked # from displayformat
  //so no need of appending zeores
  console.log('no need to append zeros at front');
  //!task is to generate vouchers with prefix of character other than #
   
   
  }
  else if (startingNumberControl.length < charaArray.length) {
  console.log('need to append zeros at front');
  } else {
  //need to change the starting number length as it is greater than lastElem masked # from displayformat
  console.log('wrong starting number field');
  }
   
  }
  */



}