import { FirestoreDataConverter } from "firebase/firestore";

export interface Properties {
	[name: string]: number;
}

export default interface Measurement {
	id: string;
	created_at: Date;
	properties: Properties;
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