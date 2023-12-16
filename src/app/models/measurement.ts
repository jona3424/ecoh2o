import { FirestoreDataConverter } from "firebase/firestore";
import allowedRanges from "src/allowed_ranges";

export interface Properties {
	[name: string]: number;
}

export default interface Measurement {
	id: string;
	created_at: Date;
	properties: Properties;
	status: boolean;
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
	for (const property in measurement.properties) {
		if (!(property in allowedRanges)) {
			console.error(`Measurement has unknown property ${property}`);
			continue;
		}

		const value = measurement.properties[property];
		
		const { min, max } = allowedRanges[property];
		if (min !== undefined && value < min || max !== undefined && value > max) {
			measurement.status = false;
			return;
		}
	}

	measurement.status = true;
}