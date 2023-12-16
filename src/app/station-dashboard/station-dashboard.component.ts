import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import Station from "../models/station";
import { DatabaseService } from "../services/database.service";
import Measurement from "../models/measurement";
@Component({
	selector: 'app-station-dashboard',
	templateUrl: './station-dashboard.component.html',
	styleUrls: ['./station-dashboard.component.scss']
})
export class StationDashboardComponent implements OnInit {



	public datasets: any;
	public data: any;
	public clicked: boolean = true;
	public clicked1: boolean = false;


	private readonly stationId: string;
	public station?: Station;
	public measurements?: Measurement[]

	public constructor(activatedRoute: ActivatedRoute, private readonly database: DatabaseService) {
		this.stationId = activatedRoute.snapshot.params.id;
	}

	dps = [{ x: 1, y: 10 }, { x: 2, y: 13 }, { x: 3, y: 18 }, { x: 4, y: 20 }, { x: 5, y: 17 }, { x: 6, y: 10 }, { x: 7, y: 13 }, { x: 8, y: 18 }, { x: 9, y: 20 }, { x: 10, y: 17 }];
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
			lineColor: "#2180ab",
			markerColor: "#2180ab", lineThickness: 3,
			dataPoints: this.dps
		}]
	}
	getChartInstance(chart: object) {
		this.chart = chart;
	}


	reloadChar(): void{
		
		if (!this.station || !this.measurements) return;

		this.dps = []

		for(let meas of this.measurements){
			this.dps.push( {x : 1, y : 2} );
		}

		this.chart.render();
	}

	public ngOnInit() {
		this.database.getStation(this.stationId).then(station => {
			if (!station)
				return;

			this.station = station;
			this.database.getMeasurements(station).then(measurements => {
				this.measurements = measurements;
				if (this.station)
					this.station.latest_measurement = this.measurements[this.measurements.length - 1];
			});
		});
	}


}
