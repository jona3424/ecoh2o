import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './services/database.service';
import Station from './models/station';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'ecoh2o';

	stations : Station[] | undefined;

	constructor(private readonly db: DatabaseService) {

	}

	ngOnInit(): void {
		this.db.getStations().then(stations => {
			console.log(stations);
			this.stations = stations;

			for (const station of stations) {
				this.db.getMeasurements(station).then(measurements => {
					console.log(measurements);
				});
			}
		});
	}
}