import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';

export const TestComp: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const scale = spring({frame, fps, config: {damping: 12}});
	const opacity = interpolate(frame, [0, 15], [0, 1], {extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{backgroundColor: '#0b1220', justifyContent: 'center', alignItems: 'center'}}>
			<div style={{transform: `scale(${scale})`, opacity, color: 'white', fontSize: 90, fontWeight: 900, fontFamily: 'sans-serif'}}>
				LITPER TEST
			</div>
		</AbsoluteFill>
	);
};
