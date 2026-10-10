import {
	Exercise1,
	Exercise2,
	Eye1,
	Eye2,
	Eye3,
	Hospital1,
	Hospital2,
	Hospital3,
	Hospital4,
	Loc1,
	Loc2,
	Loc3,
	Loc4,
} from '@/assets/images';

export const ExercisesData = [
	{
		image: Exercise1,
		videoUrl: '69380409614c62545441c028',
	},
	{
		image: Exercise2,
		videoUrl: '693807361310744be39375cb',
	},
	{
		image: 'https://video.gumlet.io/6937bcd4cf9ba947e6acedbb/693807361310744be39375cb/thumbnail-1-0.png',
		videoUrl: '693807361310744be39375cb',
	},
];
export const HospitalsData = [
	{
		image: Hospital1,
		address: '575 100 St SW Suite 102, Edmonton, AB T6X 0S8, Canada',
		phone: '+1 780-452-4111',
		website: 'https://www.visionmaxeye.com',
		hours: 'Mon-Thu: 8:00 AM – 4:00 PM, Fri: 8:00 AM – 2:00 PM',
		rating: '4.7 (355 Google reviews)',
		locationLink: 'https://maps.app.goo.gl/1e1CVYCqzzF5eMG38?g_st=aw',
		additionalImages: [Hospital4, Loc1],
	},
	{
		image: Hospital2,
		address: '6413 Cartmell Pl SW #203, Edmonton, AB T6W 4V4, Canada',
		phone: '+1 780-652-2033',
		website: 'https://stellareyecare.ca',
		hours: 'Mon-Fri: 7:30 AM – 4:30 PM',
		rating: '4.6 (287 Google reviews)',
		locationLink: 'https://maps.app.goo.gl/V4HgHDktfLfWftE26?g_st=aw',
		additionalImages: [Hospital3, Loc2],
	},
	{
		image: Hospital3,
		address: '10924 107 Ave NW Unit 400, Edmonton, AB T5H 0X5, Canada',
		phone: '+1 780-448-1801',
		website: 'https://www.alberta-retina.com',
		hours: 'Mon-Fri: 7:30 AM – 4:30 PM',
		rating: '4.5 (192 Google reviews)',
		locationLink: 'https://maps.app.goo.gl/YLsamw89EU4785vi8?g_st=aw',
		additionalImages: [Hospital2, Loc3],
	},
	{
		image: Hospital4,
		address: '10430 61 Ave NW #101, Edmonton, AB T6H 2J3, Canada',
		phone: '+1 855-308-3937',
		website: 'https://www.kinglasik.ca',
		hours: 'Mon-Fri: 8:30 AM – 4:30 PM',
		rating: '4.8 (421 Google reviews)',
		locationLink: 'https://maps.app.goo.gl/3xUxCbfM3BpWw8RP7?g_st=aw',
		additionalImages: [Hospital1, Loc4],
	},
];
export const ProductsData = [
	{
		key: '1',
		image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fc.shld.net%2Frpx%2Fi%2Fs%2Fi%2Fspin%2Fimage%2Fspin_prod_ec_798652201%3F%3Fhei%3D64%26wid%3D64%26qlt%3D50&f=1&nofb=1&ipt=6336610cd7eccb506ffafe8a65be941c7a998f5b2310cd14d0496fc99d0a08cc',
		amazonUrl: 'https://a.co/d/bg4ZmV4',
	},
	{
		key: '2',
		image: 'https://www.bing.com/th?id=OPAC.AoK52YLTOlcjVA474C474&o=5&pid=21.1&w=140&h=140&rs=1&qlt=100&dpr=1.3&o=2',
		amazonUrl: 'https://a.co/d/fM3ZNde',
	},
	{
		key: '3',
		image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi5.walmartimages.com%2Fasr%2F7631474b-dbeb-4a13-880f-d6b8d027ce91.c1eeb61bd5c9c95619cf00d50f8bfe52.jpeg&f=1&nofb=1&ipt=a3bb0598a16c44e149df3224d04046441ea48e25eab778606c7eda01d9194ea1',
		amazonUrl: 'https://a.co/d/b74wgvP',
	},
	{
		key: '4',
		image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.xXN8Hszkq_lWRXUihu6GaAHaHa%3Fpid%3DApi&f=1&ipt=bb9de08a6bfb44a20ccec3acba5bee8f78b08a201957e9b290c39e5b4f0d871b&ipo=images',
		amazonUrl: 'https://a.co/d/1IjADOj',
	},
	{
		key: '5',
		image: 'https://m.media-amazon.com/images/I/71sxoUp-UvL._AC_SL1500_.jpg',
		amazonUrl: 'https://a.co/d/eDVaXvG',
	},
];

export const ArticlesData = [
	{
		image: Eye1,
	},
	{
		image: Eye2,
	},
	{
		image: Eye3,
	},
];

export const windowsDownloadLink =
	'https://olo-nextron.s3.ca-central-1.amazonaws.com/releases/1.0.45/oLo+Setup+1.0.45.exe';

export const macDownloadLink =
	'https://olo-nextron.s3.ca-central-1.amazonaws.com/releases/1.0.45/oLo-1.0.45-arm64.dmg';
