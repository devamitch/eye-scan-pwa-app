import { Exercise1, Exercise2, Exercise3 } from '@/assets/images';
import { StaticImageData } from 'next/image';

export interface ExerciseCategory {
	id: string;
	title: string;
	name: string;
	description: string;
	image: StaticImageData;
	playlistId: string;
}

export const exerciseCategories: ExerciseCategory[] = [
	{
		id: 'stress-relief',
		title: 'Stress relief',
		name: 'Stress relief',
		description: 'Exercises designed to relieve eye stress and tension',
		image: Exercise2,
		playlistId: '676994d5-d8d7-402f-b0e6-f4e3f5ec3b74',
	},
	{
		id: 'improve-eye-health',
		title: 'Improve eye health',
		name: 'Improve eye health',
		description: 'Exercises to enhance overall eye health and function',
		image: Exercise3,
		playlistId: 'f21f5664-0dca-4bcf-80eb-edf6f812468c',
	},
	{
		id: 'eye-strain-relief',
		title: 'Eye strain relief',
		name: 'Eye strain relief',
		description: 'Exercises to reduce eye strain from screen time',
		image: Exercise1,
		playlistId: 'f4538911-1cd1-481f-8d11-63a14fec28fc',
	},
];
