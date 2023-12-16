import { FirestoreDataConverter } from "firebase/firestore";
import Measurement from "./measurement";

export default interface Station {
	id: string;
	name: string;
	location: google.maps.LatLng;

	latest_measurement?: Measurement;
	icon : google.maps.Icon;
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
			location: new google.maps.LatLng(data.location.latitude, data.location.longitude)
		}
	}
}