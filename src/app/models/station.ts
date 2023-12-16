import { FirestoreDataConverter, GeoPoint } from "firebase/firestore";
import Measurement from "./measurement";

export default interface Station {
	id: string;
	name: string;
	location: GeoPoint;

	latest_measurement?: Measurement;
}

export const stationConverter : FirestoreDataConverter<Station> = {
	toFirestore: function(station: Station) {
		return {
			...station,
		}
	},
	fromFirestore: function(snapshot: any, options: any) : Station {
		const data = snapshot.data(options);
		
		return {
			id: snapshot.id,
			...data,
		}
	}
}