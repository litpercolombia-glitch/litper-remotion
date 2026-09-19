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

export const HookIntro: React.FC<{
	hookWord: string;
	introFrames: number;
}> = ({hookWord, introFrames}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	// Text mask phase: word appears filled with the video, scaling in with a bounce
	const textScale = spring({
		frame,
		fps,
		config: {damping: 14, stiffness: 120, mass: 0.6},
	});

	// Circle wipe phase: starts after the word has landed, grows to cover the screen
	const wipeStart = 18;
	const wipeEnd = 38;
	const radius = interpolate(frame, [wipeStart, wipeEnd], [0, 2600], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.65, 0, 0.35, 1),
	});

	// Black cover fades away completely once the wipe finishes, so after
	// introFrames the tree is cheap (no mask layers) for the rest of the video.
	const coverActive = frame < introFrames;

	// A subtle punch-in on the underlying video during the intro for energy
	const videoScale = interpolate(frame, [0, introFrames], [1.08, 1], {
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			{/* Base video, always full-frame */}
			<AbsoluteFill style={{transform: `scale(${videoScale})`}}>
				<OffthreadVideo src={staticFile('source.mp4')} muted />
			</AbsoluteFill>

			{coverActive && (
				<AbsoluteFill>
					<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
						<defs>
							<mask id="hook-mask" maskUnits="userSpaceOnUse">
								{/* white = cover stays opaque (black) here */}
								<rect x={0} y={0} width={W} height={H} fill="white" />
								{/* black punch-outs = holes revealing the video underneath */}
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
						<rect
							x={0}
							y={0}
							width={W}
							height={H}
							fill="black"
							mask="url(#hook-mask)"
						/>
					</svg>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};
