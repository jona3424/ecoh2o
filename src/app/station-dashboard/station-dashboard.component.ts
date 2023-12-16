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
	private readonly stationId: string;
	public station?: Station;
	public measurements?: Measurement[]
	
	public constructor(activatedRoute: ActivatedRoute, private readonly database: DatabaseService) {
		this.stationId = activatedRoute.snapshot.params.id;
	}

	public ngOnInit() {
		this.database.getStation(this.stationId).then(station => {
			if (!station)
				return;

			this.station = station;
			this.database.getMeasurements(station).then(measurements => {
				this.measurements = measurements;
				if(this.station)
					this.station.latest_measurement = this.measurements[this.measurements.length-1];
			});
		});
	}
}
