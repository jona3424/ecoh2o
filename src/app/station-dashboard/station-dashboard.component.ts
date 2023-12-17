import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import Station from "../models/station";
import { DatabaseService } from "../services/database.service";
import Measurement from "../models/measurement";
import { FormControl, FormGroup } from "@angular/forms";
import allowedRanges from "src/allowed_ranges";
import { PageEvent } from "@angular/material/paginator";


class Latest{
	field: string = "";
	value: number = 0;
	icon: string = "happy.svg";
	color: string = "green";
	increase: number = 0;
}
@Component({
	selector: 'app-station-dashboard',
	templateUrl: './station-dashboard.component.html',
	styleUrls: ['./station-dashboard.component.scss']
})
export class StationDashboardComponent implements OnInit {
	range = new FormGroup({
		end: new FormControl<Date | null>(new Date(Date.now())),
		start: new FormControl<Date | null>(new Date(Date.now()-7*24*60*60*1000)),
	  });


	public datasets: any;
	public data: any;
	public clicked: boolean = true;
	public clicked1: boolean = false;

	private readonly stationId: string;
	public station?: Station;
	public allMeasurements?: Measurement[];
	public get measurements(): Measurement[] | undefined {
		if (!this.allMeasurements)
			return undefined;

		let start = this.range.value.start;
		let end = this.range.value.end;

		if (!start && !end)
			return this.allMeasurements;

		if (!start)
			start = new Date(0);

		if (!end)
			end = new Date();

		return this.allMeasurements.filter(measurement => measurement.created_at >= start! && measurement.created_at <= end!);
	}

	public lowValue: number = 0;
	public highValue: number = 10;

	public fetchNextPage(event: PageEvent): PageEvent {
		this.lowValue = event.pageIndex * event.pageSize;
		this.highValue = this.lowValue + event.pageSize;
		
		return event;
	}

	public subLatestMeas !: Measurement;


	@ViewChild("startDatum")
	private startDatum !: ElementRef;
	@ViewChild("endDatum")
	private endDatum !: ElementRef;

	setMonth(){
		var danas = new Date();
		var tad = new Date();
		tad.setMonth(tad.getMonth()-1);
		
		this.range.setValue({end: danas, start: tad});

		this.reloadChart();
	}

	setWeek(){
		var danas = new Date();
		var tad = new Date();
		tad.setDate(tad.getDate()-7);


		this.range.setValue({end: danas, start: tad});

		this.reloadChart();
	}

	top_row : Latest[] = [];
	keys : string[] = [];

	chart_field: string = "ph";

	setField(l: Latest){
		this.chart_field=l.field;
		this.reloadChart();
	}

	public constructor(activatedRoute: ActivatedRoute, private readonly database: DatabaseService) {
		this.stationId = activatedRoute.snapshot.params.id;
	}

	dps = [{ x: new Date(Date.UTC (2012, 1, 1, 1,0) ), y: 10 }];
	chart: any;

	chartOptions = {
		axisX: {
			labelFontColor: "#73c546",
		},
		axisY: {
			labelFontColor: "#73c546",
		},
		animationEnabled: true,
		backgroundColor: "#042530",
		data: [{
			type: "spline",

			xValueType: "dateTime",
			lineColor: "#2180ab",
			markerColor: "#2180ab", lineThickness: 3,
			dataPoints: this.dps
		}]
	}
	getChartInstance(chart: object) {
		this.chart = chart;
	}
	

	getData(meas: Measurement | undefined, data: string){
		if(!meas) {
			if(!this.station) return 0;
			meas = this.station.latest_measurement;
		}
		if(!meas) return 0;
		// var vals = Object.values(meas.properties);
		var vals = meas.properties[data];
		let index = this.keys.indexOf(data);
		if(index == -1) return 0;
		return Math.floor(vals);
	}


	reloadChart(): void{
		if (!this.station || !this.measurements) return;

		this.dps = []

		for(let meas of this.measurements){
			this.dps.push({x:meas.created_at,y:this.getData(meas, this.chart_field)});
		}
		this.chartOptions.data[0].dataPoints = this.dps
		this.chart.render();
	}

	public ngOnInit() {
		this.database.getStation(this.stationId).then(station => {
			if (!station)
				return;

			this.station = station;
			this.database.getMeasurements(station).then(measurements => {
				this.allMeasurements = measurements;
				this.lowValue = 0;
				this.highValue = this.allMeasurements.length;
				
				if (this.station){
					this.station.latest_measurement = this.allMeasurements[this.allMeasurements.length - 1];

					try{

						this.subLatestMeas = this.allMeasurements[this.allMeasurements.length -2];

					}catch(error){

					}

					this.keys = Object.keys(this.station.latest_measurement.properties).sort()
					this.chart_field = this.keys[0];
					this.fillTopRow();
					this.reloadChart();
				}
			});
		});
	}

	public getMetricNames(): string[] {
		return Object.keys(allowedRanges);
	}

	fillTopRow(){
		if(!this.station) return;
		if(!this.station.latest_measurement) return;
		if(!this.subLatestMeas) return;
		for(let key of this.keys){
			var data = this.getData(this.station.latest_measurement, key);

			var noviTR = new Latest();
			noviTR.value = data;
			noviTR.field = key;


			var ranges = allowedRanges[key];
			if(ranges.max && data > ranges.max * 1.1) {
				noviTR.color = "red";
				noviTR.icon = "sad.svg";
			  }else if (ranges.max && data > ranges.max){
				noviTR.color = "#ffcc00";
				noviTR.icon = "meh.svg";
			  }

			  if(ranges.min && data < ranges.min * 0.9) {
				noviTR.color = "red";
				noviTR.icon = "sad.svg";
			  }else if (ranges.min && data < ranges.min){
				noviTR.color = "#ffcc00";
				noviTR.icon = "meh.svg";
			  }
			
			var slm = this.getData(this.subLatestMeas, key);
			if(slm != 0 ){
			noviTR.increase = (data-slm)*100/slm;
			noviTR.increase = Math.round(noviTR.increase * 100) / 100
			}this.top_row.push(noviTR);
		}
	}

	updateCalcs(){
		if(!this.range.value.end || !this.range.value.start) return;
		
		var danas = new Date();
		var tadMjesec = new Date();
		tadMjesec.setMonth(tadMjesec.getMonth()-1);

		var tad = new Date();
		tad.setDate(tad.getDate()-7);
		
		const dan = 1000*60*60*24;

		this.clicked1 = Math.round(this.range.value.end.getTime()/dan) == Math.round(danas.getTime()/dan) 
				&& Math.round(this.range.value.start.getTime()/dan) == Math.round(tadMjesec.getTime()/dan);	
		this.clicked = Math.round(this.range.value.end.getTime()/dan) == Math.round(danas.getTime()/dan) 
				&& Math.round(this.range.value.start.getTime()/dan) == Math.round(tad.getTime()/dan);	
	
		this.reloadChart();
	}
}
