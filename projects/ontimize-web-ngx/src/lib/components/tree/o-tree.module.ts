import { CdkTreeModule } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../shared/shared.module';
import { OTreeComponent } from './o-tree.component';

@NgModule({
	declarations: [OTreeComponent],
	imports: [CommonModule, OSharedModule, CdkTreeModule,],
	exports: [OTreeComponent],
})
export class OTreeModule {}
