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

  checkAllSameHashCharacter = (ele: string) => {

    let c1 = ele.charAt(0);
    if (c1 !== '#') { //first character must be '#'
      return false;
    }
    for (let i = 1; i < ele.length; i++) {
      let temp = ele.charAt(i);
      if (c1 !== temp) {
        //if chars does NOT match, 
        //just return false from here itself,
        //there is no need to verify other chars
        return false;
      }
    }
    //As it did NOT return from above if (inside for)
    //it means, all chars matched, so return true
    return true;

  }


  replaceHashesWithStartingNumber = (startingNumberControl, hashes: string) => {

    if (startingNumberControl.toString().length === hashes.length) { //length of startingNumberControl is same as lastElem masked # from displayformat
      //so no need of appending zeores
      console.log('Valid starting number and display format');
      //!task is to generate vouchers with prefix of character other than #
      // logicToGenerateVoucher();
      hashes = startingNumberControl;
      return hashes;

    }
    else if (startingNumberControl.toString().length < hashes.length) {//toString() -> To get the length of number entered in startingNumberControl field
      console.log('need to append zeros at front');

      let numberOfZeroesToAppend = hashes.length - startingNumberControl.toString().length;
      console.log(numberOfZeroesToAppend);

      var appendedZeroesStartingNumber = startingNumberControl + "";
      while (numberOfZeroesToAppend != 0) {
        appendedZeroesStartingNumber = "0" + appendedZeroesStartingNumber;
        numberOfZeroesToAppend--;
      }

      console.log('++');
      console.log(appendedZeroesStartingNumber);

      hashes = appendedZeroesStartingNumber;

      return hashes;


    } else {
      //need to change the starting number length as it is greater than lastElem masked # from displayformat
      console.log('wrong starting number field');
      //Invalid starting number (either change the display format or starting number length)
      return null
    }


  }




  generateVouchersWithOutMasking2() {

    let displayFormatControl = this.signUpForm.get('displayformat').value;
    let startingNumberControl = +this.signUpForm.get('startingnumber').value;

    let resultantArray_ElementSplitedWithHiphen: string[] = displayFormatControl.split("-");

    console.log('resultantArray_ElementSplitedWithHiphen', resultantArray_ElementSplitedWithHiphen);

    let doesDisplayFormatHasValidHashes: boolean = false;

    resultantArray_ElementSplitedWithHiphen.forEach((element: string) => {
      console.log(element);

      if (element.charAt(0) === '#') {//first character must be '#', if so then only goto allSameCharacter() func
        doesDisplayFormatHasValidHashes = this.checkAllSameHashCharacter(element);
      }

    })

    console.log(doesDisplayFormatHasValidHashes);

    if (doesDisplayFormatHasValidHashes) {//true
      console.log(resultantArray_ElementSplitedWithHiphen);
      resultantArray_ElementSplitedWithHiphen.forEach((element: string) => {

        if (element.charAt(0) === '#') {//this element must be replcaed with Starting number 
          //but starting number length shld match with display format hashes
          let startingNumberWithDisplayFormat = this.replaceHashesWithStartingNumber(startingNumberControl, element);
          console.log(startingNumberWithDisplayFormat);
          //!now need to generate array of vouchers with number of times quanity -> listOfVouchers
          //!listOfVouchers is cotains only number this should be appended or prepended or both as per display format 
          //!(i.e- replace hashes with this this array -> my final array :) )
        }

      })
    }

  }










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