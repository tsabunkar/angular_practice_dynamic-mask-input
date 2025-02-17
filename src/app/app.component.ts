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




  checkAllSameHashCharacter = (element: string): boolean => {

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



  validateStartingNumberWithDisplayFormat = (startingNumberControl, hashes: string): string | null => {

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
      console.error('wrong starting number field');
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


  generateVouchersArrayReplaceHashWithVoucherNumber = (displayFormateSubStringElem, startingNumberControl, validSingleStartingNumber, displayFormatStringWithSingleHash): string[] => {


    let quantityVal = +this.signUpForm.get('quantity').value;
    let incrementVal = +this.signUpForm.get('incrementby').value;

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


  generateSequentialVouchersSeparatedWithHiphens(): string[] {
    let displayFormatControl = this.signUpForm.get('displayformat').value;
    let startingNumberControl = +this.signUpForm.get('startingnumber').value;

    let resultantArray_ElementSplitedWithHiphen_DisplayFormat: string[] = displayFormatControl.split("-");
    let doesDisplayFormatHasValidHashes: boolean = false;
    // let vouchersArray: string[] = [];
    let vouchersArray: string[] = new Array<string>();

    resultantArray_ElementSplitedWithHiphen_DisplayFormat.forEach((displayFormatSubStringElem: string) => {

      if (displayFormatSubStringElem.charAt(0) === '#') {//first character must be '#', if so then only goto allSameCharacter() func
        doesDisplayFormatHasValidHashes = this.checkAllSameHashCharacter(displayFormatSubStringElem);
      }
    })

    if (doesDisplayFormatHasValidHashes) {//true (display format has valid substring of hashes ex- ab-###-cd)

      resultantArray_ElementSplitedWithHiphen_DisplayFormat.forEach((displayFormatSubStringElem: string) => {

        if (displayFormatSubStringElem.charAt(0) === '#') {//this element must be replcaed with Starting number  but starting number length shld match with display format hashes
          let validSingleStartingNumber = this.validateStartingNumberWithDisplayFormat(startingNumberControl, displayFormatSubStringElem);

          if (validSingleStartingNumber != null) { //starting number is valid (that is matches display format length or less than display format length)

            let displayFormatStringWithSingleHash = this.removeMulipleHashesToSingleHashInString(displayFormatControl);
            vouchersArray = this.generateVouchersArrayReplaceHashWithVoucherNumber(displayFormatSubStringElem, startingNumberControl, validSingleStartingNumber, displayFormatStringWithSingleHash)
            // console.log(vouchersArray);

          }//end of if()
          else { //starting number is valid
            console.error('starting number length should not exceed display format length');
            // vouchersArray = [];
          }

        }
      })

      // return vouchersArray;

    } else { //(display format has valid substring of hashes ex- ab-###2-cd)
      //!This condition should be removed************
      // vouchersArray = [];
      console.error('Invalid display format');
      // return vouchersArray;
    }

    return vouchersArray;

  }





  generateValidSequntialVouchers(): string[] {
    let resultantVouchersArray: string[] = new Array<string>();
    let displayFormatControl = this.signUpForm.get('displayformat').value;
    let startingNumberControl = +this.signUpForm.get('startingnumber').value;
    let resultantArray_ElementSplitedWithHiphen_DisplayFormat: string[] = displayFormatControl.split("-");
    // console.log(resultantArray_ElementSplitedWithHiphen_DisplayFormat);

    let countNumberOfSubStringContainingHashes: number = 0;
    let substringWithHashes: string = null;

    for (const itemString of resultantArray_ElementSplitedWithHiphen_DisplayFormat) {
      // console.log(itemString);
      if (itemString.search('#') !== -1) {
        console.log('this string contains hashes:-', itemString);
        countNumberOfSubStringContainingHashes++;
        substringWithHashes = itemString;
      }
    }

    console.log(countNumberOfSubStringContainingHashes);

    if (countNumberOfSubStringContainingHashes === 1) { //contains only one substring with hashes
      console.log('contains only one substring with hashes', substringWithHashes)

      //now check if the substringWithHashes  contains all hashes or some hashes
      let isAllCharactersAreHashesInString = this.checkAllSameHashCharacter(substringWithHashes)

      if (isAllCharactersAreHashesInString) {
        console.warn('All characters in the string are hashes', substringWithHashes);
        //!this scenario already done
        resultantVouchersArray = this.generateSequentialVouchersSeparatedWithHiphens();
        console.log(resultantVouchersArray);

      } else {
        console.log('some characters in the string are hashes', substringWithHashes);
        //!now check if in this string in between any number or character exists other than hashes ex- ##f### , wd###ds###, etc , if so then this string would be invalid only valid strings r -> a####, ####b, a####b,  few#####23, ab-333####fnc-efef, 
        let stratingIndexOfHash = substringWithHashes.indexOf('#');
        let endingIndexOfHash = substringWithHashes.lastIndexOf('#');
        console.log(stratingIndexOfHash, endingIndexOfHash);

        let removedStartingCharAndEndingCharOfString = substringWithHashes.slice(stratingIndexOfHash, endingIndexOfHash + 1);
        console.log(removedStartingCharAndEndingCharOfString);

        let isAllCharactersAreHashesInStringOfSubString = this.checkAllSameHashCharacter(removedStartingCharAndEndingCharOfString);
        console.log(isAllCharactersAreHashesInStringOfSubString);

        if (isAllCharactersAreHashesInStringOfSubString) {//valid strings r -> a####, ####b, a####b,  few#####23, ab-333####fnc-efef, 
          console.warn('contains chara or number at end of hashes ex- a####, ###b, a23###cd ', substringWithHashes)
          console.log(resultantArray_ElementSplitedWithHiphen_DisplayFormat, substringWithHashes);



          for (let index = 0; index < resultantArray_ElementSplitedWithHiphen_DisplayFormat.length; index++) {

            if (resultantArray_ElementSplitedWithHiphen_DisplayFormat[index].search('#') !== -1) {

              let stratingIndexOfHash = resultantArray_ElementSplitedWithHiphen_DisplayFormat[index].indexOf('#');
              let endingIndexOfHash = resultantArray_ElementSplitedWithHiphen_DisplayFormat[index].lastIndexOf('#');
              let numberOfHashes = (endingIndexOfHash + 1) - stratingIndexOfHash;


              //!validate starting number length is same as numberofHashes (need to appendzero, wrong format)
              let isValidStartingNumber: boolean =
                this.validateStartingNumberWithDisplayFormatHashesWithPreAndPostCharaAndNo(startingNumberControl, numberOfHashes);

              console.log('isValidStartingNumber', isValidStartingNumber);

              if (isValidStartingNumber) {

                //!remove multiple hashes to single hash
                let displayFormatStringWithSingleHash: string =
                  this.removeMulipleHashesToSingleHashInStringWithPreAndPostCharaAndNo(numberOfHashes);

                console.log('*****');
                console.log('displayFormatStringWithSingleHash', displayFormatStringWithSingleHash);

                //!replace the single hash with vouhersArray (generate vouchers array)
                resultantVouchersArray =
                  this.generateVouchersArrayHashInStringWithPreAndPostCharaAndNo(startingNumberControl, displayFormatStringWithSingleHash, numberOfHashes)
                console.log(resultantVouchersArray);

              }
              else {
                console.error('Starting number length doesnot matches with display format hashes length, ex- ab####cd not eqaul starting num- 12345')
              }

            }


          }//end of for()

        } else {//invalid strings -> ##f### , wd###ds###, etc ,
          console.error('contains  character or number character in between hashes ex- ##f###');
        }

      }

    } else {//contains multiple substring with hashes
      console.error('contains multiple substring with hashes ex- ####-####');
    }

    return resultantVouchersArray;
  }




  validateStartingNumberWithDisplayFormatHashesWithPreAndPostCharaAndNo(startingNumberControl, numberOfHashes): boolean {
    if (startingNumberControl.toString().length <= numberOfHashes) {
      return true;
    } else {
      return false;
    }
  }




  removeMutlipeHashToSingleHash_ForInBetweenHashes = (charaArray, numberOfHashes): string[] => {

    let numberOfHashesToRemove = numberOfHashes - 1;
    let resultantCharArray: string[] = new Array<string>();

    for (let index = 0; index < charaArray.length; index++) {

      if (charaArray[index] == '#' && numberOfHashesToRemove != 0) {
        // resultantCharArray.splice(index, 1);
        numberOfHashesToRemove--;
      } else {
        resultantCharArray.push(charaArray[index])
      }

    }
    return resultantCharArray;

  }

  removeMulipleHashesToSingleHashInStringWithPreAndPostCharaAndNo = (numberOfHashes): string => {
    let displayFormatControl = this.signUpForm.get('displayformat').value;
    let displayFormatArray_SplitWithHiphen: string[] = displayFormatControl.split("-");

    for (let index = 0; index < displayFormatArray_SplitWithHiphen.length; index++) {

      //search which ever substring has hash init that should only do below operations
      if (displayFormatArray_SplitWithHiphen[index].search('#') !== -1) {

        let charaArray = displayFormatArray_SplitWithHiphen[index].split("");

        charaArray = this.removeMutlipeHashToSingleHash_ForInBetweenHashes(charaArray, numberOfHashes)
        let stringWithOnlyOneHash = charaArray.join('');
        displayFormatArray_SplitWithHiphen[index] = stringWithOnlyOneHash;
      }

    }

    return displayFormatArray_SplitWithHiphen.join('-');

  }



  generateVouchersArrayHashInStringWithPreAndPostCharaAndNo = (startingNumberControl, displayFormatStringWithSingleHash, numberOfHashes): string[] => {
    let quantityVal = +this.signUpForm.get('quantity').value;
    let incrementVal = +this.signUpForm.get('incrementby').value;
    let validSingleStartingNumber: string = startingNumberControl;


    let vouchersArray: string[] = new Array<string>();
    let numberOfZeroesToBeAppendToVouchers: number = numberOfHashes - startingNumberControl.toString().length;
    console.log('numberOfZeroesToBeAppendToVouchers', numberOfZeroesToBeAppendToVouchers);


    for (let index = 0; index < quantityVal; index++) {

      if (numberOfZeroesToBeAppendToVouchers === 0) {
        let eachVoucherNumber: string = validSingleStartingNumber + incrementVal * index;

        if (eachVoucherNumber.toString().length == numberOfHashes) {//if display format is ab###cd and starting number 999 then increment by 1-> 1000 which means starting number is exceeding the length of display format
          // console.log('====', displayFormatStringWithSingleHash.replace('#', eachVoucherNumber.toString()));
          vouchersArray.push(displayFormatStringWithSingleHash.replace('#', eachVoucherNumber.toString()))
        } else {
          console.error('while generating vouchers the length of voucher number exceeded the display format');
          break;
        }

      }
      else if (numberOfZeroesToBeAppendToVouchers > 0) {

        let eachVoucherNumber: number = +validSingleStartingNumber + incrementVal * index; //validSingleStartingNumber -> number
        let eachVoucherNumberString: string = eachVoucherNumber.toString();
        let vouchersNumberWithAppendedZeroes = eachVoucherNumberString.padStart(numberOfHashes, '0');
        // console.log('****', displayFormatStringWithSingleHash.replace('#', vouchersNumberWithAppendedZeroes));
        vouchersArray.push(displayFormatStringWithSingleHash.replace('#', vouchersNumberWithAppendedZeroes));
      }
    } //end of for()

    return vouchersArray;
  }








  //!----------------------Non-Sequnetial--------------------------------

  _voucherNumberPress(event: Event) {

    const pattern = /[A-Za-z0-9,-]/;
    let inputChar = String.fromCharCode(event['charCode']);

    if (!pattern.test(inputChar)) { // invalid character, prevent input
      event.preventDefault();
    }

  }


  removeEmptyElementsFromArray = (vouchersArray: string[]): string[] => {
    let temp = [];

    for (let i of vouchersArray)
      i && temp.push(i); // copy each non-empty value to the 'temp' array

    vouchersArray = temp;
    return vouchersArray;
  }

  onClickOfNonSequentialGenerateVouchers() {
    let vouchernumberControl = this.signUpForm.get('vouchernumber').value;

    console.log(vouchernumberControl);

    let vouchersArray: string[] = vouchernumberControl.split(',');
    let filteredValidVouchersArray = this.removeEmptyElementsFromArray(vouchersArray);

    console.log(vouchersArray);
    console.log(filteredValidVouchersArray);

  }



}