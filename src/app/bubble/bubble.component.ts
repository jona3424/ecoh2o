import { Component, Input, OnInit } from '@angular/core';
import Station from '../models/station';
import { Properties } from '../models/measurement';
import allowed_ranges, { bitne_metrike } from '../../allowed_ranges';

class Prop{
  field : string = "";
  value : number = 0;
  critical : boolean = false;
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

  fields : string[] = [];
  values : number[] = [];

  kad : string = "";
  red : boolean = false;

  count_gucci = 0;

  ngOnInit(){
    if(this.stanica.latest_measurement){
            
      this.props = this.stanica.latest_measurement.properties;
      var vals = Object.values(this.props);
      var keys = Object.keys(this.props)
      for(var i = 0; i < vals.length; i++){
        if(bitne_metrike.includes(keys[i])){
          var noviProp = new Prop();
          noviProp.field = keys[i];
          noviProp.value = vals[i];

          var ranges = allowed_ranges[noviProp.field];
          noviProp.critical = false;
          if(ranges.max && ranges.max < noviProp.value) noviProp.critical = true;
          if(ranges.min && ranges.min > noviProp.value) noviProp.critical = true;

          if(noviProp.critical == false) this.count_gucci++;
          this.prop_array.push(noviProp);
        }
      }    
      
      this.kad = this.stanica.latest_measurement.created_at.toLocaleDateString('sr-RS');
      this.red = this.stanica.latest_measurement.status;      
    }
  }


}
