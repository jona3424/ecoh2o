export interface Range {
	min: number;
	max: number;
}

export default {
	"ph": {
		min: 5,
		max: 7,
	},
	"temperature":{
		min: 0,
		max: 50,
	},
} as { [name: string]: Range };