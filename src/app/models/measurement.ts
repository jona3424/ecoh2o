import { FirestoreDataConverter } from "firebase/firestore";

export interface ChemicalProperties {
	ph: number;
	hardness: number;
}

export interface PhysicalProperties {
	temperature: number;
	speed: number;
}

export default interface Measurement {
	id: string;
	created_at: Date;
	chemical_properties?: ChemicalProperties;
	physical_properties?: PhysicalProperties;
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