import { FirestoreDataConverter } from "firebase/firestore";
import allowedRanges from "src/allowed_ranges";

export interface Properties {
	[name: string]: number;
}

export enum Status {
	OK,
	Warning,
	Critical
}

export default interface Measurement {
	id: string;
	created_at: Date;
	properties: Properties;
	status: Status;
}

export const measurementConverter : FirestoreDataConverter<Measurement> = {
	toFirestore: function(measurement: Measurement) {
		return {
			...measurement,
		}
	},
	fromFirestore: function(snapshot: any, options: any) : Measurement {
		const data = snapshot.data(options);
		
		return {
			id: snapshot.id,
			...data,

			created_at: data.created_at.toDate(),
		}
	}
}

export function validateMeasurement(measurement: Measurement) {
	measurement.status = Status.OK;

	for (const property in measurement.properties) {
		if (!(property in allowedRanges)) {
			console.error(`Measurement has unknown property ${property}`);
			continue;
		}

		const value = measurement.properties[property];
		
		const { min, max } = allowedRanges[property];
		if (min !== undefined && value < min || max !== undefined && value > max) {
			measurement.status = Status.Critical;
			return;
		}
		
		if (min !== undefined && value < min * 0.9 || max !== undefined && value > max * 1.1) {
			measurement.status = Status.Warning;
		}
	}
}