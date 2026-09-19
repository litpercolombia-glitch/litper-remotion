import React from 'react';
import {
	AbsoluteFill,
	OffthreadVideo,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	spring,
	Easing,
} from 'remotion';

const W = 1080;
const H = 1920;
const CX = W / 2;
const CY = H / 2;

// ---- Pattern interrupt: quick chromatic-aberration jitter in the first
// frames, per the research finding "start with a powerful visual/pattern
// interrupt in frame 1 to stop the thumb" (Trendtrack, 2026).
const PatternInterrupt: React.FC<{frames: number}> = ({frames}) => {
	const frame = useCurrentFrame();
	if (frame >= frames) return null;
	const t = frame / frames;
	const jitter = interpolate(t, [0, 1], [22, 0], {easing: Easing.out(Easing.cubic)});
	const flash = interpolate(frame, [0, 1, 3], [1, 0.6, 0], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{mixBlendMode: 'screen'}}>
			<AbsoluteFill style={{transform: `translateX(${jitter}px)`, opacity: 0.55, filter: 'sepia(1) saturate(6) hue-rotate(-50deg)'}}>
				<OffthreadVideo src={staticFile('source.mp4')} muted />
			</AbsoluteFill>
			<AbsoluteFill style={{transform: `translateX(${-jitter}px)`, opacity: 0.55, filter: 'sepia(1) saturate(6) hue-rotate(150deg)'}}>
				<OffthreadVideo src={staticFile('source.mp4')} muted />
			</AbsoluteFill>
			<AbsoluteFill style={{backgroundColor: 'white', opacity: flash}} />
		</AbsoluteFill>
	);
};

// ---- Kinetic word (video-as-text-mask) + fast iris wipe reveal.
// Compressed to ~0.8s total per "skip slow intros" (Trendtrack): the hook
// itself is the visual, no lingering logo/fade before it.
const KineticReveal: React.FC<{hookWord: string; introFrames: number}> = ({
	hookWord,
	introFrames,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const textScale = spring({frame, fps, config: {damping: 11, stiffness: 200, mass: 0.5}});
	const wipeStart = 10;
	const wipeEnd = 22;
	const radius = interpolate(frame, [wipeStart, wipeEnd], [0, 2600], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.65, 0, 0.35, 1),
	});
	const coverActive = frame < introFrames;
	if (!coverActive) return null;
	return (
		<AbsoluteFill>
			<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
				<defs>
					<mask id="hook-mask-v2" maskUnits="userSpaceOnUse">
						<rect x={0} y={0} width={W} height={H} fill="white" />
						<text
							x={CX}
							y={CY}
							textAnchor="middle"
							dominantBaseline="middle"
							fontFamily="Arial, sans-serif"
							fontWeight={900}
							fontSize={158}
							fill="black"
							transform={`translate(${CX} ${CY}) scale(${textScale}) translate(${-CX} ${-CY})`}
						>
							{hookWord}
						</text>
						<circle cx={CX} cy={CY} r={radius} fill="black" />
					</mask>
				</defs>
				<rect x={0} y={0} width={W} height={H} fill="black" mask="url(#hook-mask-v2)" />
			</svg>
		</AbsoluteFill>
	);
};

// ---- Offer badge: bold text on a solid-color card, slides in + pulses.
// Directly implements the "bold text overlay on solid background" +
// "large animated text" pattern (Stackmatix / Trendtrack, 2026) at the
// exact moment the offer line is spoken, to reinforce the CTA visually
// (this is the lever most tied to cost-per-result, per the research: the
// offer/CTA needs to be unmissable even with sound off).
const OfferBadge: React.FC<{
	startFrame: number;
	endFrame: number;
	label: string;
}> = ({startFrame, endFrame, label}) => {
	const frame = useCurrentFrame();
	if (frame < startFrame || frame > endFrame) return null;
	const local = frame - startFrame;
	const enter = spring({frame: local, fps: 30, config: {damping: 12, stiffness: 180}});
	const pulse = 1 + Math.sin(local / 6) * 0.02;
	const exit = interpolate(frame, [endFrame - 8, endFrame], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const translateY = interpolate(enter, [0, 1], [120, 0]);
	return (
		<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 780}}>
			<div
				style={{
					transform: `translateY(${translateY}px) scale(${pulse})`,
					opacity: exit,
					background: 'linear-gradient(135deg, #ff2e63, #ff6a3d)',
					borderRadius: 28,
					padding: '24px 44px',
					maxWidth: 880,
					boxShadow: '0 18px 40px rgba(0,0,0,0.45)',
					border: '4px solid white',
				}}
			>
				<span style={{color: 'white', fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 44, letterSpacing: -0.5, textAlign: 'center', display: 'block', lineHeight: 1.05}}>
					{label}
				</span>
			</div>
		</AbsoluteFill>
	);
};

export const HookIntroV2: React.FC<{
	hookWord: string;
	introFrames: number;
	interruptFrames: number;
	offerStart: number;
	offerEnd: number;
	offerLabel: string;
}> = ({hookWord, introFrames, interruptFrames, offerStart, offerEnd, offerLabel}) => {
	const frame = useCurrentFrame();
	const videoScale = interpolate(frame, [0, introFrames], [1.1, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<AbsoluteFill style={{transform: `scale(${videoScale})`}}>
				<OffthreadVideo src={staticFile('source.mp4')} muted />
			</AbsoluteFill>
			<KineticReveal hookWord={hookWord} introFrames={introFrames} />
			<PatternInterrupt frames={interruptFrames} />
			<OfferBadge startFrame={offerStart} endFrame={offerEnd} label={offerLabel} />
		</AbsoluteFill>
	);
};
