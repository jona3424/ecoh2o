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

	public ngOnInit() {

		this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];


    var chartOrders = document.getElementById('chart-orders');

    // parseOptions(Chart, chartOptions());


    // var ordersChart = new Chart(chartOrders, {
    //   type: 'bar',
    //   options: chartExample2.options,
    //   data: chartExample2.data
    // });

    // var chartSales = document.getElementById('chart-sales');

    // this.salesChart = new Chart(chartSales, {
	// 		type: 'line',
	// 		options: chartExample1.options,
	// 		data: chartExample1.data
	// 	});



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
	public updateOptions() {
		// this.salesChart.data.datasets[0].data = this.data;
		// this.salesChart.update();
	  }
}
