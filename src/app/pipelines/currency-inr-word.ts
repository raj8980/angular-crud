import { Pipe, PipeTransform } from '@angular/core';
   @Pipe({
     name: 'currencyINRInWord'
   })
   export class CurrencyINRInWordPIPE implements PipeTransform {
        transform(value: any): any {
            if(!isNaN(value)){value=new String(value).replace(",","");}
            
            var sglDigit = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"],
            dblDigit = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"],
            tensPlace = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"],
            handle_tens = function(dgt:number, prevDgt:number) {
              return 0 == dgt ? "" : " " + (1 == dgt ? dblDigit[prevDgt] : tensPlace[dgt])
            },
            handle_utlc = function(dgt:number, nxtDgt:number, denom:string) {
              return (0 != dgt && 1 != nxtDgt ? " " + sglDigit[dgt] : "") + (0 != nxtDgt || dgt > 0 ? " " + denom : "")
            };
        
          var str = "",
            digitIdx = 0,
            digit = 0,
            nxtDigit = 0,
            words = [];
        
          if (value += "", isNaN(parseInt(value))) str = "";
          else if (parseInt(value) > 0 && value.length <= 15) {
            for (digitIdx = value.length - 1; digitIdx >= 0; digitIdx--) switch (digit = value[digitIdx] - 0, nxtDigit = digitIdx > 0 ? value[digitIdx - 1] - 0 : 0, value.length - digitIdx - 1) {
              case 0:
                words.push(handle_utlc(digit, nxtDigit, ""));
                break;
              case 1:
                words.push(handle_tens(digit, value[digitIdx + 1]));
                break;
              case 2:
                words.push(0 != digit ? " " + sglDigit[digit] + " Hundred" + (0 != value[digitIdx + 1] && 0 != value[digitIdx + 2] ? " and" : "") : "");
                break;
              case 3:
                words.push(handle_utlc(digit, nxtDigit, "Thousand"));
                break;
              case 4:
                words.push(handle_tens(digit, value[digitIdx + 1]));
                break;
              case 5:
                words.push(handle_utlc(digit, nxtDigit, "Lakh"));
                break;
              case 6:
                words.push(handle_tens(digit, value[digitIdx + 1]));
                break;
              case 7:
                words.push(handle_utlc(digit, nxtDigit, "Crore"));
                break;
              case 8:
                words.push(handle_tens(digit, value[digitIdx + 1]));
                break;
              case 9:
                words.push(0 != digit ? " " + sglDigit[digit] + " Hundred" + (0 != value[digitIdx + 1] || 0 != value[digitIdx + 2] ? " and" : " Crore") : "")
            }
            str = words.reverse().join("")
          } else str = "";
          return str
         }
    }