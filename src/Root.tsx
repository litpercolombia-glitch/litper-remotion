import React from 'react';
import {Composition} from 'remotion';
import {TestComp} from './Test';
import {HookIntro} from './HookIntro';
import {HookIntroV2} from './HookIntroV2';
import {HookIntroV3} from './HookIntroV3';

const SOURCE_DURATION_FRAMES = 716; // 23.8667s @ 30fps

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="test-comp"
				component={TestComp}
				durationInFrames={60}
				fps={30}
				width={1080}
				height={1920}
			/>
			<Composition
				id="hook-intro-still"
				component={HookIntro}
				durationInFrames={50}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{hookWord: 'DATOS', introFrames: 40}}
			/>
			<Composition
				id="pilot-full"
				component={HookIntro}
				durationInFrames={SOURCE_DURATION_FRAMES}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{hookWord: 'DATOS', introFrames: 40}}
			/>
			<Composition
				id="v2-still"
				component={HookIntroV2}
				durationInFrames={30}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{
					hookWord: 'DATOS',
					introFrames: 24,
					interruptFrames: 5,
					offerStart: 585,
					offerEnd: 675,
					offerLabel: 'PAGA 1 Y LLEVA 8 PRODUCTOS',
				}}
			/>
			<Composition
				id="pilot-v2-full"
				component={HookIntroV2}
				durationInFrames={SOURCE_DURATION_FRAMES}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{
					hookWord: 'DATOS',
					introFrames: 24,
					interruptFrames: 5,
					offerStart: 585,
					offerEnd: 675,
					offerLabel: 'PAGA 1 Y LLEVA 8 PRODUCTOS',
				}}
			/>
			<Composition
				id="v3-still"
				component={HookIntroV3}
				durationInFrames={40}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{
					hookWord: 'DATOS',
					introFrames: 34,
					pulseFrames: 4,
					offerStart: 585,
					offerEnd: 675,
					offerLabel: 'Paga 1 y lleva 8 productos',
				}}
			/>
			<Composition
				id="pilot-v3-full"
				component={HookIntroV3}
				durationInFrames={SOURCE_DURATION_FRAMES}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{
					hookWord: 'DATOS',
					introFrames: 34,
					pulseFrames: 4,
					offerStart: 585,
					offerEnd: 675,
					offerLabel: 'Paga 1 y lleva 8 productos',
				}}
			/>
			{/* LOTE_02 — ronda real, 5 videos, V3 elegante aprobado por el CEO, accento por video para variedad (Paso 5-bis) */}
			<Composition
				id="lote02-1"
				component={HookIntroV3}
				durationInFrames={546}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{
					hookWord: 'CASTIGO',
					introFrames: 34,
					pulseFrames: 4,
					offerStart: 414,
					offerEnd: 528,
					offerLabel: 'Paga 2 y lleva 8, sin tarjeta',
					videoFile: 'lote02_1.mp4',
					accentColor: '#d4af37',
				}}
			/>
			<Composition
				id="lote02-2"
				component={HookIntroV3}
				durationInFrames={518}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{
					hookWord: 'BACTERIAS',
					introFrames: 34,
					pulseFrames: 4,
					offerStart: 399,
					offerEnd: 516,
					offerLabel: 'Paga 2 y lleva 8, sin tarjeta',
					videoFile: 'lote02_2.mp4',
					accentColor: '#b76e79',
				}}
			/>
			<Composition
				id="lote02-3"
				component={HookIntroV3}
				durationInFrames={634}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{
					hookWord: '78%',
					introFrames: 34,
					pulseFrames: 4,
					offerStart: 507,
					offerEnd: 630,
					offerLabel: 'Paga 2 y lleva 8 artículos',
					videoFile: 'lote02_3.mp4',
					accentColor: '#c9c9c9',
				}}
			/>
			<Composition
				id="lote02-4"
				component={HookIntroV3}
				durationInFrames={633}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{
					hookWord: 'MAL',
					introFrames: 34,
					pulseFrames: 4,
					offerStart: 507,
					offerEnd: 630,
					offerLabel: 'Paga 2 y lleva 8 artículos',
					videoFile: 'lote02_4.mp4',
					accentColor: '#b87333',
				}}
			/>
			<Composition
				id="lote02-5"
				component={HookIntroV3}
				durationInFrames={450}
				fps={30}
				width={1080}
				height={1920}
				defaultProps={{
					hookWord: 'SUDAS',
					introFrames: 30,
					pulseFrames: 4,
					offerStart: 330,
					offerEnd: 375,
					offerLabel: 'Sin tarjeta, paga al recibir',
					videoFile: 'lote02_5.mp4',
					accentColor: '#d4af37',
				}}
			/>
		</>
	);
};
