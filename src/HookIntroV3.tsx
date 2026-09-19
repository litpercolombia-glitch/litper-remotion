import React from 'react';
import {
	AbsoluteFill,
	OffthreadVideo,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
	interpolate,
	Easing,
} from 'remotion';

const W = 1080;
const H = 1920;
const CX = W / 2;
const CY = H / 2;

// ---- Film grain: a static SVG noise texture, low-opacity, overlay blend.
// This is the "craft as luxury" / "analog nostalgia" cue from the 2026
// motion-design research — a subtle imperfection that reads as premium
// rather than a cheap flat digital look.
const DEFAULT_ACCENT = '#d4af37';

const Grain: React.FC<{opacity?: number}> = ({opacity = 0.05}) => (
	<AbsoluteFill style={{mixBlendMode: 'overlay', opacity, pointerEvents: 'none'}}>
		<svg width="100%" height="100%">
			<filter id="grain">
				<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
				<feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0" />
			</filter>
			<rect width="100%" height="100%" filter="url(#grain)" />
		</svg>
	</AbsoluteFill>
);

// ---- Elegant exposure pulse: a single soft flash + tiny scale punch,
// no color-split glitch. Reads as a considered camera-flash beat rather
// than a "gamer" effect — the restrained version of a pattern interrupt.
const ExposurePulse: React.FC<{frames: number}> = ({frames}) => {
	const frame = useCurrentFrame();
	if (frame >= frames) return null;
	const flash = interpolate(frame, [0, frames], [0.85, 0], {
		easing: Easing.out(Easing.quad),
	});
	return <AbsoluteFill style={{backgroundColor: 'white', opacity: flash}} />;
};

// ---- Kinetic word (video-as-text-mask), slower and smoother — an
// editorial reveal instead of a bouncy pop.
const KineticReveal: React.FC<{hookWord: string; introFrames: number; accentColor?: string}> = ({
	hookWord,
	introFrames,
	accentColor = DEFAULT_ACCENT,
}) => {
	const frame = useCurrentFrame();
	const textOpacity = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
	const textTracking = interpolate(frame, [0, 14], [26, 2], {
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	const wipeStart = 16;
	const wipeEnd = 34;
	const radius = interpolate(frame, [wipeStart, wipeEnd], [0, 2700], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.45, 0, 0.2, 1),
	});
	const coverActive = frame < introFrames;
	if (!coverActive) return null;
	return (
		<AbsoluteFill>
			<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
				<defs>
					<mask id="hook-mask-v3" maskUnits="userSpaceOnUse">
						<rect x={0} y={0} width={W} height={H} fill="white" />
						<text
							x={CX}
							y={CY}
							textAnchor="middle"
							dominantBaseline="middle"
							fontFamily="Georgia, 'Times New Roman', serif"
							fontWeight={700}
							fontSize={128}
							fill="black"
							opacity={textOpacity}
							style={{letterSpacing: `${textTracking}px`}}
						>
							{hookWord}
						</text>
						<circle cx={CX} cy={CY} r={radius} fill="black" />
					</mask>
				</defs>
				<rect x={0} y={0} width={W} height={H} fill="#0a0a0a" mask="url(#hook-mask-v3)" />
				{/* thin gold hairline under the word while it's still covering the frame */}
				{frame < wipeStart + 4 && (
					<rect
						x={CX - 90}
						y={CY + 58}
						width={interpolate(frame, [8, 16], [0, 180], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
						height={2}
						fill={accentColor}
						opacity={textOpacity}
					/>
				)}
			</svg>
		</AbsoluteFill>
	);
};

// ---- Offer card: glassmorphism dark card, thin gold rule, small caps —
// the elegant counterpart to the earlier loud gradient pill.
const OfferCard: React.FC<{
	startFrame: number;
	endFrame: number;
	label: string;
	accentColor?: string;
}> = ({startFrame, endFrame, label, accentColor = DEFAULT_ACCENT}) => {
	const frame = useCurrentFrame();
	if (frame < startFrame || frame > endFrame) return null;
	const local = frame - startFrame;
	const enter = interpolate(local, [0, 14], [0, 1], {
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	const exit = interpolate(frame, [endFrame - 8, endFrame], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const translateY = interpolate(enter, [0, 1], [30, 0]);
	return (
		<AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 780}}>
			<div
				style={{
					transform: `translateY(${translateY}px)`,
					opacity: enter * exit,
					background: 'rgba(10, 10, 10, 0.62)',
					backdropFilter: 'blur(6px)',
					borderRadius: 10,
					padding: '26px 46px',
					maxWidth: 900,
					border: `1px solid ${accentColor}A6`,
					textAlign: 'center',
				}}
			>
				<div style={{width: 46, height: 1.5, background: accentColor, margin: '0 auto 12px'}} />
				<span
					style={{
						color: '#f6f1e7',
						fontFamily: 'Georgia, serif',
						fontWeight: 700,
						fontSize: 40,
						letterSpacing: 1.5,
						textTransform: 'uppercase',
						display: 'block',
						lineHeight: 1.2,
					}}
				>
					{label}
				</span>
			</div>
		</AbsoluteFill>
	);
};

export const HookIntroV3: React.FC<{
	hookWord: string;
	introFrames: number;
	pulseFrames: number;
	offerStart: number;
	offerEnd: number;
	offerLabel: string;
	videoFile?: string;
	accentColor?: string;
}> = ({
	hookWord,
	introFrames,
	pulseFrames,
	offerStart,
	offerEnd,
	offerLabel,
	videoFile = 'source.mp4',
	accentColor = DEFAULT_ACCENT,
}) => {
	const frame = useCurrentFrame();
	const videoScale = interpolate(frame, [0, introFrames], [1.06, 1], {
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	return (
		<AbsoluteFill style={{backgroundColor: '#0a0a0a'}}>
			<AbsoluteFill style={{transform: `scale(${videoScale})`}}>
				<OffthreadVideo src={staticFile(videoFile)} muted />
			</AbsoluteFill>
			<KineticReveal hookWord={hookWord} introFrames={introFrames} accentColor={accentColor} />
			<ExposurePulse frames={pulseFrames} />
			<OfferCard startFrame={offerStart} endFrame={offerEnd} label={offerLabel} accentColor={accentColor} />
			<Grain />
		</AbsoluteFill>
	);
};
