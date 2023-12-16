import { FirestoreDataConverter, GeoPoint } from "firebase/firestore";

export default interface Station {
	id: string;
	name: string;
	location: GeoPoint;
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