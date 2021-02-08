import { CurrencyINRPIPE } from './currency-inr.pipe';
// application-pipes.module.ts
// other imports
import { NgModule } from '@angular/core';
import { CurrencyINRInWordPIPE } from './currency-inr-word';

@NgModule({
  imports: [
    // dep modules
  ],
  declarations: [ 
    CurrencyINRPIPE,
    CurrencyINRInWordPIPE
  ],
  exports: [
      CurrencyINRPIPE,
      CurrencyINRInWordPIPE
  ]
})
export class ApplicationPipesModule {}