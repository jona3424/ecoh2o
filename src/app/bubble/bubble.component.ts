import { Component, Input, OnInit } from '@angular/core';
import Station from '../models/station';
import { Properties, Status } from '../models/measurement';
import allowed_ranges, { bitne_metrike } from '../../allowed_ranges';

class Prop{
  field : string = "";
  value : number = 0;
  critical : string = "green";
  text : string = "green";
}

@Component({
  selector: 'app-bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.scss']
})
export class BubbleComponent implements OnInit{

  @Input("stanica")
  stanica !: Station;
  props !: Properties;

  prop_array : Prop[] = [];
  prop_kriticno : Prop[] = [];
  prop_prihvatljivo: Prop[] = [];

  fields : string[] = [];
  values : number[] = [];

  badge_class : string = "";
  badge_text : string = "Opasno";

  count_bad = 0;
  count_maybe = 0;
  count_all = 0;

  ngOnInit(){
    if(this.stanica.latest_measurement){
            
      this.props = this.stanica.latest_measurement.properties;
      var vals = Object.values(this.props);
      var keys = Object.keys(this.props)
      for(var i = 0; i < vals.length; i++){
        this.count_all++;
          var noviProp = new Prop();
          noviProp.field = keys[i];
          noviProp.value = vals[i];

          var ranges = allowed_ranges[noviProp.field];
          noviProp.critical = "green";
          if(ranges.max && noviProp.value > ranges.max * 1.1) {
            noviProp.critical = "red";
            this.count_bad++;
          }else if (ranges.max && noviProp.value > ranges.max){
            noviProp.critical = "#ffcc00";
            this.count_maybe++;
          }

          if(ranges.min && noviProp.value < ranges.min * 0.9) {
            noviProp.critical = "red";
            this.count_bad++;
          }else if (ranges.min && noviProp.value < ranges.min){
            noviProp.critical = "#ffcc00";
            this.count_maybe++;
          }

          switch(noviProp.critical){
            case "red":noviProp.text="Kritično";this.prop_kriticno.push(noviProp);break;
            case "#ffcc00":noviProp.text="Prihvatljivo";this.prop_prihvatljivo.push(noviProp);break;
            default: noviProp.text="Drip";
          }

          // if(bitne_metrike.includes(keys[i])){
            this.prop_array.push(noviProp);
          // }
      }    

      switch (this.stanica.latest_measurement.status) {
      case Status.OK:
        this.badge_class = "badge-success";
        this.badge_text = "Sigurno";
        break;
      case Status.Warning:
        this.badge_class = "badge-warning";
        this.badge_text = "Prihvatljivo";
        break;
      case Status.Critical:
        this.badge_class = "badge-danger";
        this.badge_text = "Opasno";
        break;
      }
    }
  }


}
