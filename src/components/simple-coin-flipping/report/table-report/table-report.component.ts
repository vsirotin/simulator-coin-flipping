import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { NotifierService } from '../../../../services/progress-notifier';
import { CoinFiippingGameSerieOutput } from '../../../../classes/coin-flipping-game/coin-flipping-game-serie';
import { LoggerFactory } from '@vsirotin/log4ts';


interface Line {
  steps: number;
  winsA: number;
  winsB: number;
  draws: number;
}

@Component({
  selector: 'app-table-report',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './table-report.component.html',
  styleUrl: './table-report.component.scss'
})
export class TableReportComponent {

  logger = LoggerFactory.getLogger('TableReportComponent');


  displayedColumns: string[] = ['steps', 'winsA', 'winsB', 'draws'];

  totalWinsA: number = 0;
  totalWinsB: number = 0;
  totaDraws: number = 0;
  relativeDeviation: number = 0.0;

  lines: Line[] = new Array<Line>();
  constructor(){
    this.logger.log('TableReportComponent created');
  }
  ngOnInit() {
      NotifierService.getStateObservable().subscribe(state => {
        this.lines = this.transformState(state);
        this.totalWinsA = 0;
        this.totalWinsB = 0;
        this.totaDraws = 0;
        this.lines.forEach(line => {
          this.totalWinsA += line.winsA;
          this.totalWinsB += line.winsB;
          this.totaDraws += line.draws;
        }
        );

        this.relativeDeviation = state.relativeDeviation;

      });
    }
  
      transformState(state: CoinFiippingGameSerieOutput): Line[] {
        this.logger.debug('start transformState state:', state);
      
        // Collect all different keys from the maps into a Set
      const allSteps = new Set<number>([
        ...state.gamesWithWinnerA.keys(),
        ...state.gamesWithWinnerB.keys(),
        ...state.gamesWithDraw.keys()
      ]);

      this.logger.debug('allSteps:', allSteps);
      this.lines = new Array<Line>();
      allSteps.forEach(step => {
        const line: Line = {
          steps: step,
          winsA: state.gamesWithWinnerA.get(step) || 0,
          winsB: state.gamesWithWinnerB.get(step) || 0,
          draws: state.gamesWithDraw.get(step) || 0
        };
        this.lines.push(line);
        
        // Sort lines by steps
        this.lines.sort((a, b) => a.steps - b.steps);
      });
      this.logger.debug('lines:', this.lines);

      const result: Line[]  = this.lines;
      return result;
    }

}
